import React, { useState, useEffect, useRef } from "react";
import { SearchInput } from "../../SearchInput";
import { Search, Building2 } from "lucide-react";
import { empresaService, Empresa as EmpresaModel } from "../../../services/empresaService";

interface AuditoriaHeaderProps {
  searchEmpresa: string;
  searchConcepto: string;
  onSearchEmpresaChange: (value: string) => void;
  onSearchConceptoChange: (value: string) => void;
  onSelectEmpresa: (empresa: EmpresaModel) => void;
  onBack: () => void;
}

export const AuditoriaHeader: React.FC<AuditoriaHeaderProps> = ({
  searchEmpresa,
  searchConcepto,
  onSearchEmpresaChange,
  onSearchConceptoChange,
  onSelectEmpresa,
  onBack,
}) => {
  const [empresas, setEmpresas] = useState<EmpresaModel[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    empresaService.getAll()
      .then(setEmpresas)
      .catch(err => console.error("Error cargando empresas:", err));
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredEmpresas = empresas.filter((emp) => {
    const term = searchEmpresa.toLowerCase();
    return (
      (emp.razon_social || "").toLowerCase().includes(term) ||
      (emp.nit || "").includes(term)
    );
  });
  return (
    <div className="bg-white shadow-xl rounded-2xl mb-8 p-4 sm:p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <button
            onClick={onBack}
            className="text-gray-600 hover:text-gray-900 transition-colors flex-shrink-0"
          >
            <svg
              className="h-5 w-5 sm:h-6 sm:w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">
            Nueva Auditoría
          </h1>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 relative z-50" ref={dropdownRef}>
            <span className="text-sm text-gray-600 flex-shrink-0">Empresa</span>
            <div className="relative w-full sm:w-48 lg:w-64">
              <SearchInput
                value={searchEmpresa}
                onChange={(val) => {
                  onSearchEmpresaChange(val);
                  setShowDropdown(true);
                }}
                placeholder="Buscar por nombre o NIT..."
                className="w-full"
              />

              {/* Dropdown de Empresas */}
              {showDropdown && searchEmpresa.trim().length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-72 overflow-y-auto left-0">
                  {filteredEmpresas.length > 0 ? (
                    filteredEmpresas.map((emp) => (
                      <div
                        key={emp.id}
                        onClick={() => {
                          onSearchEmpresaChange("");
                          setShowDropdown(false);
                          onSelectEmpresa(emp);
                        }}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-orange-50 cursor-pointer border-b border-gray-100 last:border-0 transition-colors text-left"
                      >
                        <div className="bg-orange-100 p-2 rounded-lg">
                          <Building2 className="w-5 h-5 text-orange-600" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-800 text-sm leading-tight break-words">{emp.razon_social}</span>
                          <span className="text-xs text-gray-500 mt-0.5 font-medium">NIT: {emp.nit}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-4 text-sm text-gray-500 text-center flex flex-col items-center">
                      <Search className="w-5 h-5 text-gray-300 mb-2" />
                      <span>Ninguna empresa coincide.</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="text-sm text-gray-600 flex-shrink-0">
              Fecha de visita
            </span>
            <SearchInput
              value={searchConcepto}
              onChange={onSearchConceptoChange}
              placeholder="Concepto de visita..."
              className="w-full sm:w-48 lg:w-64"
            />
          </div>
          <button className="hidden sm:block p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0">
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
