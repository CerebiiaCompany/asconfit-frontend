import { Auditoria } from "../types/auditoria";
import { Finding } from "../services/findingService";
import { InformePreliminarIA } from "../types/informePreliminar";
import { SEVERIDAD_CONFIG } from "../types/finding.types";
import { printHtmlWithWatermark } from "./pdfWatermark";
import { LOGO_OSCURO_PATH } from "./excelLogo";
import { CHART_STYLE, ChartDatum, barList, donutChart, progressList, stackedBars } from "./pdfCharts";

/**
 * PDF del informe preliminar para la junta directiva: primero una página visual
 * (indicadores, gráficas, plan de acción y matriz de hallazgos) y luego el texto
 * redactado por la IA. Las gráficas salen de los datos de la auditoría, así que
 * no gastan tokens; la IA solo aporta los textos que ya muestra la página.
 */

const esc = (v: unknown): string =>
    String(v ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

const SEVERIDAD_HEX: Record<string, string> = { critico: "#dc2626", grave: "#f59e0b", leve: "#16a34a" };
const SEVERIDADES = ["critico", "grave", "leve"] as const;

const ESTADOS_REQ: { key: string; label: string; color: string }[] = [
    { key: "aprobado", label: "Aprobados", color: "#16a34a" },
    { key: "revision", label: "En revisión", color: "#3b82f6" },
    { key: "recibido", label: "Recibidos", color: "#8b5cf6" },
    { key: "pendiente", label: "Pendientes", color: "#f59e0b" },
];

const PRIORIDAD_HEX: Record<string, string> = { alta: "#dc2626", media: "#f59e0b", baja: "#16a34a" };

const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const ymd = (d?: string | null) => (d ? (d.includes("T") ? d.split("T")[0] : d).slice(0, 10) : "");
const formatDate = (d?: string | null) => {
    const v = ymd(d);
    if (!v) return "";
    const [y, m, day] = v.split("-");
    return `${parseInt(day)} de ${MESES[parseInt(m) - 1]} de ${y}`;
};
const formatCorta = (d?: string | null) => {
    const v = ymd(d);
    if (!v) return "";
    const [y, m, day] = v.split("-");
    return `${day}/${m}/${y}`;
};

const SITUACION_HEX = {
    "Vencido": "#dc2626",
    "Por vencer": "#f59e0b",
    "En plazo": "#16a34a",
    "Sin fecha": "#94a3b8",
} as const;
type Situacion = keyof typeof SITUACION_HEX;

/** Situación del plazo de un hallazgo respecto a hoy ("Por vencer" = 15 días o menos). */
const situacion = (fecha?: string | null): { label: Situacion; color: string } => {
    const v = ymd(fecha);
    const hoy = new Date();
    const hoyStr = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, "0")}-${String(hoy.getDate()).padStart(2, "0")}`;
    const dias = v ? (new Date(`${v}T00:00:00`).getTime() - new Date(`${hoyStr}T00:00:00`).getTime()) / 86400000 : NaN;
    const label: Situacion = !v ? "Sin fecha" : dias < 0 ? "Vencido" : dias <= 15 ? "Por vencer" : "En plazo";
    return { label, color: SITUACION_HEX[label] };
};

const parrafos = (texto?: string) =>
    texto
        ? texto.split(/\n\s*\n/).filter(Boolean).map((p) => `<p>${esc(p)}</p>`).join("")
        : `<p class="muted">No disponible.</p>`;

interface PreliminaryReportData {
    auditoria: Auditoria;
    findings: Finding[];
    informe: InformePreliminarIA | null;
    empresa: string;
}

function buildHtml({ auditoria, findings, informe, empresa }: PreliminaryReportData): string {
    const fecha = new Date().toLocaleDateString("es-CO", { day: "2-digit", month: "long", year: "numeric" });
    const conclusiones = new Map<number, string>();
    informe?.hallazgos?.forEach((h) => h.finding_id && h.conclusion && conclusiones.set(h.finding_id, h.conclusion));

    const categorias = (auditoria.categorias ?? []).filter((c) => (c.subtareas ?? []).length > 0);
    const subtareas = categorias.flatMap((c) => c.subtareas ?? []);
    const aprobadas = subtareas.filter((s) => s.estado_informacion === "aprobado").length;
    const avance = subtareas.length ? Math.round((aprobadas / subtareas.length) * 100) : 0;
    const criticos = findings.filter((f) => f.severidad === "critico").length;
    const vencidos = findings.filter((f) => situacion(f.fecha_limite).label === "Vencido").length;

    // ---- Datos de las gráficas (sin IA)
    const reqPorEstado: ChartDatum[] = ESTADOS_REQ.map((e) => ({
        label: e.label,
        color: e.color,
        value: subtareas.filter((s) => (s.estado_informacion || "pendiente") === e.key).length,
    })).filter((d) => d.value > 0);

    const hallPorSeveridad: ChartDatum[] = SEVERIDADES.map((k) => ({
        label: SEVERIDAD_CONFIG[k].label,
        color: SEVERIDAD_HEX[k],
        value: findings.filter((f) => f.severidad === k).length,
    }));

    const avancePorCategoria = categorias.map((c) => ({
        label: c.nombre,
        done: (c.subtareas ?? []).filter((s) => s.estado_informacion === "aprobado").length,
        total: (c.subtareas ?? []).length,
    }));

    const categoriaDe = (f: Finding) =>
        categorias.find((c) => (c.subtareas ?? []).some((s) => s.id === f.actividad_id))?.nombre ?? "Generales";
    const nombresCat = Array.from(new Set(findings.map(categoriaDe)));
    const hallPorCategoria = nombresCat.map((nombre) => ({
        label: nombre,
        parts: SEVERIDADES.map((k) => ({
            label: SEVERIDAD_CONFIG[k].label,
            color: SEVERIDAD_HEX[k],
            value: findings.filter((f) => categoriaDe(f) === nombre && f.severidad === k).length,
        })),
    }));

    const situaciones: ChartDatum[] = Object.entries(SITUACION_HEX).map(([label, color]) => ({
        label,
        color,
        value: findings.filter((f) => situacion(f.fecha_limite).label === label).length,
    })).filter((d) => d.value > 0);

    // ---- Matriz resumen de hallazgos (ordenada por severidad)
    const ordenados = [...findings].sort(
        (a, b) => SEVERIDADES.indexOf(a.severidad as any) - SEVERIDADES.indexOf(b.severidad as any),
    );
    const matriz = ordenados.map((f, i) => {
        const sev = SEVERIDAD_CONFIG[f.severidad as keyof typeof SEVERIDAD_CONFIG];
        const sit = situacion(f.fecha_limite);
        return `
        <tr>
          <td class="num">${i + 1}</td>
          <td>${esc(f.titulo)}<div class="muted">${esc(categoriaDe(f))}</div></td>
          <td><span class="badge" style="background:${SEVERIDAD_HEX[f.severidad as string] ?? "#64748b"}">${esc(sev?.label ?? f.severidad)}</span></td>
          <td>${esc(f.responsable || "—")}</td>
          <td class="nowrap">${esc(formatCorta(f.fecha_limite) || "—")}</td>
          <td class="nowrap"><span class="dot" style="background:${sit.color}"></span>${sit.label}</td>
        </tr>`;
    }).join("");

    const plan = (informe?.plan_accion ?? []).map((p) => `
        <tr>
          <td>${esc(p.accion)}</td>
          <td class="nowrap">${esc(p.plazo)}</td>
          <td class="nowrap"><span class="badge" style="background:${PRIORIDAD_HEX[p.prioridad] ?? "#64748b"}">${esc(p.prioridad.charAt(0).toUpperCase() + p.prioridad.slice(1))}</span></td>
        </tr>`).join("");

    // ---- Detalle narrativo de hallazgos (texto de la IA)
    let numero = 0;
    const hallazgo = (f: Finding) => {
        numero += 1;
        const sev = SEVERIDAD_CONFIG[f.severidad as keyof typeof SEVERIDAD_CONFIG];
        const color = SEVERIDAD_HEX[f.severidad as string] ?? "#64748b";
        const conclusion = f.id ? conclusiones.get(f.id) : undefined;
        const detalle = [
            f.descripcion || f.titulo,
            f.responsable ? `Responsable: ${f.responsable}` : "",
            f.fecha_limite ? `Fecha límite: ${formatDate(f.fecha_limite)}` : "",
        ].filter(Boolean).join(". ");
        return `
        <div class="hallazgo" style="border-left-color:${color}">
          <h4>Hallazgo ${numero}: ${esc(f.titulo)}
            ${sev ? `<span class="badge" style="background:${color}">${esc(sev.label)}</span>` : ""}</h4>
          ${f.actividad?.nombre ? `<p class="muted">Actividad: ${esc(f.actividad.nombre)}</p>` : ""}
          <p class="label">Problema identificado</p>
          <p>${esc(detalle)}</p>
          <div class="conclusion">
            <p class="label naranja">Conclusión y recomendaciones</p>
            <p>${conclusion ? esc(conclusion) : `<span class="muted">No se generó conclusión para este hallazgo.</span>`}</p>
          </div>
        </div>`;
    };

    const bloquesCategorias = categorias.map((cat) => {
        const subs = (cat.subtareas ?? [])
            .map((s) => {
                const fs = findings.filter((f) => f.actividad_id === s.id);
                return fs.length ? `<p class="subtarea">${esc(s.nombre)}</p>${fs.map(hallazgo).join("")}` : "";
            })
            .join("");
        return subs ? `<h3>${esc(cat.nombre)}</h3>${subs}` : "";
    }).join("");
    const sinActividad = findings.filter((f) => !f.actividad_id);
    const bloqueGenerales = sinActividad.length ? `<h3>Generales</h3>${sinActividad.map(hallazgo).join("")}` : "";

    const periodo = auditoria.fecha_inicial || auditoria.fecha_corte
        ? `Periodo: ${formatDate(auditoria.fecha_inicial) || "—"} a ${formatDate(auditoria.fecha_corte) || "—"}`
        : "";

    return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"/>
  <title>Informe Preliminar – ${esc(empresa)}</title>
  <style>
    *{-webkit-print-color-adjust:exact;print-color-adjust:exact;box-sizing:border-box;}
    @page{size:A4;margin:14mm 13mm;}
    body{font-family:'Segoe UI',Arial,sans-serif;margin:0;padding:0;color:#0f172a;font-size:12px;line-height:1.55;}
    header{display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid #f97316;padding-bottom:10px;margin-bottom:14px;}
    header img{height:30px;}
    header .meta{text-align:right;font-size:11px;color:#475569;}
    h1{font-size:20px;margin:0 0 2px;}
    h2{font-size:14px;margin:18px 0 8px;color:#c2410c;border-bottom:1px solid #e2e8f0;padding-bottom:4px;page-break-after:avoid;break-after:avoid;}
    h3{font-size:12px;margin:14px 0 6px;color:#c2410c;}
    h4{font-size:12px;margin:0 0 4px;}
    p{margin:0 0 6px;text-align:justify;}
    .muted{color:#64748b;font-size:10.5px;}
    .kpis{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin:12px 0;}
    .kpi{border:1px solid #e2e8f0;border-radius:8px;padding:8px 10px;}
    .kpi b{display:block;font-size:20px;line-height:1.2;}
    .kpi span{font-size:10.5px;color:#475569;}
    .kpi.alerta b{color:#dc2626;}
    .resumen{background:#fff7ed;border:1px solid #fed7aa;border-left:4px solid #f97316;border-radius:6px;padding:10px 12px;margin:4px 0 6px;}
    .grid2{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:10px;}
    .panel{border:1px solid #e2e8f0;border-radius:8px;padding:10px 12px;page-break-inside:avoid;}
    .panel h5{font-size:12px;margin:0 0 8px;color:#0f172a;}
    table{width:100%;border-collapse:collapse;font-size:11px;}
    th{text-align:left;font-weight:600;color:#475569;border-bottom:2px solid #e2e8f0;padding:5px 6px;}
    td{border-bottom:1px solid #f1f5f9;padding:5px 6px;vertical-align:top;}
    tr{page-break-inside:avoid;}
    td.num{color:#64748b;width:22px;}
    .nowrap{white-space:nowrap;}
    .dot{display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:5px;}
    .badge{color:#fff;font-size:9.5px;font-weight:700;padding:2px 6px;border-radius:4px;white-space:nowrap;}
    h4 .badge{margin-left:6px;vertical-align:middle;}
    .salto{page-break-before:always;}
    .subtarea{font-weight:600;margin:8px 0 6px;}
    .hallazgo{border:1px solid #e2e8f0;border-left:4px solid;border-radius:6px;padding:8px 10px;margin-bottom:8px;page-break-inside:avoid;}
    .label{font-size:10.5px;font-weight:700;color:#334155;margin:6px 0 2px;}
    .label.naranja{color:#c2410c;}
    .conclusion{background:#fff7ed;border:1px solid #fed7aa;border-radius:6px;padding:6px 8px;margin-top:6px;}
    footer{margin-top:24px;font-size:10px;color:#94a3b8;text-align:center;}
    ${CHART_STYLE}
  </style>
</head>
<body>
  <header>
    <img src="${window.location.origin}${LOGO_OSCURO_PATH}" alt="ASCONFIT"/>
    <div class="meta">${esc(fecha)}</div>
  </header>

  <h1>Informe Preliminar de Auditoría</h1>
  <p class="muted">${esc(empresa)}${auditoria.tipo_auditoria ? `, auditoría ${esc(auditoria.tipo_auditoria.toLowerCase())}` : ""}${periodo ? `. ${esc(periodo)}` : ""}</p>

  <div class="kpis">
    <div class="kpi"><b>${subtareas.length}</b><span>Requerimientos</span></div>
    <div class="kpi"><b>${avance}%</b><span>Avance (${aprobadas} aprobados)</span></div>
    <div class="kpi"><b>${findings.length}</b><span>Hallazgos</span></div>
    <div class="kpi ${criticos ? "alerta" : ""}"><b>${criticos}</b><span>Críticos</span></div>
    <div class="kpi ${vencidos ? "alerta" : ""}"><b>${vencidos}</b><span>Con plazo vencido</span></div>
  </div>

  ${informe?.resumen_ejecutivo ? `<h2>Resumen ejecutivo</h2><div class="resumen">${esc(informe.resumen_ejecutivo)}</div>` : ""}

  <div class="grid2">
    <div class="panel"><h5>Estado de los requerimientos</h5>${donutChart(reqPorEstado, "requerimientos")}</div>
    <div class="panel"><h5>Hallazgos por severidad</h5>${donutChart(hallPorSeveridad, "hallazgos")}</div>
  </div>
  <div class="grid2">
    <div class="panel"><h5>Avance por categoría</h5>${progressList(avancePorCategoria)}</div>
    <div class="panel"><h5>Hallazgos por categoría</h5>${stackedBars(hallPorCategoria, hallPorSeveridad)}</div>
  </div>
  ${findings.length ? `
  <div class="grid2">
    <div class="panel"><h5>Plazos de los hallazgos</h5>${barList(situaciones)}</div>
    <div class="panel"><h5>Lectura rápida</h5>
      <p class="muted" style="font-size:11px">
        ${criticos ? `${criticos} hallazgo${criticos > 1 ? "s" : ""} crítico${criticos > 1 ? "s" : ""} requiere${criticos > 1 ? "n" : ""} atención prioritaria. ` : "No hay hallazgos críticos. "}
        ${vencidos ? `${vencidos} ya superó su fecha límite. ` : ""}
        ${subtareas.length - aprobadas} de ${subtareas.length} requerimientos siguen sin aprobar.
      </p>
    </div>
  </div>` : ""}

  ${plan ? `
  <h2>Plan de acción sugerido</h2>
  <table><thead><tr><th>Acción</th><th>Plazo</th><th>Prioridad</th></tr></thead><tbody>${plan}</tbody></table>` : ""}

  ${findings.length ? `
  <h2>Matriz de hallazgos</h2>
  <table>
    <thead><tr><th>#</th><th>Hallazgo</th><th>Severidad</th><th>Responsable</th><th>Fecha límite</th><th>Plazo</th></tr></thead>
    <tbody>${matriz}</tbody>
  </table>` : ""}

  <div class="salto"></div>
  <h2>Introducción</h2>
  ${parrafos(informe?.introduccion)}

  ${subtareas.length ? `<h2>Estado de requerimientos</h2>${parrafos(informe?.cierre_requerimientos)}` : ""}

  ${findings.length ? `<h2>Hallazgos identificados</h2>${parrafos(informe?.intro_hallazgos)}${bloquesCategorias}${bloqueGenerales}` : ""}

  <h2>Conclusión y recomendaciones generales</h2>
  ${parrafos(informe?.conclusion_general)}

  <footer>Informe preliminar generado con IA a partir de la información registrada en ASCONFIT. Debe ser revisado por el auditor responsable.</footer>
</body>
</html>`;
}

/** Abre el informe preliminar listo para "Guardar como PDF", con la marca de agua de ASCONFIT. */
export function exportPreliminaryReportPdf(data: PreliminaryReportData): void {
    printHtmlWithWatermark(buildHtml(data));
}
