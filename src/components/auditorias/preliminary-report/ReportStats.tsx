import React from "react";
import { Auditoria } from "../../../types/auditoria";
import { Finding } from "../../../services/findingService";

interface ReportStatsProps {
    auditoria: Auditoria;
    findings: Finding[];
}

// SVG Donut chart — segments: [{value, color}]
const DonutChart: React.FC<{
    segments: { value: number; color: string }[];
    total: number;
    centerLabel: string;
    centerSub: string;
    size?: number;
    stroke?: number;
}> = ({ segments, total, centerLabel, centerSub, size = 120, stroke = 22 }) => {
    const r = (size - stroke) / 2;
    const cx = size / 2;
    const cy = size / 2;
    const circumference = 2 * Math.PI * r;

    let offset = 0;
    const slices = segments
        .filter(s => s.value > 0)
        .map(s => {
            const pct = total > 0 ? s.value / total : 0;
            const dash = pct * circumference;
            const gap = circumference - dash;
            const slice = { ...s, dash, gap, offset };
            offset += dash;
            return slice;
        });

    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {/* Track */}
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f1f5f9" strokeWidth={stroke} />
            {slices.map((s, i) => (
                <circle
                    key={i}
                    cx={cx} cy={cy} r={r}
                    fill="none"
                    stroke={s.color}
                    strokeWidth={stroke}
                    strokeDasharray={`${s.dash} ${s.gap}`}
                    strokeDashoffset={-s.offset + circumference * 0.25}
                    style={{ transition: "stroke-dasharray 0.4s ease" }}
                />
            ))}
            <text x={cx} y={cy - 6} textAnchor="middle" fontSize="18" fontWeight="700" fill="#1e293b">{centerLabel}</text>
            <text x={cx} y={cy + 12} textAnchor="middle" fontSize="9" fill="#94a3b8">{centerSub}</text>
        </svg>
    );
};

