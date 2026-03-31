import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, PlusCircle, FileText } from "lucide-react";

export const Empresa: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleNewEmpresa = () => {
    navigate("/empresas/crear");
  };

  const handleVerEmpresas = () => {
    navigate("/empresas/ver");
  };

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
        <div className="relative w-full md:w-[450px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
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
