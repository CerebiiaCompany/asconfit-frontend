import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Search, 
  PlusCircle, 
  FileText, 
  SlidersHorizontal,
  ChevronLeft,
  Eye
} from "lucide-react";

export const VerEmpresas: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleNewEmpresa = () => {
    navigate("/empresas/crear");
  };

  const empresasData = Array(12).fill({
    nit: "000000000-0",
    name: "Ceramica Italia SAS",
    representante: "Erik Herrera",
    correo: "correo@gmail.com",
    telefono: "321000000",
    fecha: "2/10/2026"
  });

  return (
    <div className="p-6 max-w-[1400px] mx-auto font-sans bg-white min-h-[calc(100vh-64px)] rounded-lg">
      {/* Breadcrumb */}
      <div className="mb-6">
        <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
          Empresas <span className="text-gray-400 font-normal">&gt;</span> Ver empresas
        </h2>
      </div>

      {/* Top Actions Line */}
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-gray-700 font-medium hover:text-gray-900 transition-colors text-[15px]"
        >
          <ChevronLeft className="w-5 h-5 text-orange-500 stroke-[3]" />
          Atrás
        </button>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={handleNewEmpresa}
            className="flex items-center gap-2 px-6 py-2 border border-orange-400 text-gray-700 rounded-md hover:bg-orange-50 transition-colors font-medium text-sm"
          >
            <PlusCircle className="w-4 h-4 text-orange-400" />
            Crear empresa
          </button>
          <button className="flex items-center gap-2 px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors font-bold text-sm shadow-sm">
            <FileText className="w-4 h-4" />
            Ver empresas
          </button>
        </div>
      </div>

      {/* Divider */}
      <hr className="border-gray-200 mb-8" />

      {/* Search and Filters */}
      <div className="flex gap-4 mb-8">
        <div className="relative w-full max-w-[400px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 bg-white"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded text-sm font-medium hover:bg-gray-50 transition-colors">
          <SlidersHorizontal className="w-4 h-4 text-orange-500" />
          Filtro
        </button>
      </div>

      {/* Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {empresasData.map((empresa, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.06)] p-5 flex flex-col h-full hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-shadow">
            <h3 className="text-[15px] font-bold text-gray-800 mb-4 tracking-tight">{empresa.name}</h3>
            
            <div className="space-y-4 mb-6 flex-grow">
              <div>
                <div className="text-[11px] font-semibold text-gray-400 mb-0.5">Nit:</div>
                <div className="text-[12px] font-semibold text-gray-600">{empresa.nit}</div>
              </div>
              
              <div>
                <div className="text-[11px] font-semibold text-gray-400 mb-0.5">Representante legal</div>
                <div className="text-[12px] font-semibold text-gray-600">{empresa.representante}</div>
              </div>
              
              <div>
                <div className="text-[11px] font-semibold text-gray-400 mb-0.5">Correo</div>
                <div className="text-[12px] font-semibold text-gray-600">{empresa.correo}</div>
              </div>
              
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-[11px] font-semibold text-gray-400 mb-0.5">Teléfono</div>
                  <div className="text-[12px] font-semibold text-gray-600">{empresa.telefono}</div>
                </div>
                
                <div className="text-right">
                  <div className="text-[9px] font-bold text-gray-400 italic mb-0.5">Fecha Registro</div>
                  <div className="text-[10px] font-bold text-gray-400">{empresa.fecha}</div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 mt-auto">
              <button 
                className="flex-shrink-0 w-8 h-8 flex items-center justify-center border border-orange-400 rounded-md text-orange-500 hover:bg-orange-50 transition-colors"
                title="Ver detalles"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button className="flex-grow h-8 bg-orange-500 text-white rounded-md text-[13px] font-bold hover:bg-orange-600 transition-colors shadow-sm">
                Actualizar datos
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
