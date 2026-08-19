import React, { useMemo } from "react";
import * as ExcelJS from "exceljs";
import { Auditoria, Subtarea, Categoria } from "../../../types/auditoria";

/* ─── helpers de fecha ─────────────────────────────────────────────────────── */
const parseDate = (s?: string): Date | null => {
    if (!s) return null;
    const d = s.includes("T") ? new Date(s) : new Date(s + "T00:00:00");
    return Number.isNaN(d.getTime()) ? null : d;
};
const startOfWeek = (d: Date): Date => {
    const r = new Date(d); r.setDate(d.getDate() - d.getDay()); r.setHours(0, 0, 0, 0); return r;
};
const addDays = (d: Date, n: number): Date => { const r = new Date(d); r.setDate(r.getDate() + n); return r; };
const fmtShort = (d: Date) => d.toLocaleDateString("es-CO", { day: "2-digit", month: "short" });

/* ─── semana del mes (1-4) según el día ─────────────────────────────────────── */
const weekOfMonth = (d: Date): number => {
    const day = d.getDate();
    if (day <= 7) return 1;
    if (day <= 14) return 2;
    if (day <= 21) return 3;
    return 4;
};

/* ─── constantes visuales ───────────────────────────────────────────────────── */
const ESTADO_COLORS: Record<string, { bar: string }> = {
    aprobado: { bar: "bg-emerald-500" }, revision: { bar: "bg-blue-400" },
    recibido: { bar: "bg-amber-400" }, pendiente: { bar: "bg-gray-300" },
};
const ESTADO_LABEL: Record<string, string> = {
    aprobado: "Aprobado", revision: "En revisión", recibido: "Recibido", pendiente: "Pendiente",
};
const PRIORIDAD_DOT: Record<string, string> = {
    alta: "bg-red-500", media: "bg-amber-400", baja: "bg-sky-400",
};

/* ─── tipo interno ──────────────────────────────────────────────────────────── */
interface TaskRow {
    id: number | string; nombre: string; categoria: string;
    desde: Date | null; hasta: Date | null;
    estado: string; prioridad: string; observaciones: string;
}

