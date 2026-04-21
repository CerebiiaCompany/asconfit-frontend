import React from "react";

// ── Donut Chart ──────────────────────────────────────────────────────────────
interface DonutChartProps { critico: number; grave: number; leve: number; }

export function DonutChart({ critico, grave, leve }: DonutChartProps) {
    const total = critico + grave + leve;
    if (total === 0) return <div className="flex items-center justify-center h-32 text-gray-400 text-sm">Sin datos</div>;

    const r = 48, cx = 64, cy = 64;
    const circumference = 2 * Math.PI * r;
    const slices = [
        { value: critico, color: "#ef4444" },
        { value: grave, color: "#facc15" },
        { value: leve, color: "#22c55e" },
    ];
    let offset = 0;
    const paths = slices.map((s, i) => {
        const dash = (s.value / total) * circumference;
        const el = (
            <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={s.color} strokeWidth={20}
                strokeDasharray={`${dash} ${circumference - dash}`} strokeDashoffset={-offset}
                style={{ transform: "rotate(-90deg)", transformOrigin: `${cx}px ${cy}px` }} />
        );
        offset += dash;
        return el;
    });

    return (
        <div className="flex flex-col items-center">
            <svg width={128} height={128} viewBox="0 0 128 128">
                {paths}
                <text x={cx} y={cy + 5} textAnchor="middle" fontSize={16} fontWeight="bold" fill="#374151">{total}</text>
            </svg>
            <div className="flex gap-3 mt-2 text-xs text-gray-600">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />Crítico</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-yellow-400 inline-block" />Grave</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" />Leve</span>
            </div>
        </div>
    );
}

// ── Bar Chart ────────────────────────────────────────────────────────────────
interface BarChartProps { data: { label: string; value: number }[]; }

export function BarChart({ data }: BarChartProps) {
    const max = Math.max(...data.map(d => d.value), 1);
    return (
        <div className="space-y-2">
            {data.map((d, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                    <span className="w-36 truncate text-gray-600 text-right shrink-0">{d.label}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                        <div className="h-4 rounded-full bg-orange-400 transition-all" style={{ width: `${(d.value / max) * 100}%` }} />
                    </div>
                    <span className="w-4 text-gray-500 shrink-0">{d.value}</span>
                </div>
            ))}
        </div>
    );
}

// ── Charts Panel ─────────────────────────────────────────────────────────────
interface FindingsChartsProps {
    criticos: number;
    graves: number;
    leves: number;
    barData: { label: string; value: number }[];
}

export function FindingsCharts({ criticos, graves, leves, barData }: FindingsChartsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
                <p className="text-sm font-medium text-gray-700 mb-4">Hallazgos por Severidad</p>
                <DonutChart critico={criticos} grave={graves} leve={leves} />
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
                <p className="text-sm font-medium text-gray-700 mb-4">Hallazgos por Actividad</p>
                {barData.length === 0
                    ? <p className="text-sm text-gray-400 text-center py-8">Sin datos</p>
                    : <BarChart data={barData} />
                }
            </div>
        </div>
    );
}
