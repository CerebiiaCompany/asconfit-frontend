import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { useUser } from "../hooks/useUser";
// import { useEmpresas } from "../hooks/useEmpresas";
import {
  Search,
  PlusCircle,
  FileText,
  SlidersHorizontal,
  Lock,
  Users,
  Upload,
  ChevronLeft,
  ChevronRight,
  Plus
} from "lucide-react";

export const EmpresaDetalle: React.FC = () => {
  const navigate = useNavigate();
  // const { user } = useUser(() => navigate("/login"));
  const [searchTerm, setSearchTerm] = useState("");

  const handleNewEmpresa = () => {
    navigate("/empresas/crear");
  };

  return (
    <div className="p-6 max-w-[1200px] mx-auto font-sans min-h-screen">
      {/* Header Row */}
      <div className="mb-6">
        <h1 className="text-[32px] font-bold text-slate-800 tracking-tight">Encargos</h1>
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
          <button className="flex items-center gap-2 px-6 py-2 border border-orange-400 text-gray-700 rounded hover:bg-orange-50 transition-colors w-full md:w-auto justify-center text-sm font-medium">
            <FileText className="w-4 h-4 text-orange-400" />
            Ver empresas
          </button>
        </div>
      </div>

      {/* Main Info Section */}
      <div className="flex flex-col lg:flex-row justify-between gap-12 mb-8">
        {/* Form Details */}
        <div className="space-y-4 w-full max-w-[550px] pt-4 pl-4 md:pl-8">
          <div className="grid grid-cols-[160px_1fr] items-center">
            <label className="text-gray-400 text-sm">Nit:</label>
            <input type="text" value="1024525647-5" readOnly className="bg-gray-100 border border-gray-200 text-gray-800 font-medium rounded px-3 py-1.5 text-sm w-full outline-none" />
          </div>
          <div className="grid grid-cols-[160px_1fr] items-center">
            <label className="text-gray-400 text-sm">Razón social:</label>
            <input type="text" value="Ceramica Italia SAS" readOnly className="bg-gray-100 border border-gray-200 text-gray-800 font-medium rounded px-3 py-1.5 text-sm w-full outline-none" />
          </div>
          <div className="grid grid-cols-[160px_1fr] items-center">
            <label className="text-gray-400 text-sm">Auditor encargado:</label>
            <input type="text" value="Jhon Monsalve" readOnly className="bg-gray-100 border border-gray-200 text-gray-800 font-medium rounded px-3 py-1.5 text-sm w-full outline-none" />
          </div>
          <div className="grid grid-cols-[160px_1fr] items-center">
            <label className="text-gray-400 text-sm">Auditor encargado:</label>
            <input type="text" value="Erik Herrera" readOnly className="bg-gray-100 border border-gray-200 text-gray-800 font-medium rounded px-3 py-1.5 text-sm w-full outline-none" />
          </div>
          <div className="flex justify-end pt-2">
            <button className="px-6 py-2 border border-orange-400 text-gray-700 rounded text-sm font-medium hover:bg-orange-50 transition-colors">
              Actualizar Datos
            </button>
          </div>
        </div>

        {/* Calendar Widget */}
        <div className="flex justify-start lg:justify-end">
          <div className="border border-gray-300 rounded-lg shadow-sm p-4 w-[280px] bg-white relative">
            {/* Calendar Header */}
            <div className="flex justify-between items-center mb-6 text-gray-600 px-2">
              <ChevronLeft className="w-4 h-4 cursor-pointer text-gray-400" />
              <span className="font-bold text-sm text-gray-700">September 2021</span>
              <ChevronRight className="w-4 h-4 cursor-pointer text-gray-400" />
            </div>
            {/* Days row */}
            <div className="grid grid-cols-7 gap-1 text-center text-[9px] font-bold text-gray-400 mb-4 tracking-wider">
              <div>SUN</div><div>MON</div><div>TUE</div><div>WED</div><div>THU</div><div>FRI</div><div>SAT</div>
            </div>
            {/* Dates Grid */}
            <div className="grid grid-cols-7 gap-y-3 text-center text-xs text-gray-800 font-bold">
              <div className="col-start-4">4</div>
              <div>5</div>
              <div>6</div>
              <div>7</div>
              <div>8</div>
              <div>9</div>

              <div className="relative">
                <div className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center mx-auto cursor-pointer shadow-sm">10</div>
                {/* Tooltip pointing to 10 */}
                <div className="absolute top-1/2 right-full mr-2 transform -translate-y-1/2 w-[160px] bg-gray-300/80 text-gray-800 p-1.5 rounded shadow-sm flex gap-1.5 items-center z-10 backdrop-blur-sm">
                  <span className="font-bold text-xs bg-gray-400/30 px-1 py-0.5 rounded">10</span>
                  <span className="text-[9px] font-semibold leading-tight text-left">Fecha limite para información general</span>
                  <div className="absolute right-[-4px] top-1/2 transform -translate-y-1/2 w-2 h-2 bg-gray-300/80 rotate-45 backdrop-blur-sm"></div>
                </div>
              </div>

              <div>11</div><div>12</div><div>13</div><div>14</div><div>15</div><div>16</div><div>17</div><div>18</div>
              <div><div className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center mx-auto cursor-pointer shadow-sm">19</div></div>
              <div>20</div><div>21</div><div>22</div><div>23</div><div>24</div><div>25</div><div>26</div><div>27</div><div>28</div><div>29</div><div>30</div><div>31</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-2">
        <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-2.5 rounded text-sm font-bold shadow-sm transition-colors">
          Papeles de trabajo
        </button>
        <button className="bg-white border border-orange-200 text-gray-600 px-8 py-2.5 rounded text-sm font-bold shadow-sm hover:bg-gray-50 transition-colors">
          Auditorías
        </button>
        <button className="bg-white border border-orange-200 text-orange-400 px-4 py-2.5 rounded shadow-sm hover:bg-gray-50 transition-colors flex items-center justify-center">
          <Plus className="w-5 h-5" />
        </button>
      </div>

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
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 flex flex-col h-56">
              <div className="flex-1 bg-white border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.06)] rounded-sm mb-4 flex items-center justify-center relative hover:bg-gray-50 transition-colors cursor-pointer mx-2 mt-2">
                <span className="text-orange-400 font-bold tracking-widest text-xs">PDF</span>
              </div>
              <div className="flex items-start gap-2 px-1 mb-1">
                <input type="checkbox" className="mt-0.5 rounded border-gray-300 text-orange-500 focus:ring-orange-500 w-3 h-3 cursor-pointer" />
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