/* ─── exportación Excel con ExcelJS ─────────────────────────────────────────── */
const exportToExcel = async (auditoria: Auditoria, tasks: TaskRow[]) => {
    const empresa = auditoria.empresa?.razon_social ?? auditoria.razon_social ?? "Auditoría";
    const nit = auditoria.empresa?.nit ?? auditoria.nit ?? "";
    const auditor = auditoria.empresa?.representante_legal ?? auditoria.responsable ?? auditoria.tipo_auditoria ?? "";
    const tipo = auditoria.tipo_auditoria ?? "";

    /* Rango de meses */
    const allDates: Date[] = [];
    tasks.forEach(t => { if (t.desde) allDates.push(t.desde); if (t.hasta) allDates.push(t.hasta); });
    const aS = parseDate(auditoria.fecha_inicial); if (aS) allDates.push(aS);
    const aE = parseDate(auditoria.fecha_corte); if (aE) allDates.push(aE);
    if (!allDates.length) return;

    const minD = new Date(Math.min(...allDates.map(d => d.getTime())));
    const maxD = new Date(Math.max(...allDates.map(d => d.getTime())));

    interface MS { year: number; month: number; label: string; }
    const months: MS[] = [];
    const cur = new Date(minD.getFullYear(), minD.getMonth(), 1);
    while (cur <= new Date(maxD.getFullYear(), maxD.getMonth(), 1)) {
        months.push({
            year: cur.getFullYear(), month: cur.getMonth(),
            label: cur.toLocaleDateString("es-CO", { month: "short", year: "numeric" }).toUpperCase()
        });
        cur.setMonth(cur.getMonth() + 1);
    }

    const inSlot = (d: Date | null, y: number, m: number, w: number) =>
        d !== null && d.getFullYear() === y && d.getMonth() === m && weekOfMonth(d) === w;

    /* Paleta */
    const argb = (hex: string) => ({ argb: hex } as any);
    const DARK = argb("FF404040");
    const MID = argb("FF737373");
    const LGRAY = argb("FFD9D9D9");
    const HDR_FG = argb("FF3A3A3A");  // texto encabezados
    const MONTH_BG = argb("FF595959");
    const WEEK_BG = argb("FF888888");
    const WHITE = argb("FFFFFFFF");
    const GREEN = argb("FF00B050");  // P planeado
    const ORANGE = argb("FFFF6600"); // E ejecutado
    const TITLE_BG = argb("FFE0E0E0");
    const EVEN_BG = argb("FFF5F5F5");
    const ODD_BG = argb("FFFFFFFF");

    const medB = (c: ExcelJS.Color): Partial<ExcelJS.Border> => ({ style: "medium", color: c });
    const thnB = (c: ExcelJS.Color): Partial<ExcelJS.Border> => ({ style: "thin", color: c });
    const allMed = { top: medB(DARK), bottom: medB(DARK), left: medB(DARK), right: medB(DARK) };

    const fill = (fgColor: ExcelJS.Color): ExcelJS.Fill =>
        ({ type: "pattern", pattern: "solid", fgColor });

    /* Workbook */
    const wb = new ExcelJS.Workbook();
    wb.creator = "Asconfit";
    const FIXED = 4; // No | Procedimiento | Auditor | P/E-label
    const totalCols = FIXED + months.length * 4;

    const ws = wb.addWorksheet("Cronograma", {
        pageSetup: { orientation: "landscape", fitToPage: true, fitToWidth: 1 },
        properties: { tabColor: { argb: "FFFF6600" } },
    });

    ws.getColumn(1).width = 5;
    ws.getColumn(2).width = 44;
    ws.getColumn(3).width = 16;
    ws.getColumn(4).width = 3.5;
    for (let i = 0; i < months.length * 4; i++) ws.getColumn(FIXED + 1 + i).width = 3.8;

    let R = 1;

    /* Fila 1 — Formato */
    ws.mergeCells(R, 1, R, totalCols);
    const fc = ws.getCell(R, 1);
    fc.value = "Anexo No.1 / Formato CC - 01";
    fc.font = { bold: true, size: 10, name: "Calibri" };
    fc.border = { bottom: medB(DARK) };
    ws.getRow(R).height = 13; R++;

    /* Fila 2 — vacía */
    ws.getRow(R).height = 6; R++;

    /* Fila 3 — Revisor / Cliente */
    const half = Math.floor(totalCols / 2);
    ws.mergeCells(R, 1, R, half);
    const rc = ws.getCell(R, 1);
    rc.value = `REVISOR FISCAL: ${auditor || tipo}`;
    rc.font = { bold: true, size: 11, name: "Calibri" };
    rc.fill = fill(LGRAY);
    rc.alignment = { horizontal: "left", vertical: "middle", indent: 1 };
    rc.border = allMed;

    ws.mergeCells(R, half + 1, R, totalCols);
    const cc = ws.getCell(R, half + 1);
    cc.value = `CLIENTE: ${empresa} - NIT. ${nit}`;
    cc.font = { bold: true, size: 11, name: "Calibri" };
    cc.fill = fill(LGRAY);
    cc.alignment = { horizontal: "right", vertical: "middle", indent: 1 };
    cc.border = allMed;
    ws.getRow(R).height = 22; R++;

    /* Fila 4 — vacía */
    ws.getRow(R).height = 6; R++;

    /* Fila 5 — Título PLANEACIÓN */
    ws.mergeCells(R, 1, R, totalCols);
    const tc = ws.getCell(R, 1);
    const y1 = minD.getFullYear(), y2 = maxD.getFullYear();
    tc.value = y1 === y2 ? `PLANEACIÓN DE AUDITORÍA ${y1}` : `PLANEACIÓN DE AUDITORÍA ${y1} / ${y2}`;
    tc.font = { bold: true, size: 12, color: HDR_FG, name: "Calibri" };
    tc.fill = fill(TITLE_BG);
    tc.alignment = { horizontal: "center", vertical: "middle" };
    tc.border = allMed;
    ws.getRow(R).height = 20; R++;

    /* Fila 6 — vacía */
    ws.getRow(R).height = 4; R++;

    const MR = R;     // fila cabecera meses
    const WR = R + 1; // fila cabecera semanas

    /* Cabeceras fijas — merge 2 filas */
    ["No.", "PROCEDIMIENTOS DE AUDITORÍA", "AUDITOR", ""].forEach((lbl, ci) => {
        ws.mergeCells(MR, ci + 1, WR, ci + 1);
        const c = ws.getCell(MR, ci + 1);
        c.value = lbl;
        c.font = { bold: true, size: 9, color: WHITE, name: "Calibri" };
        c.fill = fill(MONTH_BG);
        c.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
        c.border = allMed;
    });

    /* Cabeceras de meses y semanas */
    months.forEach((m, mi) => {
        const c0 = FIXED + mi * 4 + 1;
        ws.mergeCells(MR, c0, MR, c0 + 3);
        const mc = ws.getCell(MR, c0);
        mc.value = m.label;
        mc.font = { bold: true, size: 9, color: WHITE, name: "Calibri" };
        mc.fill = fill(MONTH_BG);
        mc.alignment = { horizontal: "center", vertical: "middle" };
        mc.border = { top: medB(DARK), bottom: thnB(MID), left: medB(DARK), right: medB(DARK) };

        for (let w = 1; w <= 4; w++) {
            const wc = ws.getCell(WR, c0 + w - 1);
            wc.value = w;
            wc.font = { bold: true, size: 9, color: WHITE, name: "Calibri" };
            wc.fill = fill(WEEK_BG);
            wc.alignment = { horizontal: "center", vertical: "middle" };
            wc.border = {
                top: thnB(MID), bottom: medB(DARK),
                left: w === 1 ? medB(DARK) : thnB(MID),
                right: w === 4 ? medB(DARK) : thnB(MID),
            };
        }
    });

    ws.getRow(MR).height = 18;
    ws.getRow(WR).height = 16;
    R += 2;

    /* Filas de datos — cada tarea 2 filas (P y E) */
    tasks.forEach((t, i) => {
        const rP = R, rE = R + 1;
        const bg = fill(i % 2 === 0 ? EVEN_BG : ODD_BG);

        /* No. — merge P+E */
        ws.mergeCells(rP, 1, rE, 1);
        const noC = ws.getCell(rP, 1);
        noC.value = i + 1;
        noC.font = { bold: true, size: 9, name: "Calibri" };
        noC.fill = bg;
        noC.alignment = { horizontal: "center", vertical: "middle" };
        noC.border = { top: thnB(MID), bottom: medB(DARK), left: medB(DARK), right: thnB(MID) };

        /* Procedimiento — merge P+E */
        ws.mergeCells(rP, 2, rE, 2);
        const prC = ws.getCell(rP, 2);
        prC.value = t.nombre;
        prC.font = { size: 9, name: "Calibri" };
        prC.fill = bg;
        prC.alignment = { horizontal: "left", vertical: "middle", wrapText: true, indent: 1 };
        prC.border = { top: thnB(MID), bottom: medB(DARK), left: thnB(MID), right: thnB(MID) };

        /* Auditor fila P */
        const aP = ws.getCell(rP, 3);
        aP.value = auditor || tipo; aP.font = { size: 8, name: "Calibri" }; aP.fill = bg;
        aP.alignment = { horizontal: "center", vertical: "middle" };
        aP.border = { top: thnB(MID), bottom: thnB(MID), left: thnB(MID), right: thnB(MID) };

        /* Auditor fila E */
        const aE = ws.getCell(rE, 3);
        aE.value = auditor || tipo; aE.font = { size: 8, name: "Calibri" }; aE.fill = bg;
        aE.alignment = { horizontal: "center", vertical: "middle" };
        aE.border = { top: thnB(MID), bottom: medB(DARK), left: thnB(MID), right: thnB(MID) };

        /* Etiqueta P */
        const pL = ws.getCell(rP, 4);
        pL.value = "P"; pL.font = { bold: true, size: 9, color: argb("FF007700"), name: "Calibri" };
        pL.fill = bg; pL.alignment = { horizontal: "center", vertical: "middle" };
        pL.border = { top: thnB(MID), bottom: thnB(MID), left: thnB(MID), right: medB(DARK) };

        /* Etiqueta E */
        const eL = ws.getCell(rE, 4);
        eL.value = "E"; eL.font = { bold: true, size: 9, color: argb("FFA63D00"), name: "Calibri" };
        eL.fill = bg; eL.alignment = { horizontal: "center", vertical: "middle" };
        eL.border = { top: thnB(MID), bottom: medB(DARK), left: thnB(MID), right: medB(DARK) };

        /* Celdas de semanas */
        months.forEach((m, mi) => {
            for (let w = 1; w <= 4; w++) {
                const col = FIXED + mi * 4 + w;
                const lB = w === 1 ? medB(DARK) : thnB(MID);
                const rB = w === 4 ? medB(DARK) : thnB(MID);

                /* Fila P */
                const cpCell = ws.getCell(rP, col);
                const pHit = inSlot(t.desde, m.year, m.month, w);
                cpCell.fill = fill(pHit ? GREEN : (i % 2 === 0 ? EVEN_BG : ODD_BG));
                cpCell.border = { top: thnB(MID), bottom: thnB(MID), left: lB, right: rB };

                /* Fila E */
                const ceCell = ws.getCell(rE, col);
                const eHit = inSlot(t.hasta, m.year, m.month, w);
                const eAprov = eHit && t.estado === "aprobado";
                ceCell.fill = fill(eHit ? (eAprov ? GREEN : ORANGE) : (i % 2 === 0 ? EVEN_BG : ODD_BG));
                if (eHit && !eAprov) {
                    ceCell.value = "x";
                    ceCell.font = { bold: true, size: 8, color: WHITE };
                    ceCell.alignment = { horizontal: "center", vertical: "middle" };
                }
                ceCell.border = { top: thnB(MID), bottom: medB(DARK), left: lB, right: rB };
            }
        });

        ws.getRow(rP).height = 15;
        ws.getRow(rE).height = 13;
        R += 2;
    });

    /* Leyenda */
    R++;
    const lP = ws.getCell(R, 1); lP.value = "P"; lP.font = { bold: true, size: 9 };
    const lPT = ws.getCell(R, 2); lPT.value = "Planeado"; lPT.font = { size: 9 };
    ws.getRow(R).height = 13; R++;
    const lE = ws.getCell(R, 1); lE.value = "E"; lE.font = { bold: true, size: 9 };
    const lET = ws.getCell(R, 2); lET.value = "Ejecutado"; lET.font = { size: 9 };
    ws.getCell(R, 4).value = "X";
    ws.getCell(R, 5).value = "= Ejecutado";
    ws.getRow(R).height = 13;

    /* Descargar */
    const buf = await wb.xlsx.writeBuffer();
    const blob = new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Cronograma_${empresa.replace(/\s+/g, "_")}_${new Date().toISOString().slice(0, 10)}.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
};

