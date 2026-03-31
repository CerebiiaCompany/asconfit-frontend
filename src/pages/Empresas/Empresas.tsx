import React from "react";
// import { useNavigate } from "react-router-dom";
// import { useUser } from "../hooks/useUser";
// import { useEmpresas } from "../hooks/useEmpresas";
import {
  Search,
  SlidersHorizontal,
  Lock,
  Users,
  Upload,
} from "lucide-react";
import { Empresa } from "../../components/empresas/EmpresaHeader";
import { EmpresaInfo } from "../../components/empresas/EmpresaInfo";
import { EmpresaTabs } from "../../components/empresas/EmpresaTabs";

export const Empresas: React.FC = () => {
  // const navigate = useNavigate();
  // const { user } = useUser(() => navigate("/login"));

  return (
    <div className="p-6 max-w-[1200px] mx-auto font-sans min-h-screen">
      <Empresa />

      <EmpresaInfo />

      <EmpresaTabs />

      {/* Papeles de trabajo Box */}
      <div className="bg-[#f0f2f5] rounded-b-xl rounded-tr-xl border border-gray-200 p-6 relative min-h-[500px]">
        {/* Search & Actions Bar inside Grey Area */}
        <div className="flex justify-between items-center mb-8 gap-4">
          <div className="flex flex-1 gap-2 max-w-[600px]">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar..."
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 bg-white"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 bg-white text-gray-600 rounded text-sm font-bold hover:bg-gray-50 transition-colors">
              <SlidersHorizontal className="w-4 h-4 text-orange-500" />
              Filtro
            </button>
          </div>

          <div className="flex bg-white border border-gray-200 rounded overflow-hidden">
            <button className="bg-orange-500 text-white px-4 py-2 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </button>
            <button className="text-gray-500 hover:text-gray-700 bg-white px-4 py-2 flex items-center justify-center border-l border-gray-200">
              <Users className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* PDF Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 flex flex-col h-56"
            >
              <div className="flex-1 bg-white border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.06)] rounded-sm mb-4 flex items-center justify-center relative hover:bg-gray-50 transition-colors cursor-pointer mx-2 mt-2">
                <span className="text-orange-400 font-bold tracking-widest text-xs">
                  PDF
                </span>
              </div>
              <div className="flex items-start gap-2 px-1 mb-1">
                <input
                  type="checkbox"
                  className="mt-0.5 rounded border-gray-300 text-orange-500 focus:ring-orange-500 w-3 h-3 cursor-pointer"
                />
                <span className="text-[10px] font-bold text-gray-800 leading-tight">
                  RIT - Registro de identificación tributaria.Pdf
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Floating Subir archivo Button */}
        <button className="absolute bottom-6 right-6 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded shadow flex items-center gap-2 text-sm font-bold transition-colors">
          Subir archivo
          <Upload className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
};
