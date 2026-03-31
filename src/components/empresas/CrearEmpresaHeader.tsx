import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, PlusCircle, FileText } from "lucide-react";

export const CrearEmpresaHeader: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
      <div>
        <div className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-1">
          Empresas <span className="text-gray-400 mx-1 font-normal">&gt;</span>{" "}
          <span className="text-gray-600">Crear empresa</span>
        </div>
        <button
          onClick={() => navigate(-1)}
          type="button"
          className="flex items-center text-orange-500 text-sm font-semibold hover:text-orange-600 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Atrás
        </button>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          className="flex items-center gap-2 px-6 py-2 bg-orange-500 text-white rounded font-semibold hover:bg-orange-600 transition-colors shadow-sm text-sm"
        >
          <PlusCircle className="w-4 h-4" />
          Crear empresa
        </button>
        <button
          type="button"
          onClick={() => navigate("/empresas/ver")}
          className="flex items-center gap-2 px-6 py-2 border border-orange-300 text-gray-700 rounded font-semibold hover:bg-gray-50 transition-colors shadow-sm text-sm"
        >
          <FileText className="w-4 h-4 text-orange-400" />
          Ver empresas
        </button>
      </div>
    </div>
  );
};
