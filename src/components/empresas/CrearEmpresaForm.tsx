import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { ChevronDown } from 'lucide-react';
import { empresaService, Empresa } from '../../services/empresaService';
import { useToast } from "../../contexts/ToastContext";

export const CrearEmpresaForm: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [formData, setFormData] = useState<Empresa>({
    razon_social: '',
    nit: '',
    tipo_sociedad: '',
    actividad_economica: '',
    estado: '',
    representante_legal: '',
    tipo_documento: '',
    numero_documento: '',
    correo_personal: '',
    telefono_personal: '',
    pais: '',
    departamento: '',
    ciudad: '',
    direccion: '',
    telefono_empresarial: '',
    correo_empresarial: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await empresaService.create(formData);
      addToast("Empresa creada con éxito", "success");
      navigate("/empresas");
    } catch (err: any) {
      console.error("Error validando o creando empresa", err);
      const errorMsg = err.response?.data?.message || err.message || "Ocurrió un error al guardar la empresa. Verifica los datos.";
      setError(errorMsg);
      addToast(errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[700px] mx-auto">
      <h2 className="text-[26px] font-bold text-gray-700 text-center mb-10">Datos Generales</h2>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded text-sm font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Razón Social */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1.5">Razón Social</label>
          <input 
            type="text" 
            name="razon_social"
            value={formData.razon_social}
            onChange={handleChange}
            required
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
              name="nit"
              value={formData.nit}
              onChange={handleChange}
              required
              placeholder="0000000000-0" 
              className="w-full px-4 py-2 border border-gray-300 rounded text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Tipo de sociedad</label>
            <select 
              name="tipo_sociedad"
              value={formData.tipo_sociedad}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded text-sm text-gray-400 appearance-none focus:outline-none focus:ring-1 focus:ring-orange-500 bg-white cursor-pointer"
            >
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
              name="actividad_economica"
              value={formData.actividad_economica}
              onChange={handleChange}
              required
              placeholder="Escribe la actividad económica" 
              className="w-full px-4 py-2 border border-gray-300 rounded text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Estado de la empresa</label>
            <select 
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded text-sm text-gray-400 appearance-none focus:outline-none focus:ring-1 focus:ring-orange-500 bg-white cursor-pointer"
            >
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
            name="representante_legal"
            value={formData.representante_legal}
            onChange={handleChange}
            required
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
              name="tipo_documento"
              value={formData.tipo_documento}
              onChange={handleChange}
              required
              placeholder="CC, CE, OTRO" 
              className="w-full px-4 py-2 border border-gray-300 rounded text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Numero de documento</label>
            <input 
              type="text" 
              name="numero_documento"
              value={formData.numero_documento}
              onChange={handleChange}
              required
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
              type="email" 
              name="correo_personal"
              value={formData.correo_personal}
              onChange={handleChange}
              required
              placeholder="correo@personal.com" 
              className="w-full px-4 py-2 border border-gray-300 rounded text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Telefono Personal</label>
            <input 
              type="text" 
              name="telefono_personal"
              value={formData.telefono_personal}
              onChange={handleChange}
              required
              placeholder="3000000000" 
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
              name="pais"
              value={formData.pais}
              onChange={handleChange}
              required
              placeholder="Colombia" 
              className="w-full px-4 py-2 border border-gray-300 rounded text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Departamento/Estado</label>
            <input 
              type="text" 
              name="departamento"
              value={formData.departamento}
              onChange={handleChange}
              required
              placeholder="Norte de Santander" 
              className="w-full px-4 py-2 border border-gray-300 rounded text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Ciudad</label>
            <input 
              type="text" 
              name="ciudad"
              value={formData.ciudad}
              onChange={handleChange}
              required
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
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            required
            placeholder="calle 00" 
            className="w-full px-4 py-2 border border-gray-300 rounded text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>

        {/* Teléfono & Correo Empresarial */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Teléfono Empresarial</label>
            <input 
              type="text" 
              name="telefono_empresarial"
              value={formData.telefono_empresarial || ''}
              onChange={handleChange}
              placeholder="0000000000" 
              className="w-full px-4 py-2 border border-gray-300 rounded text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Correo Empresarial</label>
            <input 
              type="email" 
              name="correo_empresarial"
              value={formData.correo_empresarial || ''}
              onChange={handleChange}
              placeholder="correo@empresa.com" 
              className="w-full px-4 py-2 border border-gray-300 rounded text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button 
            type="submit" 
            disabled={loading}
            className={`w-full font-bold py-3 rounded text-sm transition-colors shadow-sm text-white ${loading ? 'bg-orange-300 cursor-not-allowed' : 'bg-[#f97316] hover:bg-[#ea580c]'}`}
          >
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
        
      </form>
    </div>
  );
};