/* ─── componente principal ──────────────────────────────────────────────────── */
interface Props { auditoria: Auditoria; }

export const CronogramaAuditoria: React.FC<Props> = ({ auditoria }) => {
    const tasks: TaskRow[] = useMemo(() => {
        const rows: TaskRow[] = [];
        auditoria.categorias?.forEach((cat: Categoria) => {
            cat.subtareas?.forEach((sub: Subtarea) => {
                const desde = parseDate(sub.fecha_solicitud);
                const hasta = parseDate(sub.tiempo_entrega);
                if (!desde && !hasta) return;
                rows.push({
                    id: sub.id, nombre: sub.nombre, categoria: cat.nombre,
                    desde, hasta, estado: sub.estado_informacion ?? "pendiente",
                    prioridad: sub.prioridad ?? "", observaciones: sub.observaciones ?? "",
                });
            });
        });
        rows.sort((a, b) => (a.desde?.getTime() ?? a.hasta?.getTime() ?? 0) - (b.desde?.getTime() ?? b.hasta?.getTime() ?? 0));
        return rows;
    }, [auditoria]);

    const { gridStart, cols, colWidth } = useMemo(() => {
        const allDates = tasks.flatMap(t => [t.desde, t.hasta]).filter(Boolean) as Date[];
        const aI = parseDate(auditoria.fecha_inicial); if (aI) allDates.push(aI);
        const aC = parseDate(auditoria.fecha_corte); if (aC) allDates.push(aC);
        if (!allDates.length) return { gridStart: new Date(), cols: 4, colWidth: 80 };
        const minD = new Date(Math.min(...allDates.map(d => d.getTime())));
        const maxD = new Date(Math.max(...allDates.map(d => d.getTime())));
        const start = startOfWeek(addDays(minD, -7));
        const weeks = Math.max(Math.ceil((addDays(maxD, 7).getTime() - start.getTime()) / (86400000 * 7)), 4);
        return { gridStart: start, cols: weeks, colWidth: 80 };
    }, [tasks, auditoria]);

    const xOf = (d: Date) => Math.max(0, ((d.getTime() - gridStart.getTime()) / 86400000 / 7) * colWidth);
    const totalWidth = cols * colWidth;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const weekCols = Array.from({ length: cols }, (_, i) => addDays(gridStart, i * 7));

    if (tasks.length === 0) {
        return <div className="px-4 py-3 text-xs text-gray-400 italic">Sin tareas con fechas programadas</div>;
    }

    return (
        <div className="px-4 pb-4">
            {/* ── Leyenda + botón ── */}
            <div className="flex flex-wrap items-center gap-3 mb-3">
                {Object.entries(ESTADO_COLORS).map(([k, v]) => (
                    <span key={k} className="flex items-center gap-1 text-[10px] text-gray-500">
                        <span className={`w-2.5 h-2.5 rounded-sm inline-block ${v.bar}`} />
                        {ESTADO_LABEL[k]}
                    </span>
                ))}
                <span className="text-[10px] text-gray-400 ml-1">{tasks.length} tarea{tasks.length !== 1 ? "s" : ""}</span>
                <button
                    type="button"
                    onClick={() => exportToExcel(auditoria, tasks)}
                    className="ml-auto flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-semibold rounded-lg transition-all shadow-sm"
                >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM4 4a1 1 0 0 1 1-1h7v7h7v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4z" />
                    </svg>
                    Descargar Excel
                </button>
            </div>

            {/* ── Gantt visual ── */}
            <div className="overflow-x-auto rounded-xl border border-gray-100">
                <div style={{ minWidth: totalWidth + 200 }}>
                    {/* Cabecera */}
                    <div className="flex bg-gray-50 border-b border-gray-100">
                        <div className="w-48 shrink-0 px-3 py-1.5 text-[10px] font-semibold text-gray-500 border-r border-gray-100">
                            Requerimiento
                        </div>
                        <div className="relative flex-1 flex" style={{ width: totalWidth }}>
                            {weekCols.map((w, i) => (
                                <div key={i} style={{ width: colWidth }}
                                    className="shrink-0 px-1 py-1.5 text-[9px] text-gray-400 text-center border-r border-gray-100 last:border-r-0">
                                    {fmtShort(w)}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Filas */}
                    {tasks.map((task, idx) => {
                        const colors = ESTADO_COLORS[task.estado] ?? ESTADO_COLORS.pendiente;
                        const dotColor = PRIORIDAD_DOT[task.prioridad] ?? "bg-gray-300";
                        const barFrom = task.desde ?? task.hasta!;
                        const barTo = task.hasta ?? task.desde!;
                        const x1 = xOf(barFrom);
                        const x2 = xOf(addDays(barTo, 1));
                        const barW = Math.max(x2 - x1, colWidth * 0.25);
                        const todayX = xOf(today);

                        return (
                            <div key={task.id}
                                className={`flex items-center border-b border-gray-50 ${idx % 2 === 0 ? "bg-white" : "bg-gray-50/40"} hover:bg-orange-50/30 transition-colors`}
                                style={{ height: 36 }}>
                                <div className="w-48 shrink-0 px-3 flex items-center gap-1.5 border-r border-gray-100 h-full">
                                    {task.prioridad && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`} />}
                                    <span className="text-[11px] text-gray-700 truncate leading-tight"
                                        title={`${task.categoria} → ${task.nombre}`}>
                                        <span className="text-gray-400 text-[9px]">
                                            {task.categoria.length > 12 ? task.categoria.slice(0, 12) + "…" : task.categoria} · </span>
                                        {task.nombre.length > 28 ? task.nombre.slice(0, 28) + "…" : task.nombre}
                                    </span>
                                </div>
                                <div className="relative flex-1 h-full" style={{ width: totalWidth }}>
                                    {weekCols.map((_, i) => (
                                        <div key={i} className="absolute top-0 bottom-0 border-r border-gray-100"
                                            style={{ left: i * colWidth }} />
                                    ))}
                                    {todayX >= 0 && todayX <= totalWidth && (
                                        <div className="absolute top-0 bottom-0 w-px bg-red-400/60 z-10"
                                            style={{ left: todayX }} />
                                    )}
                                    <div
                                        className={`absolute top-1/2 -translate-y-1/2 rounded-full ${colors.bar} opacity-90 flex items-center px-1.5`}
                                        style={{ left: x1, width: barW, height: 16 }}
                                        title={`${task.nombre}\n${task.desde ? fmtShort(task.desde) : "?"} → ${task.hasta ? fmtShort(task.hasta) : "?"}`}>
                                        {barW > 50 && (
                                            <span className="text-white text-[9px] truncate leading-none font-medium">
                                                {task.hasta ? fmtShort(task.hasta) : ""}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {/* Fila período auditoría */}
                    {(auditoria.fecha_inicial || auditoria.fecha_corte) && (
                        <div className="flex items-center bg-orange-50 border-t border-orange-100" style={{ height: 28 }}>
                            <div className="w-48 shrink-0 px-3 text-[10px] font-semibold text-orange-600 border-r border-orange-100 h-full flex items-center">
                                Período auditoría
                            </div>
                            <div className="relative flex-1 h-full" style={{ width: totalWidth }}>
                                {(() => {
                                    const s = parseDate(auditoria.fecha_inicial);
                                    const e = parseDate(auditoria.fecha_corte);
                                    if (!s && !e) return null;
                                    const lx1 = xOf(s ?? e!);
                                    const lx2 = xOf(addDays(e ?? s!, 1));
                                    return (
                                        <div className="absolute top-1/2 -translate-y-1/2 rounded-full bg-orange-400/70 flex items-center justify-center px-2"
                                            style={{ left: lx1, width: Math.max(lx2 - lx1, 60), height: 14 }}>
                                            <span className="text-white text-[9px] font-semibold truncate">
                                                {s ? fmtShort(s) : ""}{s && e ? " → " : ""}{e ? fmtShort(e) : ""}
                                            </span>
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
