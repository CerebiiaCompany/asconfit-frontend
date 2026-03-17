import React, { useState, useRef, useEffect } from "react";
import { SearchInput } from "../../SearchInput";

interface AuditoriaFilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onNewAuditoria: () => void;
  fechaDesde: string;
  onFechaDesdeChange: (value: string) => void;
  fechaHasta: string;
  onFechaHastaChange: (value: string) => void;
  estadoFilter: string;
  onEstadoFilterChange: (value: string) => void;
}

const ESTADO_LABELS: Record<string, string> = {
  pendiente: "Pendiente",
  check: "Check",
};

export const AuditoriaFilterBar: React.FC<AuditoriaFilterBarProps> = ({
  searchTerm,
  onSearchChange,
  onNewAuditoria,
  fechaDesde,
  onFechaDesdeChange,
  fechaHasta,
  onFechaHastaChange,
  estadoFilter,
  onEstadoFilterChange,
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const hasActiveFilters = !!(fechaDesde || fechaHasta || estadoFilter);
  const activeCount = [fechaDesde, fechaHasta, estadoFilter].filter(Boolean).length;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowFilters(false);
      }
    };
    if (showFilters) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showFilters]);

  const handleClear = () => {
    onFechaDesdeChange("");
    onFechaHastaChange("");
    onEstadoFilterChange("");
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-3 sm:p-4 mb-4 sm:mb-6">
      <div className="flex items-center gap-3">
        {/* Search Input */}
        <SearchInput
          value={searchTerm}
          onChange={onSearchChange}
          placeholder="Buscar..."
          className="flex-1"
        />

        {/* Filter Button + Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowFilters((prev) => !prev)}
            className={`relative flex items-center gap-2 px-3 sm:px-4 py-2 border rounded-lg transition-all duration-150 ${
              showFilters || hasActiveFilters
                ? "border-orange-400 bg-orange-50 text-orange-600 shadow-sm"
                : "border-gray-300 hover:bg-gray-50 text-gray-700"
            }`}
          >
            <svg
              className="w-5 h-5 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            <span className="text-sm font-medium hidden sm:inline">Filtro</span>

            {/* Badge counter */}
            {hasActiveFilters && (
              <span className="flex items-center justify-center w-4 h-4 text-[10px] font-bold bg-orange-500 text-white rounded-full">
                {activeCount}
              </span>
            )}
          </button>

          {/* Dropdown Panel */}
          {showFilters && (
            <div
              className="absolute right-0 top-[calc(100%+8px)] z-50 w-72 sm:w-80 bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden"
              style={{ animation: "fadeSlideDown 0.15s ease-out" }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-orange-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                    />
                  </svg>
                  <span className="text-sm font-semibold text-gray-700">Filtros</span>
                </div>
                {hasActiveFilters && (
                  <button
                    onClick={handleClear}
                    className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
                  >
                    Limpiar todo
                  </button>
                )}
              </div>

              {/* Body */}
              <div className="p-4 flex flex-col gap-4">
                {/* Fecha de visita */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Fecha de visita
                  </p>
                  <div className="flex gap-2">
                    {/* Desde */}
                    <div className="flex-1 relative">
                      <label className="block text-xs text-gray-400 mb-1 font-medium">Desde</label>
                      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-colors overflow-hidden ${fechaDesde ? "border-orange-400 bg-orange-50" : "border-gray-200 bg-gray-50"}`}>
                        <svg className={`w-4 h-4 shrink-0 ${fechaDesde ? "text-orange-500" : "text-gray-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <input
                          type="date"
                          value={fechaDesde}
                          onChange={(e) => onFechaDesdeChange(e.target.value)}
                        className="flex-1 bg-transparent focus:outline-none text-gray-700 min-w-0 w-0"
                        />
                      </div>
                    </div>

                    {/* Hasta */}
                    <div className="flex-1 relative">
                      <label className="block text-xs text-gray-400 mb-1 font-medium">Hasta</label>
                      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-colors overflow-hidden ${fechaHasta ? "border-orange-400 bg-orange-50" : "border-gray-200 bg-gray-50"}`}>
                        <svg className={`w-4 h-4 shrink-0 ${fechaHasta ? "text-orange-500" : "text-gray-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <input
                          type="date"
                          value={fechaHasta}
                          onChange={(e) => onFechaHastaChange(e.target.value)}
                        className="flex-1 bg-transparent focus:outline-none text-gray-700 min-w-0 w-0"
                        />
                      </div>
                    </div>
                  </div>

                </div>

                {/* Proceso */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Proceso
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {(["", "pendiente", "check"] as const).map(
                      (val) => {
                        const label = val === "" ? "Todos" : ESTADO_LABELS[val];
                        const isSelected = estadoFilter === val;
                        return (
                          <button
                            key={val}
                            onClick={() => onEstadoFilterChange(val)}
                            className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm transition-colors text-left ${
                              isSelected
                                ? "bg-orange-50 text-orange-700 font-medium"
                                : "hover:bg-gray-50 text-gray-600"
                            }`}
                          >
                            {/* Radio circle */}
                            <span
                              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                isSelected
                                  ? "border-orange-500"
                                  : "border-gray-300"
                              }`}
                            >
                              {isSelected && (
                                <span className="w-2 h-2 rounded-full bg-orange-500" />
                              )}
                            </span>
                            {label}
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
                <button
                  onClick={() => setShowFilters(false)}
                  className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Aplicar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Create Button */}
        <button
          onClick={onNewAuditoria}
          className="flex items-center gap-2 px-3 sm:px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span className="text-sm font-medium hidden sm:inline">Crear auditoría</span>
          <span className="text-sm font-medium sm:hidden">Crear</span>
        </button>
      </div>

      <style>{`
        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
