import React from "react";
import { SearchInput } from "../../SearchInput";

interface AuditoriaFilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onNewAuditoria: () => void;
}

export const AuditoriaFilterBar: React.FC<AuditoriaFilterBarProps> = ({
  searchTerm,
  onSearchChange,
  onNewAuditoria,
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-3 sm:p-4 mb-4 sm:mb-6">
      {/* Mobile Layout */}
      <div className="flex flex-col sm:hidden gap-3">
        {/* Search Input */}
        <SearchInput
          value={searchTerm}
          onChange={onSearchChange}
          placeholder="Buscar..."
          className="w-full"
        />

        {/* Buttons Row */}
        <div className="flex gap-2">
          {/* Filter Button */}
          <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <svg
              className="w-5 h-5 text-gray-600"
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
            <span className="text-sm font-medium text-gray-700">Filtro</span>
          </button>

          {/* Create Button */}
          <button
            onClick={onNewAuditoria}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
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
            <span className="text-sm font-medium">Crear</span>
          </button>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden sm:flex items-center gap-4">
        {/* Search Input */}
        <SearchInput
          value={searchTerm}
          onChange={onSearchChange}
          placeholder="Buscar..."
          className="flex-1"
        />

        {/* Filter Button */}
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <svg
            className="w-5 h-5 text-gray-600"
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
          <span className="text-sm font-medium text-gray-700">Filtro</span>
        </button>

        {/* Create Button */}
        <button
          onClick={onNewAuditoria}
          className="flex items-center gap-2 px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
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
          <span className="text-sm font-medium">Crear auditoría</span>
        </button>
      </div>
    </div>
  );
};
