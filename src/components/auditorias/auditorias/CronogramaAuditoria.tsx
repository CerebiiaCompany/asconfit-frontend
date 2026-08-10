import React, { useMemo } from "react";
import { Auditoria, Subtarea, Categoria } from "../../../types/auditoria";

// ─── helpers de fecha ─────────────────────────────────────────────────────────
const parseDate = (s?: string): Date | null => {
    if (!s) return null;
    const d = s.includes("T") ? new Date(s) : new Date(s + "T00:00:00");
    return isNaN(d.getTime()) ? null : d;
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

const ESTADO_COLORS: Record<string, { bar: string; dot: string }> = {
    aprobado: { bar: "bg-emerald-500", dot: "bg-emerald-500" },
    revision: { bar: "bg-blue-400", dot: "bg-blue-400" },
    recibido: { bar: "bg-amber-400", dot: "bg-amber-400" },
    pendiente: { bar: "bg-gray-300", dot: "bg-gray-400" },
};

const PRIORIDAD_DOT: Record<string, string> = {
    alta: "bg-red-500",
    media: "bg-amber-400",
    baja: "bg-sky-400",
};

// ─── tipos internos ───────────────────────────────────────────────────────────
interface TaskRow {
    id: number | string;
    nombre: string;
    categoria: string;
    desde: Date | null;
    hasta: Date | null;
    estado: string;
    prioridad: string;
}

// ─── componente ───────────────────────────────────────────────────────────────
interface Props {
    auditoria: Auditoria;
}

export const CronogramaAuditoria: React.FC<Props> = ({ auditoria }) => {
    // 1. Recopilar todas las tareas con fechas
    const tasks: TaskRow[] = useMemo(() => {
        const rows: TaskRow[] = [];
        auditoria.categorias?.forEach((cat: Categoria) => {
            cat.subtareas?.forEach((sub: Subtarea) => {
                const desde = parseDate(sub.fecha_solicitud);
                const hasta = parseDate(sub.tiempo_entrega);
                if (!desde && !hasta) return; // omitir sin fechas
                rows.push({
                    id: sub.id,
                    nombre: sub.nombre,
                    categoria: cat.nombre,
                    desde,
                    hasta,
                    estado: sub.estado_informacion ?? "pendiente",
                    prioridad: sub.prioridad ?? "",
                });
            });
        });
        // Ordenar por fecha de inicio
        rows.sort((a, b) => {
            const ta = a.desde?.getTime() ?? a.hasta?.getTime() ?? 0;
            const tb = b.desde?.getTime() ?? b.hasta?.getTime() ?? 0;
            return ta - tb;
        });
        return rows;
    }, [auditoria]);

    // 2. Calcular rango total
    const { gridStart, cols, colWidth } = useMemo(() => {
        const audInicio = parseDate(auditoria.fecha_inicial);
        const audFin = parseDate(auditoria.fecha_corte);

        // rango de subtareas
        const allDates = tasks.flatMap((t) => [t.desde, t.hasta]).filter(Boolean) as Date[];
        if (audInicio) allDates.push(audInicio);
        if (audFin) allDates.push(audFin);

        if (allDates.length === 0) return { gridStart: new Date(), cols: 4, colWidth: 56 };

        const minDate = new Date(Math.min(...allDates.map((d) => d.getTime())));
        const maxDate = new Date(Math.max(...allDates.map((d) => d.getTime())));

        // comenzar desde el lunes de la semana anterior al min
        const start = startOfWeek(addDays(minDate, -7));
        // terminar con al menos 1 semana de holgura
        const end = addDays(maxDate, 7);

        const totalDays = Math.ceil((end.getTime() - start.getTime()) / 86400000);
        const weeks = Math.ceil(totalDays / 7);
        const numCols = Math.max(weeks, 4);

        return { gridStart: start, cols: numCols, colWidth: 80 };
    }, [tasks, auditoria]);

    // 3. Función: posición de una fecha en el grid (px)
    const xOf = (d: Date): number => {
        const days = (d.getTime() - gridStart.getTime()) / 86400000;
        return Math.max(0, (days / 7) * colWidth);
    };

    const totalWidth = cols * colWidth;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (tasks.length === 0) {
        return (
            <div className="px-4 py-3 text-xs text-gray-400 italic">
                Sin tareas con fechas programadas
            </div>
        );
    }

    // Columnas de semanas
    const weekCols = Array.from({ length: cols }, (_, i) => addDays(gridStart, i * 7));

    return (
        <div className="px-4 pb-4">
            {/* Leyenda */}
            <div className="flex flex-wrap items-center gap-3 mb-3">
                {Object.entries(ESTADO_COLORS).map(([k, v]) => (
                    <span key={k} className="flex items-center gap-1 text-[10px] text-gray-500">
                        <span className={`w-2.5 h-2.5 rounded-sm inline-block ${v.bar}`} />
                        {{ aprobado: "Aprobado", revision: "En revisión", recibido: "Recibido", pendiente: "Pendiente" }[k]}
                    </span>
                ))}
                <span className="ml-auto text-[10px] text-gray-400">
                    {tasks.length} tarea{tasks.length !== 1 ? "s" : ""}
                </span>
            </div>

            {/* Scroll horizontal */}
            <div className="overflow-x-auto rounded-xl border border-gray-100">
                <div style={{ minWidth: totalWidth + 200 }}>

                    {/* Cabecera de semanas */}
                    <div className="flex bg-gray-50 border-b border-gray-100">
                        {/* Label column */}
                        <div className="w-48 shrink-0 px-3 py-1.5 text-[10px] font-semibold text-gray-500 border-r border-gray-100">
                            Requerimiento
                        </div>
                        {/* Week cells */}
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

                    {/* Filas de tareas */}
                    {tasks.map((task, idx) => {
                        const colors = ESTADO_COLORS[task.estado] ?? ESTADO_COLORS.pendiente;
                        const dotColor = PRIORIDAD_DOT[task.prioridad] ?? "bg-gray-300";

                        // Calcular barra
                        const barFrom = task.desde ?? task.hasta!;
                        const barTo = task.hasta ?? task.desde!;
                        const x1 = xOf(barFrom);
                        const x2 = xOf(addDays(barTo, 1)); // +1 día para incluir el día de entrega
                        const barW = Math.max(x2 - x1, colWidth * 0.25); // mínimo 25% de col

                        // Hoy
                        const todayX = xOf(today);

                        return (
                            <div
                                key={task.id}
                                className={`flex items-center border-b border-gray-50 ${idx % 2 === 0 ? "bg-white" : "bg-gray-50/40"} hover:bg-orange-50/30 transition-colors`}
                                style={{ height: 36 }}
                            >
                                {/* Label */}
                                <div className="w-48 shrink-0 px-3 flex items-center gap-1.5 border-r border-gray-100 h-full">
                                    {task.prioridad && (
                                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`} />
                                    )}
                                    <span
                                        className="text-[11px] text-gray-700 truncate leading-tight"
                                        title={`${task.categoria} → ${task.nombre}`}
                                    >
                                        <span className="text-gray-400 text-[9px]">{task.categoria.slice(0, 12)}{task.categoria.length > 12 ? "…" : ""} · </span>
                                        {task.nombre.length > 28 ? task.nombre.slice(0, 28) + "…" : task.nombre}
                                    </span>
                                </div>

                                {/* Grid area */}
                                <div className="relative flex-1 h-full" style={{ width: totalWidth }}>
                                    {/* Week grid lines */}
                                    {weekCols.map((_, i) => (
                                        <div
                                            key={i}
                                            className="absolute top-0 bottom-0 border-r border-gray-100"
                                            style={{ left: i * colWidth }}
                                        />
                                    ))}

                                    {/* Hoy */}
                                    {todayX >= 0 && todayX <= totalWidth && (
                                        <div
                                            className="absolute top-0 bottom-0 w-px bg-red-400/60 z-10"
                                            style={{ left: todayX }}
                                        />
                                    )}

                                    {/* Barra de tarea */}
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

                    {/* Fila de fechas de la auditoría */}
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
                                    const x1 = xOf(s ?? e!);
                                    const x2 = xOf(addDays(e ?? s!, 1));
                                    return (
                                        <div
                                            className="absolute top-1/2 -translate-y-1/2 rounded-full bg-orange-400/70 flex items-center justify-center px-2"
                                            style={{ left: x1, width: Math.max(x2 - x1, 60), height: 14 }}
                                        >
                                            <span className="text-white text-[9px] font-semibold truncate">
                                                {s ? fmtShortDate(s) : ""}{s && e ? " → " : ""}{e ? fmtShortDate(e) : ""}
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
