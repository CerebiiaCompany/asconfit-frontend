import { AnalysisResult } from "../types/aiAnalysis";
import { printHtmlWithWatermark } from "./pdfWatermark";
import { LOGO_OSCURO_PATH } from "./excelLogo";

/** Escapa el texto (lo genera la IA) antes de insertarlo en el HTML del PDF. */
const esc = (v: unknown): string =>
    String(v ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

const SEVERIDAD_COLOR: Record<string, string> = {
    "CRÍTICA": "#dc2626", "ALTA": "#d97706", "MEDIA": "#ea580c", "BAJA": "#64748b",
};
const GLOBAL_COLOR: Record<string, string> = {
    "CRÍTICO": "#dc2626", "ALTO": "#d97706", "MEDIO": "#ea580c", "BAJO": "#16a34a",
};

interface AIReportMeta {
    empresa: string;
    tipoAuditoria: string;
}

function buildHtml(data: AnalysisResult, meta: AIReportMeta): string {
    const fecha = new Date().toLocaleDateString("es-CO", { day: "2-digit", month: "long", year: "numeric" });
    const global = data.resumen?.calificacion_global ?? "";

    const areas = (data.resumen?.areas_exposicion ?? [])
        .map((a) => `<span class="chip">${esc(a)}</span>`).join("");

    const alertas = (data.alertas ?? []).map((a) => `
      <div class="alerta" style="border-left-color:${SEVERIDAD_COLOR[a.severidad] ?? "#64748b"}">
        <div class="alerta-top">
          <span class="badge" style="background:${SEVERIDAD_COLOR[a.severidad] ?? "#64748b"}">${esc(a.severidad)}</span>
          <span class="muted">Probabilidad: ${esc(a.probabilidad)} · Área: ${esc(a.area)}</span>
        </div>
        <h3>${esc(a.titulo)}</h3>
        <p>${esc(a.descripcion)}</p>
        <p class="small"><b>Normativa:</b> ${esc(a.normativa)}</p>
        <p class="small"><b>Impacto:</b> ${esc(a.impacto)}</p>
      </div>`).join("");

    const grupo = (titulo: string, items?: string[]) => `
      <div class="grupo">
        <h4>${titulo}</h4>
        ${items?.length ? `<ul>${items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>` : `<p class="muted">Sin recomendaciones</p>`}
      </div>`;

    return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"/>
  <title>Análisis de Riesgo IA – ${esc(meta.empresa)}</title>
  <style>
    *{-webkit-print-color-adjust:exact;print-color-adjust:exact;box-sizing:border-box;}
    @page{size:A4;margin:14mm;}
    body{font-family:'Segoe UI',Arial,sans-serif;margin:0;padding:0;color:#0f172a;font-size:12px;line-height:1.45;}
    header{display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid #f97316;padding-bottom:10px;margin-bottom:16px;}
    header img{height:30px;}
    header .meta{text-align:right;font-size:11px;color:#475569;}
    h1{font-size:18px;margin:0 0 4px;}
    h2{font-size:14px;margin:20px 0 8px;color:#0f172a;border-bottom:1px solid #e2e8f0;padding-bottom:4px;}
    h3{font-size:13px;margin:6px 0 4px;}
    h4{font-size:12px;margin:0 0 6px;}
    p{margin:0 0 6px;}
    .muted{color:#64748b;font-size:11px;}
    .small{font-size:11px;color:#334155;}
    .global{display:inline-block;padding:3px 10px;border-radius:999px;color:#fff;font-weight:700;font-size:11px;}
    .sintesis{background:#fff7ed;border:1px solid #fed7aa;border-radius:8px;padding:10px 12px;margin:8px 0;}
    .chip{display:inline-block;background:#f1f5f9;border-radius:999px;padding:2px 8px;margin:2px 4px 2px 0;font-size:10px;color:#334155;}
    .alerta{border:1px solid #e2e8f0;border-left:4px solid;border-radius:6px;padding:8px 10px;margin-bottom:8px;page-break-inside:avoid;}
    .alerta-top{display:flex;justify-content:space-between;align-items:center;}
    .badge{color:#fff;font-size:9px;font-weight:700;padding:2px 6px;border-radius:4px;letter-spacing:.05em;}
    .grupo{border:1px solid #e2e8f0;border-radius:6px;padding:8px 10px;margin-bottom:8px;page-break-inside:avoid;}
    .grupo ul{margin:0;padding-left:18px;}
    .grupo li{margin-bottom:3px;}
    footer{margin-top:20px;font-size:10px;color:#94a3b8;text-align:center;}
  </style>
</head>
<body>
  <header>
    <img src="${window.location.origin}${LOGO_OSCURO_PATH}" alt="ASCONFIT"/>
    <div class="meta">${esc(fecha)}</div>
  </header>

  <h1>Análisis de Riesgo Predictivo</h1>
  <p class="muted">${esc(meta.empresa)}${meta.tipoAuditoria ? ` — Auditoría ${esc(meta.tipoAuditoria)}` : ""}</p>

  <h2>Dictamen ejecutivo ${global ? `<span class="global" style="background:${GLOBAL_COLOR[global] ?? "#64748b"}">Riesgo ${esc(global)}</span>` : ""}</h2>
  <div class="sintesis">${esc(data.resumen?.sintesis)}</div>
  ${areas ? `<p class="small"><b>Áreas de exposición:</b></p><div>${areas}</div>` : ""}

  <h2>Alertas de riesgo</h2>
  ${alertas || `<p class="muted">Sin alertas</p>`}

  ${data.recomendaciones ? `
  <h2>Plan de acción</h2>
  ${grupo("Inmediato (0–30 días)", data.recomendaciones.inmediato)}
  ${grupo("Corto plazo (1–3 meses)", data.recomendaciones.corto_plazo)}
  ${grupo("Mediano plazo (3–12 meses)", data.recomendaciones.mediano_plazo)}` : ""}

  <footer>Informe generado con IA a partir de los hallazgos registrados en ASCONFIT. Debe ser revisado por el auditor responsable.</footer>
</body>
</html>`;
}

/** Abre el informe de IA listo para "Guardar como PDF", con la marca de agua de ASCONFIT. */
export function exportAIReportPdf(data: AnalysisResult, meta: AIReportMeta): void {
    printHtmlWithWatermark(buildHtml(data, meta));
}
