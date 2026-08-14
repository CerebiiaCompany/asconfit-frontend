import React, { useEffect, useState, useCallback } from "react";
import { auditoriaService } from "../../../services/auditoriaService";

/* ─── helpers ────────────────────────────────────────────────────────────── */
const computeNpr = (g: number, p: number, d: number) =>
    g >= 1 && p >= 1 && d >= 1 ? g * p * (11 - d) : 0;

const getRiskLabel = (npr: number) => {
    if (npr > 450) return { label: "Crítico", color: "bg-red-100 text-red-700" };
    if (npr > 225) return { label: "Alto", color: "bg-orange-100 text-orange-700" };
    if (npr > 100) return { label: "Moderado", color: "bg-amber-100 text-amber-700" };
    return { label: "Bajo", color: "bg-emerald-100 text-emerald-700" };
};

const getNprBar = (npr: number) => {
    if (npr > 450) return "bg-red-500";
    if (npr > 225) return "bg-orange-500";
    if (npr > 100) return "bg-amber-400";
    return "bg-emerald-500";
};

const clamp = (v: number) => Math.max(1, Math.min(10, v));

const PRIORIDADES = [
    { value: "alta", label: "Alta", cls: "bg-red-100 text-red-700" },
    { value: "media", label: "Media", cls: "bg-amber-100 text-amber-700" },
    { value: "baja", label: "Baja", cls: "bg-emerald-100 text-emerald-700" },
];

/* ─── tipos ──────────────────────────────────────────────────────────────── */
interface ItemState {
    id: number;
    nombre: string;
    prioridad: string;
    g: number; p: number; d: number;
    npr: number;
    nivel: string;
    dirty: boolean;
    saving: boolean;
}

const apiToState = (raw: any): ItemState => {
    const g = raw.gravedad_riesgo ?? 0;
    const p = raw.probabilidad_riesgo ?? 0;
    const d = raw.detencion_riesgo ?? 0;
    const npr = raw.npr ?? computeNpr(g, p, d);
    return {
        id: raw.id, nombre: raw.nombre, prioridad: raw.prioridad ?? "",
        g, p, d, npr,
        nivel: raw.nivel_riesgo ?? (npr ? getRiskLabel(npr).label : "Sin datos"),
        dirty: false, saving: false,
    };
};

/* ─── componente ─────────────────────────────────────────────────────────── */
interface Props { subtareaId: number; }

