import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { ChevronDown } from 'lucide-react';
import { empresaService, Empresa } from '../../services/empresaService';
import { useToast } from "../../contexts/ToastContext";

interface FormProps {
  isEdit?: boolean;
  initialData?: Empresa | null;
}

type FormErrors = Partial<Record<keyof Empresa, string>>;

const onlyLetters = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s.,'&()-]+$/;
const onlyNumbers = /^\d+$/;
const onlyLettersNumbers = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s.,'&()-]+$/;
const nitRegex = /^\d{6,15}(-\d)?$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(formData: Empresa): FormErrors {
  const e: FormErrors = {};

  if (!formData.razon_social.trim()) e.razon_social = 'Requerido';
  else if (!onlyLettersNumbers.test(formData.razon_social)) e.razon_social = 'Solo letras y números';

  if (!formData.nit.trim()) e.nit = 'Requerido';
  else if (!nitRegex.test(formData.nit)) e.nit = 'Formato: 0000000000 o 0000000000-0';

  if (!formData.tipo_sociedad) e.tipo_sociedad = 'Requerido';

  if (!formData.actividad_economica.trim()) e.actividad_economica = 'Requerido';
  else if (!onlyLetters.test(formData.actividad_economica)) e.actividad_economica = 'Solo letras';

  if (!formData.estado) e.estado = 'Requerido';

  if (!formData.representante_legal.trim()) e.representante_legal = 'Requerido';
  else if (!onlyLetters.test(formData.representante_legal)) e.representante_legal = 'Solo letras';

  if (!formData.tipo_documento) e.tipo_documento = 'Requerido';

  if (!formData.numero_documento.trim()) e.numero_documento = 'Requerido';
  else if (!onlyNumbers.test(formData.numero_documento)) e.numero_documento = 'Solo números';

  if (!formData.correo_personal.trim()) e.correo_personal = 'Requerido';
  else if (!emailRegex.test(formData.correo_personal)) e.correo_personal = 'Correo inválido';

  if (!formData.telefono_personal.trim()) e.telefono_personal = 'Requerido';
  else if (!onlyNumbers.test(formData.telefono_personal)) e.telefono_personal = 'Solo números';

  if (!formData.pais.trim()) e.pais = 'Requerido';
  else if (!onlyLettersNumbers.test(formData.pais)) e.pais = 'Solo letras y números';

  if (!formData.departamento.trim()) e.departamento = 'Requerido';
  else if (!onlyLettersNumbers.test(formData.departamento)) e.departamento = 'Solo letras y números';

  if (!formData.ciudad.trim()) e.ciudad = 'Requerido';
  else if (!onlyLettersNumbers.test(formData.ciudad)) e.ciudad = 'Solo letras y números';

  if (!formData.direccion.trim()) e.direccion = 'Requerido';

  if (formData.telefono_empresarial && !onlyNumbers.test(formData.telefono_empresarial))
    e.telefono_empresarial = 'Solo números';

  if (formData.correo_empresarial && !emailRegex.test(formData.correo_empresarial))
    e.correo_empresarial = 'Correo inválido';

  return e;
}

const inputClass = (err?: string) =>
  `w-full px-4 py-2 border rounded text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 ${err ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:ring-orange-500'}`;

const selectClass = (err?: string) =>
  `w-full px-4 py-2 border rounded text-sm appearance-none focus:outline-none focus:ring-1 bg-white cursor-pointer ${err ? 'border-red-400 focus:ring-red-400 text-gray-800' : 'border-gray-300 focus:ring-orange-500 text-gray-400'}`;

const ErrMsg: React.FC<{ msg?: string }> = ({ msg }) =>
  msg ? <p className="text-red-500 text-xs mt-1">{msg}</p> : null;

