import React, { useState } from "react";
import { Filter, X, ChevronDown, ChevronUp } from "lucide-react";
import { DashboardFilter } from "../../hooks/useDashboardFilters";
import { Empresa } from "../../services/empresaService";
import { User } from "../../services/userService";

interface DashboardFiltersProps {
    filters: DashboardFilter;
    empresas: Empresa[];
    delegados: User[];
    loadingOptions: boolean;
    activeCount: number;
    onUpdate: <K extends keyof DashboardFilter>(key: K, value: DashboardFilter[K]) => void;
    onClear: () => void;
}

export const DashboardFilters: React.FC<DashboardFiltersProps> = ({
    filters,
    empresas,
    delegados,
    loadingOptions,
    activeCount,
    onUpdate,
    onClear,
}) => {
    const [expanded, setExpanded] = useState(false);

    const selectClass =
        "w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all";

    const inputClass =
        "w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all";

    return (
        <div className="bg-white shadow-sm border border-gray-100 rounded-2xl mb-4 overflow-hidden">
            {/* ── Cabecera (siempre visible) ── */}
            <button
                type="button"
                onClick={() => setExpanded((p) => !p)}
                className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-gray-50 transition-colors"
            >
                <div className="flex items-center gap-2.5">
                    <Filter size={16} className="text-orange-500" />
                    <span className="text-sm font-semibold text-gray-700">Filtros</span>
                    {activeCount > 0 && (
                        <span className="inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold bg-orange-500 text-white rounded-full">
                            {activeCount}
                        </span>
                    )}
                    {activeCount > 0 && (
                        <span className="text-xs text-gray-400">activos</span>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    {activeCount > 0 && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onClear();
                            }}
                            className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors"
                        >
                            <X size={13} />
                            Limpiar
                        </button>
                    )}
                    {expanded ? (
                        <ChevronUp size={16} className="text-gray-400" />
                    ) : (
                        <ChevronDown size={16} className="text-gray-400" />
                    )}
                </div>
            </button>

            {/* ── Panel expandible ── */}
            {expanded && (
                <div className="border-t border-gray-100 px-5 py-4">
                    {loadingOptions ? (
                        <div className="flex items-center gap-2 text-xs text-gray-400 py-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-400" />
                            Cargando opciones…
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Empresa */}
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                                    Empresa
                                </label>
                                <select
                                    value={filters.empresa_id ?? ""}
                                    onChange={(e) =>
                                        onUpdate(
                                            "empresa_id",
                                            e.target.value ? Number(e.target.value) : undefined,
                                        )
                                    }
                                    className={selectClass}
                                >
                                    <option value="">Todas las empresas</option>
                                    {empresas.map((emp) => (
                                        <option key={emp.id} value={emp.id}>
                                            {emp.razon_social}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Delegado */}
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                                    Delegado
                                </label>
                                <select
                                    value={filters.delegado_id ?? ""}
                                    onChange={(e) =>
                                        onUpdate(
                                            "delegado_id",
                                            e.target.value ? Number(e.target.value) : undefined,
                                        )
                                    }
                                    className={selectClass}
                                >
                                    <option value="">Todos los delegados</option>
                                    {delegados.map((del) => (
                                        <option key={del.id} value={del.id}>
                                            {del.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Fecha desde */}
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                                    Desde
                                </label>
                                <input
                                    type="date"
                                    value={filters.fecha_desde ?? ""}
                                    max={filters.fecha_hasta ?? undefined}
                                    onChange={(e) =>
                                        onUpdate("fecha_desde", e.target.value || undefined)
                                    }
                                    className={inputClass}
                                />
                            </div>

                            {/* Fecha hasta */}
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                                    Hasta
                                </label>
                                <input
                                    type="date"
                                    value={filters.fecha_hasta ?? ""}
                                    min={filters.fecha_desde ?? undefined}
                                    onChange={(e) =>
                                        onUpdate("fecha_hasta", e.target.value || undefined)
                                    }
                                    className={inputClass}
                                />
                            </div>
                        </div>
                    )}

                    {/* Tags de filtros activos */}
                    {activeCount > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-gray-100">
                            {filters.empresa_id && (
                                <FilterTag
                                    label={`Empresa: ${empresas.find((e) => e.id === filters.empresa_id)?.razon_social ?? filters.empresa_id}`}
                                    onRemove={() => onUpdate("empresa_id", undefined)}
                                />
                            )}
                            {filters.delegado_id && (
                                <FilterTag
                                    label={`Delegado: ${delegados.find((d) => d.id === filters.delegado_id)?.name ?? filters.delegado_id}`}
                                    onRemove={() => onUpdate("delegado_id", undefined)}
                                />
                            )}
                            {filters.fecha_desde && (
                                <FilterTag
                                    label={`Desde: ${filters.fecha_desde}`}
                                    onRemove={() => onUpdate("fecha_desde", undefined)}
                                />
                            )}
                            {filters.fecha_hasta && (
                                <FilterTag
                                    label={`Hasta: ${filters.fecha_hasta}`}
                                    onRemove={() => onUpdate("fecha_hasta", undefined)}
                                />
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const FilterTag: React.FC<{ label: string; onRemove: () => void }> = ({
    label,
    onRemove,
}) => (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-50 border border-orange-200 text-orange-700 text-xs rounded-full">
        {label}
        <button
            type="button"
            onClick={onRemove}
            className="hover:text-orange-900 transition-colors"
        >
            <X size={11} />
        </button>
    </span>
);
