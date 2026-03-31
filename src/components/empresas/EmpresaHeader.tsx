import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, PlusCircle, FileText, Building2 } from "lucide-react";
import { empresaService, Empresa as EmpresaModel } from "../../services/empresaService";

export const Empresa: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [empresas, setEmpresas] = useState<EmpresaModel[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    empresaService.getAll()
      .then(data => setEmpresas(data))
      .catch(err => console.error("Error cargando empresas para búsqueda:", err));
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

  const handleNewEmpresa = () => {
    navigate("/empresas/crear");
  };

  const handleVerEmpresas = () => {
    navigate("/empresas/ver");
  };

  const filteredEmpresas = empresas.filter((emp) => {
    const term = searchTerm.toLowerCase();
    return (
      (emp.razon_social || "").toLowerCase().includes(term) ||
      (emp.nit || "").includes(term)
    );
  });

  return (
    <>
      {/* Header Row */}
      <div className="mb-6">
        <h1 className="text-[32px] font-bold text-slate-800 tracking-tight">
          Empresas
        </h1>
        <p className="text-slate-500 text-sm mt-2 font-normal">
          Administra de forma segura la información y documentos
        </p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div className="relative w-full md:w-[450px]" ref={dropdownRef}>
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar empresa por nombre o NIT..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
          />

          {/* Autocomplete Dropdown */}
          {showDropdown && searchTerm.trim().length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-72 overflow-y-auto">
              {filteredEmpresas.length > 0 ? (
                filteredEmpresas.map((emp) => (
                  <div
                    key={emp.id}
                    onClick={() => {
                        setSearchTerm("");
                        setShowDropdown(false);
                        navigate(`/empresas?id=${emp.id}`);
                    }}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-orange-50 cursor-pointer border-b border-gray-100 last:border-0 transition-colors"
                  >
                    <div className="bg-orange-100 p-2 rounded-lg">
                       <Building2 className="w-5 h-5 text-orange-600" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-800 text-sm leading-tight">{emp.razon_social}</span>
                      <span className="text-xs text-gray-500 mt-0.5 font-medium">NIT: {emp.nit}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-4 py-6 text-sm text-gray-500 text-center flex flex-col items-center">
                  <Search className="w-6 h-6 text-gray-300 mb-2" />
                  <span>No existe ninguna empresa con ese nombre o NIT</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <button
            onClick={handleNewEmpresa}
            className="flex items-center gap-2 px-6 py-2 border border-orange-400 text-gray-700 rounded hover:bg-orange-50 transition-colors w-full md:w-auto justify-center text-sm font-medium"
          >
            <PlusCircle className="w-4 h-4 text-orange-400" />
            Crear empresa
          </button>
          <button
            onClick={handleVerEmpresas}
            className="flex items-center gap-2 px-6 py-2 border border-orange-400 text-gray-700 rounded hover:bg-orange-50 transition-colors w-full md:w-auto justify-center text-sm font-medium"
          >
            <FileText className="w-4 h-4 text-orange-400" />
            Ver empresas
          </button>
        </div>
      </div>
    </>
  );
};