export const CreateCompanyForm: React.FC<FormProps> = ({ isEdit, initialData }) => {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const empty: Empresa = {
    razon_social: '', nit: '', tipo_sociedad: '', actividad_economica: '',
    estado: '', representante_legal: '', tipo_documento: '', numero_documento: '',
    correo_personal: '', telefono_personal: '', pais: '', departamento: '',
    ciudad: '', direccion: '', telefono_empresarial: '', correo_empresarial: '',
  };

  const [formData, setFormData] = useState<Empresa>(empty);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof Empresa, boolean>>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit && initialData) {
      setFormData({
        ...initialData,
        telefono_empresarial: initialData.telefono_empresarial || '',
        correo_empresarial: initialData.correo_empresarial || '',
      });
    }
  }, [isEdit, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Filtrar caracteres según el campo
    let filtered = value;
    const lettersOnly = /[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s.,'&()-]/g;
    const numbersOnly = /[^\d]/g;
    const lettersAndNumbers = /[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s.,'&()-]/g;

    if (['nit', 'numero_documento', 'telefono_personal', 'telefono_empresarial'].includes(name)) {
      // NIT permite guión al final
      if (name === 'nit') filtered = value.replace(/[^\d-]/g, '');
      else filtered = value.replace(numbersOnly, '');
    } else if (['actividad_economica', 'representante_legal'].includes(name)) {
      filtered = value.replace(lettersOnly, '');
    } else if (['razon_social', 'pais', 'departamento', 'ciudad'].includes(name)) {
      filtered = value.replace(lettersAndNumbers, '');
    }
    // correos, direccion, selects: sin filtro de caracteres

    const updated = { ...formData, [name]: filtered };
    setFormData(updated);
    if (touched[name as keyof Empresa]) {
      setErrors(validate(updated));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(validate(formData));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const allTouched = Object.keys(formData).reduce((acc, k) => ({ ...acc, [k]: true }), {});
    setTouched(allTouched);
    const errs = validate(formData);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    try {
      if (isEdit && initialData?.id) {
        await empresaService.update(initialData.id, formData);
        addToast("Empresa actualizada con éxito", "success");
      } else {
        await empresaService.create(formData);
        addToast("Empresa creada con éxito", "success");
      }
      navigate("/empresas/ver");
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "Error al guardar la empresa.";
      addToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  const f = formData;
  const er = errors;

  return (
    <div className="max-w-[700px] mx-auto">
      <h2 className="text-[26px] font-bold text-gray-700 text-center mb-10">Datos Generales</h2>

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {/* Razón Social */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1.5">Razón Social</label>
          <input type="text" name="razon_social" value={f.razon_social} onChange={handleChange} onBlur={handleBlur}
            placeholder="Razón social o comercial" className={inputClass(er.razon_social)} />
          <ErrMsg msg={er.razon_social} />
        </div>

        {/* Nit & Tipo de sociedad */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Nit</label>
            <input type="text" name="nit" value={f.nit} onChange={handleChange} onBlur={handleBlur}
              placeholder="0000000000-0" className={inputClass(er.nit)} />
            <ErrMsg msg={er.nit} />
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Tipo de sociedad</label>
            <select name="tipo_sociedad" value={f.tipo_sociedad} onChange={handleChange} onBlur={handleBlur}
              className={selectClass(er.tipo_sociedad)}>
              <option value="">Selecciona el tipo</option>
              <option value="sas" className="text-gray-800">S.A.S</option>
              <option value="ltda" className="text-gray-800">LTDA</option>
              <option value="sa" className="text-gray-800">S.A</option>
              <option value="eirl" className="text-gray-800">E.I.R.L</option>
              <option value="eu" className="text-gray-800">E.U</option>
            </select>
            <ChevronDown className="absolute right-3 top-[34px] w-4 h-4 text-orange-400 pointer-events-none" />
            <ErrMsg msg={er.tipo_sociedad} />
          </div>
        </div>

        {/* Actividad economica & Estado */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Actividad económica</label>
            <input type="text" name="actividad_economica" value={f.actividad_economica} onChange={handleChange} onBlur={handleBlur}
              placeholder="Ej: Consultoría financiera" className={inputClass(er.actividad_economica)} />
            <ErrMsg msg={er.actividad_economica} />
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Estado de la empresa</label>
            <select name="estado" value={f.estado} onChange={handleChange} onBlur={handleBlur}
              className={selectClass(er.estado)}>
              <option value="">Activa o Inactiva</option>
              <option value="activa" className="text-gray-800">Activa</option>
              <option value="inactiva" className="text-gray-800">Inactiva</option>
            </select>
            <ChevronDown className="absolute right-3 top-[34px] w-4 h-4 text-orange-400 pointer-events-none" />
            <ErrMsg msg={er.estado} />
          </div>
        </div>

        {/* Representante Legal */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1.5">Representante Legal</label>
          <input type="text" name="representante_legal" value={f.representante_legal} onChange={handleChange} onBlur={handleBlur}
            placeholder="Nombre completo" className={inputClass(er.representante_legal)} />
          <ErrMsg msg={er.representante_legal} />
        </div>

        {/* Tipo & Numero de documento */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Tipo de documento</label>
            <select name="tipo_documento" value={f.tipo_documento} onChange={handleChange} onBlur={handleBlur}
              className={selectClass(er.tipo_documento)}>
              <option value="">Selecciona el tipo</option>
              <option value="CC" className="text-gray-800">CC - Cédula de Ciudadanía</option>
              <option value="CE" className="text-gray-800">CE - Cédula de Extranjería</option>
              <option value="PA" className="text-gray-800">PA - Pasaporte</option>
              <option value="TI" className="text-gray-800">TI - Tarjeta de Identidad</option>
              <option value="NIT" className="text-gray-800">NIT</option>
              <option value="PEP" className="text-gray-800">PEP - Permiso Especial de Permanencia</option>
            </select>
            <ChevronDown className="absolute right-3 top-[34px] w-4 h-4 text-orange-400 pointer-events-none" />
            <ErrMsg msg={er.tipo_documento} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Número de documento</label>
            <input type="text" name="numero_documento" value={f.numero_documento} onChange={handleChange} onBlur={handleBlur}
              placeholder="0000000000" className={inputClass(er.numero_documento)} />
            <ErrMsg msg={er.numero_documento} />
          </div>
        </div>

        {/* Correo y Telefono Personal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Correo Personal</label>
            <input type="email" name="correo_personal" value={f.correo_personal} onChange={handleChange} onBlur={handleBlur}
              placeholder="correo@personal.com" className={inputClass(er.correo_personal)} />
            <ErrMsg msg={er.correo_personal} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Teléfono Personal</label>
            <input type="text" name="telefono_personal" value={f.telefono_personal} onChange={handleChange} onBlur={handleBlur}
              placeholder="3000000000" className={inputClass(er.telefono_personal)} />
            <ErrMsg msg={er.telefono_personal} />
          </div>
        </div>

        {/* Pais, Dept, Ciudad */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">País</label>
            <input type="text" name="pais" value={f.pais} onChange={handleChange} onBlur={handleBlur}
              placeholder="Colombia" className={inputClass(er.pais)} />
            <ErrMsg msg={er.pais} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Departamento/Estado</label>
            <input type="text" name="departamento" value={f.departamento} onChange={handleChange} onBlur={handleBlur}
              placeholder="Norte de Santander" className={inputClass(er.departamento)} />
            <ErrMsg msg={er.departamento} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Ciudad</label>
            <input type="text" name="ciudad" value={f.ciudad} onChange={handleChange} onBlur={handleBlur}
              placeholder="Cúcuta" className={inputClass(er.ciudad)} />
            <ErrMsg msg={er.ciudad} />
          </div>
        </div>

        {/* Dirección */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1.5">Dirección</label>
          <input type="text" name="direccion" value={f.direccion} onChange={handleChange} onBlur={handleBlur}
            placeholder="Calle 00 # 00-00" className={inputClass(er.direccion)} />
          <ErrMsg msg={er.direccion} />
        </div>

        {/* Teléfono & Correo Empresarial */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Teléfono Empresarial</label>
            <input type="text" name="telefono_empresarial" value={f.telefono_empresarial || ''} onChange={handleChange} onBlur={handleBlur}
              placeholder="0000000000" className={inputClass(er.telefono_empresarial)} />
            <ErrMsg msg={er.telefono_empresarial} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Correo Empresarial</label>
            <input type="email" name="correo_empresarial" value={f.correo_empresarial || ''} onChange={handleChange} onBlur={handleBlur}
              placeholder="correo@empresa.com" className={inputClass(er.correo_empresarial)} />
            <ErrMsg msg={er.correo_empresarial} />
          </div>
        </div>

        <div className="pt-2">
          <button type="submit" disabled={loading}
            className={`w-full font-bold py-3 rounded text-sm transition-colors shadow-sm text-white ${loading ? 'bg-orange-300 cursor-not-allowed' : 'bg-[#f97316] hover:bg-[#ea580c]'}`}>
            {loading ? (isEdit ? 'Actualizando...' : 'Guardando...') : (isEdit ? 'Actualizar' : 'Guardar')}
          </button>
        </div>
      </form>
    </div>
  );
};
