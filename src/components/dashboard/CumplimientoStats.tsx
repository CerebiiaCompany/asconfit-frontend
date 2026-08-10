import React, { useEffect, useState } from "react";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    LineChart,
    Line,
    Legend,
} from "recharts";
import { auditoriaService } from "../../services/auditoriaService";
import { DashboardFilter } from "../../hooks/useDashboardFilters";

// ─── Tipos ───────────────────────────────────────────────────────────────────
interface GlobalStats {
    pct_cumplimiento: number;
    total_subtareas: number;
    aprobadas: number;
    en_revision: number;
    recibidas: number;
    pendientes: number;
}

interface EmpresaStat {
    empresa: string;
    total: number;
    aprobadas: number;
    pct: number;
}

interface TendenciaMes {
    mes: string;
    aprobadas: number;
    total: number;
    pct: number;
}

interface CumplimientoData {
    global: GlobalStats;
    por_empresa: EmpresaStat[];
    estados_auditorias: Record<string, number>;
    tendencia_mensual: TendenciaMes[];
}

// ─── Paleta ───────────────────────────────────────────────────────────────────
const ESTADO_CONFIG: Record<string, { label: string; color: string }> = {
    aprobadas: { label: "Aprobadas", color: "#10b981" },
    en_revision: { label: "En revisión", color: "#3b82f6" },
    recibidas: { label: "Recibidas", color: "#f59e0b" },
    pendientes: { label: "Pendientes", color: "#e5e7eb" },
};

const AUDIT_ESTADO_CONFIG: Record<string, { label: string; color: string }> = {
    pendiente: { label: "Pendiente", color: "#f59e0b" },
    en_progreso: { label: "En progreso", color: "#3b82f6" },
    completada: { label: "Completada", color: "#10b981" },
    aprobado: { label: "Aprobada", color: "#6366f1" },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const truncate = (s: string, n: number) =>
    s.length > n ? s.slice(0, n) + "…" : s;

// Gauge circular simple (SVG puro)
const GaugeCircle: React.FC<{ pct: number }> = ({ pct }) => {
    const r = 52;
    const circ = 2 * Math.PI * r;
    const dash = (pct / 100) * circ;
    const color =
        pct >= 75 ? "#10b981" : pct >= 40 ? "#f59e0b" : "#ef4444";

    return (
        <svg viewBox="0 0 130 130" className="w-36 h-36">
            <circle cx="65" cy="65" r={r} fill="none" stroke="#e5e7eb" strokeWidth="12" />
            <circle
                cx="65"
                cy="65"
                r={r}
                fill="none"
                stroke={color}
                strokeWidth="12"
                strokeDasharray={`${dash} ${circ - dash}`}
                strokeDashoffset={circ / 4}
                strokeLinecap="round"
                className="transition-all duration-700"
            />
            <text
                x="65"
                y="62"
                textAnchor="middle"
                fontSize="22"
                fontWeight="bold"
                fill={color}
            >
                {pct}%
            </text>
            <text x="65" y="80" textAnchor="middle" fontSize="10" fill="#6b7280">
                cumplimiento
            </text>
        </svg>
    );
};

// Tooltip personalizado para la barra
const BarTooltip: React.FC<any> = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-lg px-4 py-3 text-xs">
            <p className="font-semibold text-gray-800 mb-1">{label}</p>
            <p className="text-emerald-600">
                Aprobadas: <span className="font-bold">{payload[0]?.value}</span>
            </p>
            <p className="text-gray-500">
                Total: <span className="font-bold">{payload[1]?.value}</span>
            </p>
            <p className="text-indigo-600 mt-1">
                Cumplimiento:{" "}
                <span className="font-bold">
                    {payload[0]?.payload?.pct ?? 0}%
                </span>
            </p>
        </div>
    );
};

