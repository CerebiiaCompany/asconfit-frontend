import React from "react";
import { Subtarea } from "../../../types/auditoria";

interface ActividadDropdownProps {
    actividadRef: React.RefObject<HTMLDivElement | null>;
    actividadOpen: boolean;
    actividadSearch: string;
    filteredSubtareas: Subtarea[];
    allSubtareas: Subtarea[];
    currentActividadId: number | null;
    currentFechaLimite: string;
    onOpen: () => void;
    onSearch: (val: string) => void;
    onSelect: (s: Subtarea) => void;
}

export const ActividadDropdown: React.FC<ActividadDropdownProps> = ({
    actividadRef,
    actividadOpen,
    actividadSearch,
    filteredSubtareas,
    allSubtareas,
    currentActividadId,
    onOpen,
    onSearch,
    onSelect,
}) => (
    <div ref={actividadRef} className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-1">
            Actividad <span className="text-red-500">*</span>
        </label>
        <button
            type="button"
            onClick={onOpen}
            className="w-full flex items-center justify-between px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-400 text-left"
        >
            <span className={currentActividadId ? "text-gray-600" : "text-gray-400"}>
                {currentActividadId
                    ? allSubtareas.find((s) => s.id === currentActividadId)?.nombre ?? "Seleccionar"
                    : "Seleccionar actividad"}
            </span>
            <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
        </button>

        {actividadOpen && (
            <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                <div className="p-2 border-b border-gray-100">
                    <input
                        autoFocus
                        type="text"
                        value={actividadSearch}
                        onChange={(e) => onSearch(e.target.value)}
                        placeholder="Buscar actividad..."
                        className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                </div>
                <ul className="max-h-44 overflow-y-auto">
                    {filteredSubtareas.length === 0 ? (
                        <li className="px-3 py-2 text-xs text-gray-400">Sin resultados</li>
                    ) : (
                        filteredSubtareas.map((s) => (
                            <li
                                key={s.id}
                                onClick={() => onSelect(s)}
                                className={`px-3 py-2 text-xs cursor-pointer hover:bg-orange-50 hover:text-orange-700 transition-colors ${currentActividadId === s.id
                                        ? "bg-orange-50 text-orange-700 font-medium"
                                        : "text-gray-700"
                                    }`}
                            >
                                {s.nombre}
                            </li>
                        ))
                    )}
                </ul>
                {!actividadSearch && allSubtareas.length > 5 && (
                    <p className="px-3 py-1.5 text-[10px] text-gray-400 border-t border-gray-100">
                        Mostrando 5 de {allSubtareas.length}. Busca para ver más.
                    </p>
                )}
            </div>
        )}
    </div>
);
