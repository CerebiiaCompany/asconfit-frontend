import { Auditoria } from "../types/auditoria";
import { Finding } from "../services/findingService";
import { InformePreliminarIA } from "../types/informePreliminar";
import { SEVERIDAD_CONFIG } from "../types/finding.types";
import { printHtmlWithWatermark } from "./pdfWatermark";
import { LOGO_OSCURO_PATH } from "./excelLogo";

/** Escapa el texto (lo genera la IA o el usuario) antes de insertarlo en el HTML del PDF. */
const esc = (v: unknown): string =>
    String(v ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

const SEVERIDAD_HEX: Record<string, string> = {
    critico: "#dc2626", grave: "#ca8a04", leve: "#16a34a",
};

const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const formatDate = (d?: string) => {
    if (!d) return "";
    const [y, m, day] = (d.includes("T") ? d.split("T")[0] : d).split("-");
    return `${parseInt(day)} de ${MESES[parseInt(m) - 1]} de ${y}`;
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

    return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"/>
  <title>Informe Preliminar – ${esc(empresa)}</title>
  <style>
    *{-webkit-print-color-adjust:exact;print-color-adjust:exact;box-sizing:border-box;}
    @page{size:A4;margin:16mm 14mm;}
    body{font-family:'Segoe UI',Arial,sans-serif;margin:0;padding:0;color:#0f172a;font-size:12px;line-height:1.55;}
    header{display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid #f97316;padding-bottom:10px;margin-bottom:16px;}
    header img{height:30px;}
    header .meta{text-align:right;font-size:11px;color:#475569;}
    h1{font-size:18px;margin:0 0 2px;}
    h2{font-size:12px;margin:20px 0 8px;color:#ea580c;text-transform:uppercase;letter-spacing:.05em;border-bottom:1px solid #e2e8f0;padding-bottom:4px;}
    h3{font-size:11px;margin:14px 0 6px;color:#ea580c;text-transform:uppercase;letter-spacing:.05em;}
    h4{font-size:12px;margin:0 0 4px;}
    p{margin:0 0 6px;text-align:justify;}
    .muted{color:#64748b;font-size:11px;}
    .resumen{display:flex;gap:8px;margin:10px 0 4px;}
    .resumen div{flex:1;border:1px solid #e2e8f0;border-radius:6px;padding:6px 8px;text-align:center;}
    .resumen b{display:block;font-size:15px;}
    .subtarea{font-weight:600;margin:8px 0 6px;}
    .hallazgo{border:1px solid #e2e8f0;border-left:4px solid;border-radius:6px;padding:8px 10px;margin-bottom:8px;page-break-inside:avoid;}
    .badge{color:#fff;font-size:9px;font-weight:700;padding:2px 6px;border-radius:4px;margin-left:6px;vertical-align:middle;}
    .label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#334155;margin:6px 0 2px;}
    .label.naranja{color:#c2410c;}
    .conclusion{background:#fff7ed;border:1px solid #fed7aa;border-radius:6px;padding:6px 8px;margin-top:6px;}
    footer{margin-top:24px;font-size:10px;color:#94a3b8;text-align:center;}
  </style>
</head>
<body>
  <header>
    <img src="${window.location.origin}${LOGO_OSCURO_PATH}" alt="ASCONFIT"/>
    <div class="meta">${esc(fecha)}</div>
  </header>

  <h1>Informe Preliminar</h1>
  <p class="muted">${esc(empresa)}${auditoria.tipo_auditoria ? ` — Auditoría ${esc(auditoria.tipo_auditoria)}` : ""}</p>

  <div class="resumen">
    <div><b>${subtareas.length}</b><span class="muted">Requerimientos</span></div>
    <div><b>${aprobadas}</b><span class="muted">Aprobados</span></div>
    <div><b>${subtareas.length - aprobadas}</b><span class="muted">Pendientes</span></div>
    <div><b>${findings.length}</b><span class="muted">Hallazgos</span></div>
  </div>

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