// ─── Componente principal ─────────────────────────────────────────────────────
export const CumplimientoStats: React.FC<{ filters?: DashboardFilter }> = ({ filters = {} }) => {
    const [data, setData] = useState<CumplimientoData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        auditoriaService
            .getCumplimientoStats(filters)
            .then(setData)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [filters.empresa_id, filters.delegado_id, filters.fecha_desde, filters.fecha_hasta]);

    if (loading) {
        return (
            <div className="bg-white shadow-xl rounded-2xl p-6 col-span-2">
                <div className="flex items-center justify-center py-10">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500" />
                </div>
            </div>
        );
    }

    if (!data || data.global.total_subtareas === 0) {
        return (
            <div className="bg-white shadow-xl rounded-2xl p-6 col-span-2">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Estadísticas de Cumplimiento
                </h3>
                <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                    <svg
                        className="w-14 h-14 text-emerald-300 mb-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                    </svg>
                    <p className="text-sm">No hay tareas registradas aún</p>
                </div>
            </div>
        );
    }

    const { global: g, por_empresa, estados_auditorias, tendencia_mensual } = data;

    // Donut data (estados de subtareas)
    const donutData = [
        { name: "Aprobadas", value: g.aprobadas, color: "#10b981" },
        { name: "En revisión", value: g.en_revision, color: "#3b82f6" },
        { name: "Recibidas", value: g.recibidas, color: "#f59e0b" },
        { name: "Pendientes", value: g.pendientes, color: "#e5e7eb" },
    ].filter((d) => d.value > 0);

    // Pie data (estados de auditorías)
    const auditPieData = Object.entries(estados_auditorias).map(
        ([key, val]) => ({
            name: AUDIT_ESTADO_CONFIG[key]?.label ?? key,
            value: val as number,
            color: AUDIT_ESTADO_CONFIG[key]?.color ?? "#9ca3af",
        })
    );

    return (
        <div className="bg-white shadow-xl rounded-2xl p-6 col-span-2">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">
                    Estadísticas de Cumplimiento
                </h3>
                <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                    {g.total_subtareas} tareas totales
                </span>
            </div>

            {/* ── Fila 1: Gauge + Donut + Mini KPIs ── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                {/* Gauge */}
                <div className="flex flex-col items-center justify-center">
                    <GaugeCircle pct={g.pct_cumplimiento} />
                    <p className="text-xs text-gray-500 mt-1 text-center">
                        {g.aprobadas} de {g.total_subtareas} aprobadas
                    </p>
                </div>

                {/* Donut estados de subtareas */}
                <div>
                    <p className="text-xs font-semibold text-gray-600 mb-2 text-center">
                        Estados de tareas
                    </p>
                    <ResponsiveContainer width="100%" height={140}>
                        <PieChart>
                            <Pie
                                data={donutData}
                                cx="50%"
                                cy="50%"
                                innerRadius={38}
                                outerRadius={58}
                                paddingAngle={2}
                                dataKey="value"
                            >
                                {donutData.map((entry, i) => (
                                    <Cell key={i} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(v: any, name: any) => [`${v} tareas`, name]}
                                contentStyle={{ fontSize: 11, borderRadius: 8 }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="flex flex-wrap justify-center gap-2 mt-1">
                        {donutData.map((d) => (
                            <span key={d.name} className="flex items-center gap-1 text-[10px] text-gray-600">
                                <span
                                    className="w-2 h-2 rounded-full inline-block"
                                    style={{ background: d.color }}
                                />
                                {d.name}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Pie estados de auditorías */}
                <div>
                    <p className="text-xs font-semibold text-gray-600 mb-2 text-center">
                        Estados de auditorías
                    </p>
                    {auditPieData.length > 0 ? (
                        <>
                            <ResponsiveContainer width="100%" height={140}>
                                <PieChart>
                                    <Pie
                                        data={auditPieData}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={58}
                                        paddingAngle={2}
                                        dataKey="value"
                                    >
                                        {auditPieData.map((entry, i) => (
                                            <Cell key={i} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(v: any, name: any) => [v, name]}
                                        contentStyle={{ fontSize: 11, borderRadius: 8 }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="flex flex-wrap justify-center gap-2 mt-1">
                                {auditPieData.map((d) => (
                                    <span key={d.name} className="flex items-center gap-1 text-[10px] text-gray-600">
                                        <span
                                            className="w-2 h-2 rounded-full inline-block"
                                            style={{ background: d.color }}
                                        />
                                        {d.name}
                                    </span>
                                ))}
                            </div>
                        </>
                    ) : (
                        <p className="text-xs text-gray-400 text-center pt-10">Sin datos</p>
                    )}
                </div>
            </div>

            {/* ── Fila 2: Barras por empresa ── */}
            {por_empresa.length > 0 && (
                <div className="mb-8">
                    <p className="text-xs font-semibold text-gray-600 mb-3">
                        Cumplimiento por empresa
                    </p>
                    <ResponsiveContainer width="100%" height={180}>
                        <BarChart
                            data={por_empresa.map((e) => ({
                                ...e,
                                empresa: truncate(e.empresa, 18),
                            }))}
                            margin={{ top: 4, right: 8, left: -20, bottom: 0 }}
                            barCategoryGap="30%"
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis
                                dataKey="empresa"
                                tick={{ fontSize: 10, fill: "#6b7280" }}
                                interval={0}
                                angle={-20}
                                textAnchor="end"
                                height={42}
                            />
                            <YAxis tick={{ fontSize: 10, fill: "#6b7280" }} />
                            <Tooltip content={<BarTooltip />} />
                            <Bar dataKey="aprobadas" name="Aprobadas" fill="#10b981" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="total" name="Total" fill="#e5e7eb" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}

            {/* ── Fila 3: Tendencia mensual ── */}
            <div>
                <p className="text-xs font-semibold text-gray-600 mb-3">
                    Tendencia mensual (últimos 6 meses)
                </p>
                <ResponsiveContainer width="100%" height={150}>
                    <LineChart
                        data={tendencia_mensual}
                        margin={{ top: 4, right: 8, left: -20, bottom: 0 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="mes" tick={{ fontSize: 10, fill: "#6b7280" }} />
                        <YAxis
                            yAxisId="left"
                            tick={{ fontSize: 10, fill: "#6b7280" }}
                        />
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            tick={{ fontSize: 10, fill: "#6b7280" }}
                            unit="%"
                            domain={[0, 100]}
                        />
                        <Tooltip
                            contentStyle={{ fontSize: 11, borderRadius: 8 }}
                            formatter={(v: any, name: string) =>
                                name === "% Cumplimiento" ? [`${v}%`, name] : [v, name]
                            }
                        />
                        <Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
                        <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="aprobadas"
                            name="Aprobadas"
                            stroke="#10b981"
                            strokeWidth={2}
                            dot={{ r: 3 }}
                            activeDot={{ r: 5 }}
                        />
                        <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="pct"
                            name="% Cumplimiento"
                            stroke="#6366f1"
                            strokeWidth={2}
                            strokeDasharray="4 2"
                            dot={{ r: 3 }}
                            activeDot={{ r: 5 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
