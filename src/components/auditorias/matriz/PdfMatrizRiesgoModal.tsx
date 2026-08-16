import React, { useRef } from "react";
import { MapaCalorRiesgo, HeatMapTask, getGridLevel } from "./MapaCalorRiesgo";
import { Auditoria } from "../../../types/auditoria";

interface PdfMatrizRiesgoModalProps {
  isOpen: boolean;
  onClose: () => void;
  auditoria: Auditoria;
  subtareas: HeatMapTask[];
  stats?: any;
}

// Colores de celda para el HTML imprimible
function getCellHex(probLevel: number, impLevel: number): string {
  const isGreen =
    (probLevel === 1 && impLevel <= 3) ||
    (probLevel === 2 && impLevel <= 2) ||
    (probLevel === 3 && impLevel === 1) ||
    (probLevel === 4 && impLevel === 1);
  const isRed =
    (probLevel === 5 && impLevel >= 3) ||
    (probLevel === 4 && impLevel >= 4) ||
    (probLevel === 3 && impLevel >= 4) ||
    (probLevel === 2 && impLevel === 5);
  if (isGreen) return "#10b981";
  if (isRed) return "#e11d48";
  return "#fbbf24";
}

const PROB_LABELS = ["", "Improbable", "Posible", "Ocasional", "Moderado", "Constante"];
const IMP_LABELS = ["", "Insignificante", "Menor", "Crítica", "Mayor", "Catastrófico"];

