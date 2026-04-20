import React, { useEffect, useMemo, useState } from "react";
import { findingService, Finding } from "../services/findingService";
import { empresaService, Empresa } from "../services/empresaService";

const SEV_CONFIG = {
    critico: { label: "Crítico", dot: "bg-red-500", badge: "bg-red-100 text-red-700" },
    grave: { label: "Grave", dot: "bg-yellow-400", badge: "bg-yellow-100 text-yellow-700" },
    leve: { label: "Leve", dot: "bg-green-500", badge: "bg-green-100 text-green-700" },
};

function DonutChart({ critico, grave, leve }: { critico: number; grave: number; leve: number }) {
    const total = critico + grave + leve;
    if (total === 0) return <div className="flex items-center justify-center h-32 text-gray-400 text-sm">Sin datos</div>;

    const r = 48;
    const cx = 64;
    const cy = 64;
    const circumference = 2 * Math.PI * r;

    const slices = [
        { value: critico, color: "#ef4444" },
        { value: grave, color: "#facc15" },
        { value: leve, color: "#22c55e" },
    ];

    let offset = 0;
    const paths = slices.map((s, i) => {
        const pct = s.value / total;
        const dash = pct * circumference;
        const gap = circumference - dash;
        const el = (
            <circle
                key={i}
                cx={cx} cy={cy} r={r}
                fill="none"
                stroke={s.color}
                strokeWidth={20}
                strokeDasharray={`${dash} ${gap}`}
                strokeDashoffset={-offset}
                style={{ transform: "rotate(-90deg)", transformOrigin: `${cx}px ${cy}px` }}
            />
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

function BarChart({ data }: { data: { label: string; value: number }[] }) {
    const max = Math.max(...data.map(d => d.value), 1);
    return (
        <div className="space-y-2">
            {data.map((d, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                    <span className="w-36 truncate text-gray-600 text-right shrink-0">{d.label}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                        <div
                            className="h-4 rounded-full bg-orange-400 transition-all"
                            style={{ width: `${(d.value / max) * 100}%` }}
                        />
                    </div>
                    <span className="w-4 text-gray-500 shrink-0">{d.value}</span>
                </div>
            ))}
        </div>
    );
}

export const Findings: React.FC = () => {
    const [findings, setFindings] = useState<Finding[]>([]);
    const [empresas, setEmpresas] = useState<Empresa[]>([]);
    const [loading, setLoading] = useState(true);
    const [empresaFilter, setEmpresaFilter] = useState<string>("all");
    const [sevFilter, setSevFilter] = useState<string>("all");

    useEffect(() => {
        Promise.all([findingService.getAll(), empresaService.getAll()])
            .then(([f, e]) => { setFindings(f); setEmpresas(e); })
            .finally(() => setLoading(false));
    }, []);

    const filtered = useMemo(() => {
        return findings.filter(f => {
            if (empresaFilter !== "all") {
                const empId = f.auditoria?.empresa?.id?.toString();
                if (empId !== empresaFilter) return false;
            }
            if (sevFilter !== "all" && f.severidad !== sevFilter) return false;
            return true;
        });
    }, [findings, empresaFilter, sevFilter]);

    const abiertos = filtered.filter(f => !f.fecha_limite || new Date(f.fecha_limite) >= new Date()).length;
    const enProceso = filtered.filter(f => f.responsable && f.fecha_limite).length;
    const cerrados = filtered.length - abiertos;

    const criticos = filtered.filter(f => f.severidad === "critico").length;
    const graves = filtered.filter(f => f.severidad === "grave").length;
    const leves = filtered.filter(f => f.severidad === "leve").length;

    const actividadCount: Record<string, number> = {};
    filtered.forEach(f => {
        const name = f.actividad?.nombre ?? "Sin actividad";
        actividadCount[name] = (actividadCount[name] ?? 0) + 1;
    });
    const barData = Object.entries(actividadCount)
        .map(([label, value]) => ({ label, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 6);

    return (
        <div className="py-4 px-3 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">Hallazgos</h1>
                    <p className="text-sm text-gray-400 mt-0.5">Gestión y seguimiento de hallazgos de auditoría</p>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4 mb-5">
                <div className="flex items-center gap-2 mb-3">
                    <span className="w-3 h-3 rounded-full bg-orange-400 inline-block" />
                    <span className="text-sm font-medium text-gray-700">Filtrar por Empresa y Auditoría</span>
                </div>
                <div className="flex flex-wrap gap-3">
                    <div className="flex flex-col gap-1 min-w-[220px]">
                        <label className="text-xs text-gray-500">Empresa</label>
                        <select
                            value={empresaFilter}
                            onChange={e => setEmpresaFilter(e.target.value)}
                            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                        >
                            <option value="all">Todas las empresas</option>
                            {empresas.map(e => (
                                <option key={e.id} value={e.id?.toString()}>{e.razon_social}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col gap-1 min-w-[160px]">
                        <label className="text-xs text-gray-500">Severidad</label>
                        <select
                            value={sevFilter}
                            onChange={e => setSevFilter(e.target.value)}
                            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                        >
                            <option value="all">Todas</option>
                            <option value="critico">Crítico</option>
                            <option value="grave">Grave</option>
                            <option value="leve">Leve</option>
                        </select>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="py-16 flex flex-col items-center gap-3">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500" />
                    <p className="text-gray-500 text-sm">Cargando hallazgos...</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
                        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-800">{abiertos}</p>
                                <p className="text-xs text-gray-500">Abiertos</p>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                                <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-800">{enProceso}</p>
                                <p className="text-xs text-gray-500">En proceso</p>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-800">{cerrados}</p>
                                <p className="text-xs text-gray-500">Cerrados</p>
                            </div>
                        </div>
                    </div>

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

                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-100 bg-gray-50">
                                        <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Hallazgo</th>
                                        <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Auditoría</th>
                                        <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Actividad</th>
                                        <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Severidad</th>
                                        <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Responsable</th>
                                        <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Fecha límite</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="text-center py-12 text-gray-400 text-sm">
                                                No hay hallazgos para mostrar
                                            </td>
                                        </tr>
                                    ) : filtered.map(f => {
                                        const sev = SEV_CONFIG[f.severidad] ?? SEV_CONFIG.leve;
                                        const empresa = f.auditoria?.empresa?.razon_social ?? `Auditoría #${f.auditoria_id}`;
                                        return (
                                            <tr key={f.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                                <td className="px-4 py-3 font-medium text-gray-800 max-w-[200px] truncate">{f.titulo}</td>
                                                <td className="px-4 py-3 text-gray-600 max-w-[160px] truncate">{empresa}</td>
                                                <td className="px-4 py-3 text-gray-500 max-w-[140px] truncate">{f.actividad?.nombre ?? "—"}</td>
                                                <td className="px-4 py-3">
                                                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${sev.badge}`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${sev.dot}`} />
                                                        {sev.label}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-gray-600">{f.responsable ?? "—"}</td>
                                                <td className="px-4 py-3 text-gray-500">
                                                    {f.fecha_limite
                                                        ? new Date(f.fecha_limite).toLocaleDateString("es-CO", { day: "2-digit", month: "2-digit", year: "numeric" })
                                                        : "—"}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