export const ReportStats: React.FC<ReportStatsProps> = ({ auditoria, findings }) => {
    const subtareas = (auditoria.categorias ?? []).flatMap(c => c.subtareas ?? []);
    const total = subtareas.length;
    const aprobadas = subtareas.filter(s => s.estado_informacion === "aprobado").length;
    const rechazadas = subtareas.filter(s => (s.estado_informacion as string) === "rechazado").length;
    const enRevision = subtareas.filter(s =>
        s.estado_informacion === "recibido" || s.estado_informacion === "revision" ||
        (s.estado_informacion === "pendiente" && !!s.archivo_nombre)
    ).length;
    const pendientes = subtareas.filter(s =>
        (s.estado_informacion === "pendiente" || !s.estado_informacion) && !s.archivo_nombre
    ).length;
    const vencidas = subtareas.filter(s =>
        !s.archivo_nombre && s.tiempo_entrega && new Date(s.tiempo_entrega) < new Date()
    ).length;
    const pct = total > 0 ? Math.round((aprobadas / total) * 100) : 0;

    const criticos = findings.filter(f => f.severidad === "critico").length;
    const graves = findings.filter(f => f.severidad === "grave").length;
    const leves = findings.filter(f => f.severidad === "leve").length;

    const categorias = (auditoria.categorias ?? []).filter(c => (c.subtareas ?? []).length > 0);
    const catStats = categorias.map(cat => {
        const subs = cat.subtareas ?? [];
        const aprobCat = subs.filter(s => s.estado_informacion === "aprobado").length;
        const hallazgosCat = findings.filter(f => subs.some(s => s.id === f.actividad_id)).length;
        const pctCat = subs.length > 0 ? Math.round((aprobCat / subs.length) * 100) : 0;
        return { nombre: cat.nombre, total: subs.length, aprobadas: aprobCat, hallazgos: hallazgosCat, pct: pctCat };
    });

    const cumplimientoSegments = [
        { value: aprobadas, color: "#22c55e" },
        { value: enRevision, color: "#3b82f6" },
        { value: rechazadas, color: "#ef4444" },
        { value: pendientes, color: "#e2e8f0" },
    ];

    const hallazgosSegments = [
        { value: criticos, color: "#ef4444" },
        { value: graves, color: "#facc15" },
        { value: leves, color: "#22c55e" },
    ];

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-slate-600 to-slate-700 px-5 py-4">
                <h2 className="text-white font-semibold text-base">Estadísticas del Informe</h2>
                <p className="text-slate-300 text-xs mt-0.5">Resumen visual de cumplimiento y hallazgos</p>
            </div>

            <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Col 1 — Donut cumplimiento */}
                <div className="flex flex-col items-center gap-3">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide self-start">Cumplimiento</p>
                    <DonutChart
                        segments={cumplimientoSegments}
                        total={total}
                        centerLabel={`${pct}%`}
                        centerSub="aprobados"
                        size={130}
                        stroke={24}
                    />
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 w-full text-xs">
                        <LegendItem color="bg-green-500" label="Aprobados" value={aprobadas} />
                        <LegendItem color="bg-blue-500" label="En revisión" value={enRevision} />
                        <LegendItem color="bg-red-500" label="Rechazados" value={rechazadas} />
                        <LegendItem color="bg-slate-200" label="Pendientes" value={pendientes} />
                    </div>
                    {vencidas > 0 && (
                        <div className="w-full flex items-center gap-1.5 px-2.5 py-1.5 bg-red-50 border border-red-100 rounded-lg">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                            <p className="text-xs text-red-600">{vencidas} vencido{vencidas > 1 ? "s" : ""}</p>
                        </div>
                    )}
                </div>

                {/* Col 2 — Barras por categoría */}
                <div className="flex flex-col gap-3">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Por categoría</p>
                    {catStats.length === 0 && (
                        <p className="text-xs text-gray-400 italic">Sin categorías</p>
                    )}
                    <div className="space-y-3">
                        {catStats.map((cat, i) => (
                            <div key={i}>
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs text-gray-700 truncate max-w-[65%]">{cat.nombre}</span>
                                    <div className="flex items-center gap-2 shrink-0">
                                        {cat.hallazgos > 0 && (
                                            <span className="text-[10px] font-medium text-orange-500 bg-orange-50 px-1.5 py-0.5 rounded-full">
                                                {cat.hallazgos} hallazgo{cat.hallazgos > 1 ? "s" : ""}
                                            </span>
                                        )}
                                        <span className="text-xs font-semibold text-gray-700">{cat.pct}%</span>
                                    </div>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                    <div
                                        className={`h-2 rounded-full transition-all duration-500 ${cat.pct === 100 ? "bg-green-500" : cat.pct >= 50 ? "bg-orange-400" : "bg-red-400"}`}
                                        style={{ width: `${cat.pct}%` }}
                                    />
                                </div>
                                <p className="text-[10px] text-gray-400 mt-0.5">{cat.aprobadas} de {cat.total} aprobados</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Col 3 — Donut hallazgos */}
                <div className="flex flex-col items-center gap-3">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide self-start">Hallazgos</p>
                    {findings.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center gap-2 text-center py-6">
                            <svg className="w-10 h-10 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-xs text-gray-400">Sin hallazgos registrados</p>
                        </div>
                    ) : (
                        <>
                            <DonutChart
                                segments={hallazgosSegments}
                                total={findings.length}
                                centerLabel={`${findings.length}`}
                                centerSub="hallazgos"
                                size={130}
                                stroke={24}
                            />
                            <div className="flex flex-col gap-1.5 w-full text-xs">
                                <LegendItem color="bg-red-500" label="Críticos" value={criticos} />
                                <LegendItem color="bg-yellow-400" label="Graves" value={graves} />
                                <LegendItem color="bg-green-500" label="Leves" value={leves} />
                            </div>
                            {/* Mini barra de severidad */}
                            {findings.length > 0 && (
                                <div className="w-full">
                                    <div className="flex w-full h-2 rounded-full overflow-hidden gap-0.5">
                                        {criticos > 0 && <div className="bg-red-500 h-full" style={{ width: `${(criticos / findings.length) * 100}%` }} />}
                                        {graves > 0 && <div className="bg-yellow-400 h-full" style={{ width: `${(graves / findings.length) * 100}%` }} />}
                                        {leves > 0 && <div className="bg-green-500 h-full" style={{ width: `${(leves / findings.length) * 100}%` }} />}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

const LegendItem: React.FC<{ color: string; label: string; value: number }> = ({ color, label, value }) => (
    <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full shrink-0 ${color}`} />
            <span className="text-gray-500">{label}</span>
        </div>
        <span className="font-semibold text-gray-700">{value}</span>
    </div>
);