export const PdfMatrizRiesgoModal: React.FC<PdfMatrizRiesgoModalProps> = ({
  isOpen,
  onClose,
  auditoria,
  subtareas,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  if (!isOpen) return null;

  /* Construye el HTML completo que irá dentro del iframe para imprimir */
  const buildPrintHtml = (): string => {
    const empresa = auditoria.empresa?.razon_social ?? auditoria.razon_social ?? "Auditoría";
    const nit = auditoria.empresa?.nit ?? auditoria.nit ?? "";
    const tipo = auditoria.tipo_auditoria ?? "";

    // Agrupar tareas por celda
    const cellMap: Record<string, HeatMapTask[]> = {};
    subtareas.forEach(t => {
      const imp = getGridLevel(t.gravedad);
      const prob = getGridLevel(t.probabilidad);
      const key = `${prob}-${imp}`;
      if (!cellMap[key]) cellMap[key] = [];
      cellMap[key].push(t);
    });

    /* Generar la grilla 5×5 como HTML puro */
    let gridRows = "";
    for (let prob = 5; prob >= 1; prob--) {
      let cells = `<td style="width:90px;text-align:right;padding-right:8px;font-size:10px;font-weight:bold;font-style:italic;color:#334155;">${PROB_LABELS[prob]}</td>`;
      for (let imp = 1; imp <= 5; imp++) {
        const bg = getCellHex(prob, imp);
        const key = `${prob}-${imp}`;
        const tasks = cellMap[key] ?? [];
        const compact = tasks.length > 3;
        const badges = tasks.map(t =>
          `<span style="display:inline-flex;align-items:center;justify-content:center;min-width:${compact ? '18px' : '24px'};height:${compact ? '18px' : '24px'};border-radius:50%;background:#ffffff;border:1.5px solid #0f172a;color:#0f172a;font-size:${compact ? '7px' : '9px'};font-weight:900;padding:0 2px;margin:1px;">${t.numIndex}</span>`
        ).join("");
        cells += `<td style="background:${bg};-webkit-print-color-adjust:exact;print-color-adjust:exact;border-radius:10px;width:${100 / 5}%;height:58px;max-height:58px;overflow:hidden;text-align:center;vertical-align:middle;padding:3px;"><div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:2px;max-height:52px;overflow:hidden;">${badges || '<span style="color:rgba(255,255,255,0.4);font-size:11px;">–</span>'}</div></td>`;
      }
      gridRows += `<tr>${cells}</tr>`;
    }

    /* Leyenda */
    const legend = `
      <div style="display:flex;gap:16px;align-items:center;margin-bottom:16px;padding:8px 16px;border:1px solid #e2e8f0;border-radius:999px;background:#fff;width:fit-content;">
        <span style="display:flex;align-items:center;gap:6px;font-size:11px;font-weight:700;color:#334155;">
          <span style="width:12px;height:12px;border-radius:50%;background:#10b981;display:inline-block;"></span> Bajo
        </span>
        <span style="color:#cbd5e1;">•</span>
        <span style="display:flex;align-items:center;gap:6px;font-size:11px;font-weight:700;color:#334155;">
          <span style="width:12px;height:12px;border-radius:50%;background:#fbbf24;display:inline-block;"></span> Moderado / Alto
        </span>
        <span style="color:#cbd5e1;">•</span>
        <span style="display:flex;align-items:center;gap:6px;font-size:11px;font-weight:700;color:#334155;">
          <span style="width:12px;height:12px;border-radius:50%;background:#e11d48;display:inline-block;"></span> Crítico
        </span>
      </div>`;

    /* Etiquetas eje X */
    const xLabels = IMP_LABELS.slice(1).map(l =>
      `<td style="text-align:center;font-size:10px;font-weight:700;font-style:italic;color:#334155;">${l}</td>`
    ).join("");

    return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"/>
  <title>Mapa de Calor – ${empresa}</title>
  <style>
    *{-webkit-print-color-adjust:exact;print-color-adjust:exact;box-sizing:border-box;}
    body{font-family:'Segoe UI',Arial,sans-serif;margin:0;padding:20px;background:#fff;color:#0f172a;}
    @page{size:A4 landscape;margin:12mm;}
    table{border-collapse:separate;border-spacing:6px;width:100%;}
  </style>
</head>
<body>
  <div style="margin-bottom:20px;">
    <h1 style="font-size:18px;font-weight:900;color:#0f172a;margin:0 0 4px;">Mapa de Calor de Riesgos (5×5)</h1>
    <p style="font-size:11px;color:#64748b;margin:0 0 2px;">${empresa}${nit ? ` — NIT ${nit}` : ""}${tipo ? ` — ${tipo}` : ""}</p>
    <p style="font-size:10px;color:#94a3b8;margin:0;">Probabilidad (Eje Vertical) vs. Impacto / Gravedad (Eje Horizontal)</p>
  </div>

  ${legend}

  <div style="display:flex;gap:12px;align-items:stretch;">
    <!-- Etiqueta eje Y vertical -->
    <div style="display:flex;align-items:center;justify-content:center;background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:8px 6px;">
      <span style="font-size:9px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.3em;writing-mode:vertical-lr;transform:rotate(180deg);">PROBABILIDAD</span>
    </div>

    <div style="flex:1;">
      <table>
        <tbody>${gridRows}</tbody>
        <tfoot>
          <tr>
            <td style="width:90px;"></td>
            ${xLabels}
          </tr>
          <tr>
            <td></td>
            <td colspan="5" style="text-align:center;padding-top:8px;">
              <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:999px;padding:6px 0;font-size:9px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.3em;">
                IMPACTO / GRAVEDAD
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
</body>
</html>`;
  };

  const handlePrint = () => {
    const win = window.open("", "_blank", "width=900,height=700");
    if (!win) return;
    win.document.write(buildPrintHtml());
    win.document.close();
    // Esperar a que cargue y luego imprimir
    win.onload = () => {
      win.focus();
      win.print();
      // Cerrar la ventana después de imprimir
      win.onafterprint = () => win.close();
    };
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-200 w-full max-w-4xl overflow-hidden flex flex-col max-h-[94vh]">

        {/* Cabecera */}
        <div className="px-6 py-4 bg-white border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold text-xs shadow-sm">
              PDF
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Exportar Matriz de Riesgo</h2>
              <p className="text-xs text-gray-500">Vista previa — solo se imprime el Mapa de Calor 5×5</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-sm transition-all active:scale-95"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Descargar PDF / Imprimir
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              title="Cerrar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Vista previa del mapa */}
        <div className="bg-slate-100/60 p-4 sm:p-6 overflow-y-auto flex-1">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 w-full">
            <MapaCalorRiesgo tasks={subtareas} />
          </div>
        </div>

        {/* Iframe oculto — no se usa */}
        <iframe ref={iframeRef} title="print-frame" className="hidden" />
      </div>
    </div>
  );
};
