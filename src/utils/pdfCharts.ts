/**
 * Gráficas en SVG para los informes PDF (se imprimen con window.print()).
 * Se calculan en el navegador con los datos que ya tiene la página: no usan la IA
 * ni gastan tokens. Devuelven HTML listo para insertar en el documento del PDF.
 */

export interface ChartDatum {
    label: string;
    value: number;
    color: string;
}

const esc = (v: unknown): string =>
    String(v ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");

const pct = (v: number, total: number) => (total > 0 ? Math.round((v / total) * 100) : 0);

/** Leyenda con valor y porcentaje, para que la gráfica se lea también en blanco y negro. */
const leyenda = (data: ChartDatum[], total: number) => `
  <ul class="chart-legend">
    ${data.map((d) => `
      <li><span class="sw" style="background:${d.color}"></span>${esc(d.label)}
        <b>${d.value}</b><span class="pc">${pct(d.value, total)}%</span></li>`).join("")}
  </ul>`;

/** Dona con el total en el centro. */
export function donutChart(data: ChartDatum[], centroLabel: string): string {
    const total = data.reduce((s, d) => s + d.value, 0);
    const r = 42;
    const c = 2 * Math.PI * r;
    let offset = 0;
    const arcos = total === 0
        ? `<circle cx="60" cy="60" r="${r}" fill="none" stroke="#e2e8f0" stroke-width="16"/>`
        : data.filter((d) => d.value > 0).map((d) => {
            const len = (d.value / total) * c;
            // separación de 1.5 entre segmentos cuando hay más de uno
            const gap = data.filter((x) => x.value > 0).length > 1 ? 1.5 : 0;
            const arc = `<circle cx="60" cy="60" r="${r}" fill="none" stroke="${d.color}" stroke-width="16"
                stroke-dasharray="${Math.max(len - gap, 0)} ${c}" stroke-dashoffset="${-offset}"
                transform="rotate(-90 60 60)"/>`;
            offset += len;
            return arc;
        }).join("");

    return `
    <div class="chart-donut">
      <svg viewBox="0 0 120 120" width="120" height="120" role="img" aria-label="${esc(centroLabel)}">
        ${arcos}
        <text x="60" y="58" text-anchor="middle" font-size="22" font-weight="700" fill="#0f172a">${total}</text>
        <text x="60" y="74" text-anchor="middle" font-size="9" fill="#64748b">${esc(centroLabel)}</text>
      </svg>
      ${leyenda(data, total)}
    </div>`;
}

/** Barras horizontales; con `max` todas comparten escala. */
export function barList(data: ChartDatum[], max?: number): string {
    const tope = max ?? Math.max(1, ...data.map((d) => d.value));
    if (data.length === 0) return `<p class="muted">Sin datos</p>`;
    return `
    <div class="chart-bars">
      ${data.map((d) => `
        <div class="bar-row">
          <span class="bar-label" title="${esc(d.label)}">${esc(d.label)}</span>
          <span class="bar-track"><span class="bar-fill" style="width:${(d.value / tope) * 100}%;background:${d.color}"></span></span>
          <span class="bar-val">${d.value}</span>
        </div>`).join("")}
    </div>`;
}

export interface StackRow {
    label: string;
    parts: ChartDatum[];
}

/** Una barra apilada por fila (p. ej. hallazgos por categoría divididos por severidad). */
export function stackedBars(rows: StackRow[], leyendaData: ChartDatum[]): string {
    if (rows.length === 0) return `<p class="muted">Sin datos</p>`;
    const tope = Math.max(1, ...rows.map((r) => r.parts.reduce((s, p) => s + p.value, 0)));
    return `
    <div class="chart-bars">
      ${rows.map((r) => {
          const total = r.parts.reduce((s, p) => s + p.value, 0);
          return `
        <div class="bar-row">
          <span class="bar-label" title="${esc(r.label)}">${esc(r.label)}</span>
          <span class="bar-track">
            ${r.parts.filter((p) => p.value > 0).map((p) =>
                `<span class="bar-fill seg" style="width:${(p.value / tope) * 100}%;background:${p.color}"></span>`).join("")}
          </span>
          <span class="bar-val">${total}</span>
        </div>`;
      }).join("")}
      <ul class="chart-legend inline">
        ${leyendaData.map((d) => `<li><span class="sw" style="background:${d.color}"></span>${esc(d.label)}</li>`).join("")}
      </ul>
    </div>`;
}

/** Progreso por fila: aprobados / total. */
export function progressList(rows: { label: string; done: number; total: number }[]): string {
    if (rows.length === 0) return `<p class="muted">Sin datos</p>`;
    return `
    <div class="chart-bars">
      ${rows.map((r) => {
          const p = pct(r.done, r.total);
          const color = p >= 80 ? "#16a34a" : p >= 40 ? "#f59e0b" : "#ea580c";
          return `
        <div class="bar-row">
          <span class="bar-label" title="${esc(r.label)}">${esc(r.label)}</span>
          <span class="bar-track"><span class="bar-fill" style="width:${p}%;background:${color}"></span></span>
          <span class="bar-val">${r.done}/${r.total}</span>
        </div>`;
      }).join("")}
    </div>`;
}

/** Medidor semicircular de nivel de riesgo (BAJO → CRÍTICO). */
export function riskGauge(nivel: string): string {
    const niveles = [
        { key: "BAJO", color: "#16a34a" },
        { key: "MEDIO", color: "#f59e0b" },
        { key: "ALTO", color: "#ea580c" },
        { key: "CRITICO", color: "#dc2626" },
    ];
    const norm = nivel.normalize("NFD").replace(/[̀-ͯ]/g, "").toUpperCase();
    const idx = Math.max(0, niveles.findIndex((n) => n.key === norm));
    const r = 50;
    const arco = (i: number) => {
        const a0 = Math.PI + (i * Math.PI) / 4;
        const a1 = Math.PI + ((i + 1) * Math.PI) / 4 - 0.03;
        const p = (a: number) => `${60 + r * Math.cos(a)} ${62 + r * Math.sin(a)}`;
        return `<path d="M ${p(a0)} A ${r} ${r} 0 0 1 ${p(a1)}" fill="none" stroke="${niveles[i].color}"
            stroke-width="14" opacity="${i === idx ? 1 : 0.25}"/>`;
    };
    const ang = Math.PI + ((idx + 0.5) * Math.PI) / 4;
    return `
    <svg viewBox="0 0 120 72" width="150" height="90" role="img" aria-label="Nivel de riesgo ${esc(nivel)}">
      ${niveles.map((_, i) => arco(i)).join("")}
      <line x1="60" y1="62" x2="${60 + 34 * Math.cos(ang)}" y2="${62 + 34 * Math.sin(ang)}" stroke="#0f172a" stroke-width="3" stroke-linecap="round"/>
      <circle cx="60" cy="62" r="4" fill="#0f172a"/>
    </svg>`;
}

/** Estilos compartidos por todas las gráficas. */
export const CHART_STYLE = `
  .chart-donut{display:flex;align-items:center;gap:14px;}
  .chart-legend{list-style:none;margin:0;padding:0;font-size:11px;}
  .chart-legend li{display:flex;align-items:center;gap:6px;margin:3px 0;}
  .chart-legend b{margin-left:auto;padding-left:10px;}
  .chart-legend .pc{color:#64748b;width:34px;text-align:right;}
  .chart-legend.inline{display:flex;flex-wrap:wrap;gap:4px 14px;margin-top:6px;}
  .chart-legend.inline li{margin:0;}
  .sw{display:inline-block;width:9px;height:9px;border-radius:2px;flex-shrink:0;}
  .chart-bars{display:flex;flex-direction:column;gap:6px;}
  .bar-row{display:grid;grid-template-columns:38% 1fr 40px;align-items:center;gap:8px;font-size:11px;}
  .bar-label{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#334155;}
  .bar-track{display:flex;height:10px;background:#f1f5f9;border-radius:3px;overflow:hidden;}
  .bar-fill{display:block;height:100%;}
  .bar-fill.seg + .bar-fill.seg{border-left:1px solid #fff;}
  .bar-val{text-align:right;font-weight:600;color:#0f172a;}
`;