export const RiesgoItemsPanel: React.FC<Props> = ({ subtareaId }) => {
    const [items, setItems] = useState<ItemState[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [newNombre, setNewNombre] = useState("");
    const [adding, setAdding] = useState(false);

    /* carga inicial */
    useEffect(() => {
        setLoading(true);
        auditoriaService.getRiesgoItems(subtareaId)
            .then(data => setItems(data.map(apiToState)))
            .catch(err => setError("No se pudieron cargar los ítems: " + (err?.message ?? "")))
            .finally(() => setLoading(false));
    }, [subtareaId]);

    /* actualizar un campo de un ítem localmente */
    const setField = useCallback((id: number, field: "g" | "p" | "d" | "nombre" | "prioridad", val: number | string) => {
        setItems(prev => prev.map(item => {
            if (item.id !== id) return item;
            const next = { ...item, [field]: val, dirty: true };
            const npr = computeNpr(next.g, next.p, next.d);
            return { ...next, npr, nivel: npr ? getRiskLabel(npr).label : "Sin datos" };
        }));
    }, []);

    /* guardar cambios de un ítem */
    const saveItem = useCallback(async (id: number) => {
        const item = items.find(i => i.id === id);
        if (!item || !item.dirty) return;
        setItems(prev => prev.map(i => i.id === id ? { ...i, saving: true } : i));
        try {
            const res = await auditoriaService.updateRiesgoItem(id, {
                nombre: item.nombre.trim() || undefined,
                prioridad: item.prioridad || undefined,
                gravedad_riesgo: item.g > 0 ? item.g : undefined,
                probabilidad_riesgo: item.p > 0 ? item.p : undefined,
                detencion_riesgo: item.d > 0 ? item.d : undefined,
            });
            setItems(prev => prev.map(i => i.id === id ? { ...apiToState(res.item), dirty: false } : i));
        } catch (err: any) {
            console.error("Error guardando ítem de riesgo:", err);
        } finally {
            setItems(prev => prev.map(i => i.id === id ? { ...i, saving: false } : i));
        }
    }, [items]);

    /* eliminar ítem */
    const deleteItem = useCallback(async (id: number) => {
        try {
            await auditoriaService.deleteRiesgoItem(id);
            setItems(prev => prev.filter(i => i.id !== id));
        } catch (err: any) {
            console.error("Error eliminando ítem:", err);
        }
    }, []);

    /* agregar nuevo ítem — solo con nombre, G/P/D se editan después */
    const addItem = useCallback(async () => {
        const nombre = newNombre.trim();
        if (!nombre) return;
        setAdding(true);
        setError(null);
        try {
            const res = await auditoriaService.createRiesgoItem(subtareaId, { nombre });
            setItems(prev => [...prev, apiToState(res.item)]);
            setNewNombre("");
        } catch (err: any) {
            console.error("Error creando ítem de riesgo:", err);
            setError("No se pudo agregar el ítem: " + (err?.response?.data?.message ?? err?.message ?? "error desconocido"));
        } finally {
            setAdding(false);
        }
    }, [newNombre, subtareaId]);

    /* ── render ── */
    if (loading) {
        return (
            <div className="py-3 px-4 flex items-center gap-2 text-xs text-gray-400">
                <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-orange-400" />
                Cargando ítems de riesgo…
            </div>
        );
    }

    return (
        <div className="mt-3 border-t border-orange-100 pt-3 space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-orange-500">
                Ítems de riesgo ({items.length})
            </p>

            {error && (
                <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
            )}

            {/* lista de ítems existentes */}
            {items.length === 0 && (
                <p className="text-xs text-gray-400 italic">Sin ítems. Agrega uno abajo.</p>
            )}

            {items.map(item => {
                const riskLabel = getRiskLabel(item.npr);
                return (
                    <div key={item.id} className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 space-y-2">

                        {/* fila 1: nombre + prioridad + borrar */}
                        <div className="flex items-center gap-2 flex-wrap">
                            <input
                                type="text"
                                value={item.nombre}
                                onChange={e => setField(item.id, "nombre", e.target.value)}
                                className="flex-1 min-w-[140px] rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-300"
                                placeholder="Nombre del riesgo"
                            />
                            <select
                                value={item.prioridad}
                                onChange={e => setField(item.id, "prioridad", e.target.value)}
                                className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-orange-300"
                            >
                                <option value="">Prioridad</option>
                                {PRIORIDADES.map(pr => (
                                    <option key={pr.value} value={pr.value}>{pr.label}</option>
                                ))}
                            </select>
                            <button
                                type="button"
                                onClick={() => deleteItem(item.id)}
                                title="Eliminar"
                                className="p-1 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* fila 2: G P D + NPR + guardar */}
                        <div className="flex items-center gap-3 flex-wrap">
                            {([
                                { label: "G", key: "g" as const, val: item.g, title: "Gravedad" },
                                { label: "P", key: "p" as const, val: item.p, title: "Probabilidad" },
                                { label: "D", key: "d" as const, val: item.d, title: "Detección (1=peor)" },
                            ] as const).map(({ label, key, val, title }) => (
                                <div key={key} className="flex items-center gap-1" title={title}>
                                    <span className="text-[10px] font-bold text-gray-500 w-3">{label}</span>
                                    <button
                                        type="button"
                                        onClick={() => setField(item.id, key, val > 1 ? clamp(val - 1) : 0)}
                                        disabled={val <= 1}
                                        className="w-5 h-5 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 text-xs font-bold flex items-center justify-center disabled:opacity-30 transition-colors"
                                    >−</button>
                                    <input
                                        type="number" min={1} max={10}
                                        value={val > 0 ? val : ""}
                                        placeholder="–"
                                        onChange={e => setField(item.id, key, e.target.value === "" ? 0 : clamp(Number(e.target.value)))}
                                        className="w-9 rounded-lg border border-gray-200 bg-white text-center text-xs font-bold py-0.5 focus:outline-none focus:ring-1 focus:ring-orange-400"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setField(item.id, key, clamp(val + 1))}
                                        disabled={val >= 10}
                                        className="w-5 h-5 rounded-full bg-orange-100 hover:bg-orange-200 text-orange-600 text-xs font-bold flex items-center justify-center disabled:opacity-30 transition-colors"
                                    >+</button>
                                </div>
                            ))}

                            {/* NPR */}
                            {item.npr > 0 && (
                                <div className="flex items-center gap-1.5 ml-1">
                                    <div className="w-14 h-1.5 rounded-full bg-gray-200 overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${getNprBar(item.npr)}`}
                                            style={{ width: `${Math.min(100, (item.npr / 1000) * 100)}%` }}
                                        />
                                    </div>
                                    <span className="text-xs font-bold text-gray-700">{item.npr}</span>
                                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${riskLabel.color}`}>
                                        {riskLabel.label}
                                    </span>
                                </div>
                            )}

                            {/* guardar */}
                            <button
                                type="button"
                                onClick={() => saveItem(item.id)}
                                disabled={!item.dirty || item.saving}
                                className="ml-auto rounded-full bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 text-[10px] font-semibold disabled:opacity-40 transition-colors"
                            >
                                {item.saving ? "Guardando…" : "Guardar"}
                            </button>
                        </div>
                    </div>
                );
            })}

            {/* agregar nuevo — solo nombre */}
            <div className="flex items-center gap-2">
                <input
                    type="text"
                    value={newNombre}
                    onChange={e => setNewNombre(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addItem(); } }}
                    placeholder="Nombre del ítem de riesgo…"
                    className="flex-1 rounded-lg border border-dashed border-orange-300 bg-white px-3 py-1.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
                <button
                    type="button"
                    onClick={addItem}
                    disabled={adding || !newNombre.trim()}
                    className="flex items-center gap-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 active:scale-95 text-white px-3 py-1.5 text-xs font-semibold disabled:opacity-40 transition-all"
                >
                    {adding ? (
                        <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                    ) : (
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    )}
                    {adding ? "Agregando…" : "Agregar riesgo"}
                </button>
            </div>
        </div>
    );
};
