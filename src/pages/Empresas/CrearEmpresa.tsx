import React from 'react';
import { useNavigate } from "react-router-dom";
import { ChevronLeft, PlusCircle, FileText, ChevronDown } from 'lucide-react';

export const CrearEmpresa: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 max-w-[1200px] mx-auto font-sans min-h-screen bg-white">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <div className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-1">
            Empresas <span className="text-gray-400 mx-1 font-normal">&gt;</span> <span className="text-gray-600">Crear empresa</span>
          </div>
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-orange-500 text-sm font-semibold hover:text-orange-600 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Atrás
          </button>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-6 py-2 bg-orange-500 text-white rounded font-semibold hover:bg-orange-600 transition-colors shadow-sm text-sm">
            <PlusCircle className="w-4 h-4" />
            Crear empresa
          </button>
          <button 
            onClick={() => navigate("/empresas")}
            className="flex items-center gap-2 px-6 py-2 border border-orange-300 text-gray-700 rounded font-semibold hover:bg-gray-50 transition-colors shadow-sm text-sm"
          >
            <FileText className="w-4 h-4 text-orange-400" />
            Ver empresas
          </button>
        </div>
      </div>

      <hr className="border-gray-200 mb-10" />

      {/* Main Form Content */}
      <div className="max-w-[700px] mx-auto">
        <h2 className="text-[26px] font-bold text-gray-700 text-center mb-10">Datos Generales</h2>

        <div className="space-y-6">
          {/* Razón Social */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Razón Social</label>
            <input 
              type="text" 
              placeholder="Razón social o comercial" 
              className="w-full px-4 py-2 border border-gray-300 rounded text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>

          {/* Nit & Tipo de sociedad */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Nit</label>
              <input 
                type="text" 
                placeholder="0000000000-0" 
                className="w-full px-4 py-2 border border-gray-300 rounded text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Tipo de sociedad</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded text-sm text-gray-400 appearance-none focus:outline-none focus:ring-1 focus:ring-orange-500 bg-white cursor-pointer">
                <option value="">Selecciona el tipo de sociedad</option>
                <option value="sas" className="text-gray-800">S.A.S</option>
                <option value="ltda" className="text-gray-800">LTDA</option>
                <option value="sa" className="text-gray-800">S.A</option>
              </select>
              <ChevronDown className="absolute right-3 top-[34px] w-4 h-4 text-orange-400 pointer-events-none" />
            </div>
          </div>

          {/* Actividad economica & Estado */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Actividad economica</label>
              <input 
                type="text" 
                placeholder="Escribe la actividad económica" 
                className="w-full px-4 py-2 border border-gray-300 rounded text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Estado de la empresa</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded text-sm text-gray-400 appearance-none focus:outline-none focus:ring-1 focus:ring-orange-500 bg-white cursor-pointer">
                <option value="">Activa o Inactiva</option>
                <option value="activa" className="text-gray-800">Activa</option>
                <option value="inactiva" className="text-gray-800">Inactiva</option>
              </select>
              <ChevronDown className="absolute right-3 top-[34px] w-4 h-4 text-orange-400 pointer-events-none" />
            </div>
          </div>

          {/* Representante Legal */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Representante Legal</label>
            <input 
              type="text" 
              placeholder="Nombre completo" 
              className="w-full px-4 py-2 border border-gray-300 rounded text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>

          {/* Tipo & Numero de documento */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Tipo de documento</label>
              <input 
                type="text" 
                placeholder="CC, CE, OTRO" 
                className="w-full px-4 py-2 border border-gray-300 rounded text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Numero de documento</label>
              <input 
                type="text" 
                placeholder="0000000000" 
                className="w-full px-4 py-2 border border-gray-300 rounded text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Correo y Telefono */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Correo Personal</label>
              <input 
                type="text" 
                placeholder="Gerente General" 
                className="w-full px-4 py-2 border border-gray-300 rounded text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Telefono</label>
              <input 
                type="text" 
                placeholder="Activa o inactiva" 
                className="w-full px-4 py-2 border border-gray-300 rounded text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Pais, Dept, Ciudad */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">País</label>
              <input 
                type="text" 
                placeholder="Colombia" 
                className="w-full px-4 py-2 border border-gray-300 rounded text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Departamento/Estado</label>
              <input 
                type="text" 
                placeholder="Norte de Santander" 
                className="w-full px-4 py-2 border border-gray-300 rounded text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Ciudad</label>
              <input 
                type="text" 
                placeholder="Cúcuta" 
                className="w-full px-4 py-2 border border-gray-300 rounded text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Dirección */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Dirección</label>
            <input 
              type="text" 
              placeholder="calle 00" 
              className="w-full px-4 py-2 border border-gray-300 rounded text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>

          {/* Teléfono & Correo Empresarial */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Teléfono</label>
              <input 
                type="text" 
                placeholder="0000000000" 
                className="w-full px-4 py-2 border border-gray-300 rounded text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Correo Empresarial</label>
              <input 
                type="email" 
                placeholder="correo@gmail.com" 
                className="w-full px-4 py-2 border border-gray-300 rounded text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button className="w-full bg-[#f97316] hover:bg-[#ea580c] text-white font-bold py-3 rounded text-sm transition-colors shadow-sm">
              Guardar
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
};
