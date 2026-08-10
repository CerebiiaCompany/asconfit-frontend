import React, { useMemo } from "react";
import * as XLSX from "xlsx";
import { Auditoria, Subtarea, Categoria } from "../../../types/auditoria";

// ─── helpers de fecha ─────────────────────────────────────────────────────────
const parseDate = (s?: string): Date | null => {
    if (!s) return null;
    const d = s.includes("T") ? new Date(s) : new Date(s + "T00:00:00");
    return Number.isNaN(d.getTime()) ? null : d;
};

const startOfWeek = (d: Date): Date => {
    const r = new Date(d);
    r.setDate(d.getDate() - d.getDay());
    r.setHours(0, 0, 0, 0);
    return r;
};

const addDays = (d: Date, n: number): Date => {
    const r = new Date(d);
    r.setDate(r.getDate() + n);
    return r;
};

const fmtShortDate = (d: Date) =>
    d.toLocaleDateString("es-CO", { day: "2-digit", month: "short" });

const fmtFullDate = (d: Date | null) =>
    d
        ? d.toLocaleDateString("es-CO", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        })
        : "";

const ESTADO_COLORS: Record<string, { bar: string }> = {
    aprobado: { bar: "bg-emerald-500" },
    revision: { bar: "bg-blue-400" },
    recibido: { bar: "bg-amber-400" },
    pendiente: { bar: "bg-gray-300" },
};

const ESTADO_LABEL: Record<string, string> = {
    aprobado: "Aprobado",
    revision: "En revisión",
    recibido: "Recibido",
    pendiente: "Pendiente",
};

const PRIORIDAD_DOT: Record<string, string> = {
    alta: "bg-red-500",
    media: "bg-amber-400",
    baja: "bg-sky-400",
};

// ─── tipo interno ─────────────────────────────────────────────────────────────
interface TaskRow {
    id: number | string;
    nombre: string;
    categoria: string;
    desde: Date | null;
    hasta: Date | null;
    estado: string;
    prioridad: string;
    observaciones: string;
}

// ─── exportación Excel ────────────────────────────────────────────────────────
const exportToExcel = (auditoria: Auditoria, tasks: TaskRow[]) => {
    const empresa =
        auditoria.empresa?.razon_social ?? auditoria.razon_social ?? "Auditoría";
    const nit = auditoria.empresa?.nit ?? auditoria.nit ?? "";
    const tipo = auditoria.tipo_auditoria ?? "";
    const inicio = fmtFullDate(parseDate(auditoria.fecha_inicial));
    const corte = fmtFullDate(parseDate(auditoria.fecha_corte));

    const wb = XLSX.utils.book_new();

    // ── Hoja 1: Cronograma de procedimientos ────────────────────────────────────
    const wsData: any[][] = [];

    // Título / encabezado
    wsData.push(["PLANEACIÓN DE AUDITORÍA"]);
    wsData.push(["Formato CC-01"]);
    wsData.push([]);
    wsData.push([`REVISOR FISCAL / AUDITOR: ${tipo}`, "", "", `CLIENTE: ${empresa} - NIT. ${nit}`]);
    wsData.push([`PERÍODO: ${inicio} — ${corte}`]);
    wsData.push([]);

    // Cabecera de columnas
    wsData.push([
        "No.",
        "PROCEDIMIENTO / REQUERIMIENTO",
        "CATEGORÍA",
        "AUDITOR",
        "PRIORIDAD",
        "FECHA SOLICITUD",
        "FECHA ENTREGA",
        "ESTADO",
        "OBSERVACIONES",
        "",   // P = Planeado
        "",   // E = Ejecutado
    ]);

    // Filas de datos
    tasks.forEach((t, i) => {
        const ejecutado = t.estado === "aprobado" ? "X" : "";
        wsData.push([
            i + 1,
            t.nombre,
            t.categoria,
            tipo,
            t.prioridad ? t.prioridad.charAt(0).toUpperCase() + t.prioridad.slice(1) : "",
            fmtFullDate(t.desde),
            fmtFullDate(t.hasta),
            ESTADO_LABEL[t.estado] ?? t.estado,
            t.observaciones,
            "P",          // siempre planeado
            ejecutado,    // X si aprobado
        ]);
    });

    wsData.push([]);
    wsData.push(["P", "Planeado"]);
    wsData.push(["E", "Ejecutado"]);

    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Anchos de columna
    ws["!cols"] = [
        { wch: 5 },  // No.
        { wch: 45 },  // Procedimiento
        { wch: 20 },  // Categoría
        { wch: 20 },  // Auditor
        { wch: 10 },  // Prioridad
        { wch: 14 },  // Fecha solicitud
        { wch: 14 },  // Fecha entrega
        { wch: 14 },  // Estado
        { wch: 35 },  // Observaciones
        { wch: 5 },  // P
        { wch: 5 },  // E
    ];

    // Merge título
    ws["!merges"] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 10 } },
        { s: { r: 1, c: 0 }, e: { r: 1, c: 10 } },
        { s: { r: 3, c: 0 }, e: { r: 3, c: 2 } },
        { s: { r: 3, c: 3 }, e: { r: 3, c: 10 } },
        { s: { r: 4, c: 0 }, e: { r: 4, c: 10 } },
    ];

    XLSX.utils.book_append_sheet(wb, ws, "Cronograma");

    // ── Hoja 2: Resumen de estado ────────────────────────────────────────────────
    const summary: any[][] = [
        ["RESUMEN DE CUMPLIMIENTO"],
        [],
        ["Estado", "Cantidad", "% del Total"],
    ];

    const total = tasks.length;
    const countByEstado: Record<string, number> = {};
    tasks.forEach((t) => {
        countByEstado[t.estado] = (countByEstado[t.estado] ?? 0) + 1;
    });

    Object.entries(ESTADO_LABEL).forEach(([key, label]) => {
        const n = countByEstado[key] ?? 0;
        summary.push([label, n, total > 0 ? `${((n / total) * 100).toFixed(1)}%` : "0%"]);
    });

    summary.push([]);
    summary.push(["TOTAL", total, "100%"]);

    const wsSummary = XLSX.utils.aoa_to_sheet(summary);
    wsSummary["!cols"] = [{ wch: 16 }, { wch: 10 }, { wch: 12 }];
    wsSummary["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 2 } }];
    XLSX.utils.book_append_sheet(wb, wsSummary, "Resumen");

    // ── Descargar ────────────────────────────────────────────────────────────────
    const fileName = `Cronograma_${empresa.replace(/\s+/g, "_")}_${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(wb, fileName);
};

// ─── componente principal ─────────────────────────────────────────────────────
interface Props {
    auditoria: Auditoria;
}

export const CronogramaAuditoria: React.FC<Props> = ({ auditoria }) => {
    // 1. Recopilar tareas con fechas
    const tasks: TaskRow[] = useMemo(() => {
        const rows: TaskRow[] = [];
        auditoria.categorias?.forEach((cat: Categoria) => {
            cat.subtareas?.forEach((sub: Subtarea) => {
                const desde = parseDate(sub.fecha_solicitud);
                const hasta = parseDate(sub.tiempo_entrega);
                if (!desde && !hasta) return;
                rows.push({
                    id: sub.id,
                    nombre: sub.nombre,
                    categoria: cat.nombre,
                    desde,
                    hasta,
                    estado: sub.estado_informacion ?? "pendiente",
                    prioridad: sub.prioridad ?? "",
                    observaciones: sub.observaciones ?? "",
                });
            });
        });
        rows.sort((a, b) => {
            const ta = a.desde?.getTime() ?? a.hasta?.getTime() ?? 0;
            const tb = b.desde?.getTime() ?? b.hasta?.getTime() ?? 0;
            return ta - tb;
        });
        return rows;
    }, [auditoria]);

    // 2. Rango del grid
    const { gridStart, cols, colWidth } = useMemo(() => {
        const audInicio = parseDate(auditoria.fecha_inicial);
        const audFin = parseDate(auditoria.fecha_corte);
        const allDates = tasks.flatMap((t) => [t.desde, t.hasta]).filter(Boolean) as Date[];
        if (audInicio) allDates.push(audInicio);
        if (audFin) allDates.push(audFin);
        if (allDates.length === 0) return { gridStart: new Date(), cols: 4, colWidth: 56 };

        const minDate = new Date(Math.min(...allDates.map((d) => d.getTime())));
        const maxDate = new Date(Math.max(...allDates.map((d) => d.getTime())));
        const start = startOfWeek(addDays(minDate, -7));
        const end = addDays(maxDate, 7);
        const weeks = Math.max(Math.ceil((end.getTime() - start.getTime()) / (86400000 * 7)), 4);
        return { gridStart: start, cols: weeks, colWidth: 80 };
    }, [tasks, auditoria]);

    const xOf = (d: Date): number => {
        const days = (d.getTime() - gridStart.getTime()) / 86400000;
        return Math.max(0, (days / 7) * colWidth);
    };

    const totalWidth = cols * colWidth;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const weekCols = Array.from({ length: cols }, (_, i) => addDays(gridStart, i * 7));

    if (tasks.length === 0) {
        return (
            <div className="px-4 py-3 text-xs text-gray-400 italic">
                Sin tareas con fechas programadas
            </div>
        );
    }

    return (
        <div className="px-4 pb-4">

            {/* ── Barra superior: leyenda + botón Excel ── */}
            <div className="flex flex-wrap items-center gap-3 mb-3">
                {Object.entries(ESTADO_COLORS).map(([k, v]) => (
                    <span key={k} className="flex items-center gap-1 text-[10px] text-gray-500">
                        <span className={`w-2.5 h-2.5 rounded-sm inline-block ${v.bar}`} />
                        {ESTADO_LABEL[k]}
                    </span>
                ))}

                <span className="text-[10px] text-gray-400 ml-1">
                    {tasks.length} tarea{tasks.length !== 1 ? "s" : ""}
                </span>

                {/* Botón descargar Excel */}
                <button
                    type="button"
                    onClick={() => exportToExcel(auditoria, tasks)}
                    className="ml-auto flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-semibold rounded-lg transition-all shadow-sm"
                    title="Descargar cronograma en Excel"
                >
                    <svg
                        className="w-3.5 h-3.5"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                    >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM4 4a1 1 0 0 1 1-1h7v7h7v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4z" />
                        <path d="M7 13h10v1.5H7zm0 3h10v1.5H7zm0-6h4v1.5H7z" />
                    </svg>
                    Descargar Excel
                </button>
            </div>

            {/* ── Gantt ── */}
            <div className="overflow-x-auto rounded-xl border border-gray-100">
                <div style={{ minWidth: totalWidth + 200 }}>

                    {/* Cabecera semanas */}
                    <div className="flex bg-gray-50 border-b border-gray-100">
                        <div className="w-48 shrink-0 px-3 py-1.5 text-[10px] font-semibold text-gray-500 border-r border-gray-100">
                            Requerimiento
                        </div>
                        <div className="relative flex-1 flex" style={{ width: totalWidth }}>
                            {weekCols.map((w, i) => (
                                <div
                                    key={i}
                                    style={{ width: colWidth }}
                                    className="shrink-0 px-1 py-1.5 text-[9px] text-gray-400 text-center border-r border-gray-100 last:border-r-0"
                                >
                                    {fmtShortDate(w)}
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
                            <div
                                key={task.id}
                                className={`flex items-center border-b border-gray-50 ${idx % 2 === 0 ? "bg-white" : "bg-gray-50/40"} hover:bg-orange-50/30 transition-colors`}
                                style={{ height: 36 }}
                            >
                                {/* Etiqueta */}
                                <div className="w-48 shrink-0 px-3 flex items-center gap-1.5 border-r border-gray-100 h-full">
                                    {task.prioridad && (
                                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`} />
                                    )}
                                    <span
                                        className="text-[11px] text-gray-700 truncate leading-tight"
                                        title={`${task.categoria} → ${task.nombre}`}
                                    >
                                        <span className="text-gray-400 text-[9px]">
                                            {task.categoria.length > 12 ? task.categoria.slice(0, 12) + "…" : task.categoria} ·{" "}
                                        </span>
                                        {task.nombre.length > 28 ? task.nombre.slice(0, 28) + "…" : task.nombre}
                                    </span>
                                </div>

                                {/* Área del grid */}
                                <div className="relative flex-1 h-full" style={{ width: totalWidth }}>
                                    {weekCols.map((_, i) => (
                                        <div
                                            key={i}
                                            className="absolute top-0 bottom-0 border-r border-gray-100"
                                            style={{ left: i * colWidth }}
                                        />
                                    ))}

                                    {/* Línea de hoy */}
                                    {todayX >= 0 && todayX <= totalWidth && (
                                        <div
                                            className="absolute top-0 bottom-0 w-px bg-red-400/60 z-10"
                                            style={{ left: todayX }}
                                        />
                                    )}

                                    {/* Barra */}
                                    <div
                                        className={`absolute top-1/2 -translate-y-1/2 rounded-full ${colors.bar} opacity-90 flex items-center px-1.5`}
                                        style={{ left: x1, width: barW, height: 16 }}
                                        title={`${task.nombre}\n${task.desde ? fmtShortDate(task.desde) : "?"} → ${task.hasta ? fmtShortDate(task.hasta) : "?"}`}
                                    >
                                        {barW > 50 && (
                                            <span className="text-white text-[9px] truncate leading-none font-medium">
                                                {task.hasta ? fmtShortDate(task.hasta) : ""}
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
                                        <div
                                            className="absolute top-1/2 -translate-y-1/2 rounded-full bg-orange-400/70 flex items-center justify-center px-2"
                                            style={{ left: lx1, width: Math.max(lx2 - lx1, 60), height: 14 }}
                                        >
                                            <span className="text-white text-[9px] font-semibold truncate">
                                                {s ? fmtShortDate(s) : ""}
                                                {s && e ? " → " : ""}
                                                {e ? fmtShortDate(e) : ""}
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
