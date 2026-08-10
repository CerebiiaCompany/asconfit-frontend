import React from "react";
import { AuditoriaFormData } from "../../../types/auditoria.types";
import { AuditoriaErrors } from "../../../hooks/useAuditoriaValidation";

interface EmpresaSectionProps {
  formData: AuditoriaFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors?: AuditoriaErrors;
}

const fieldClass = (error?: string) =>
  `flex-1 px-3 sm:px-4 py-2 border rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed text-sm sm:text-base focus:outline-none ${error ? "border-red-500 bg-red-50" : "border-gray-300"
  }`;

export const EmpresaSection: React.FC<EmpresaSectionProps> = ({
  formData,
  onInputChange,
  errors = {},
}) => {
  const handleNumericChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (value === "" || /^\d+$/.test(value)) {
      onInputChange(e);
    }
  };

  const fields: {
    label: string;
    name: keyof AuditoriaFormData;
    placeholder: string;
    numeric?: boolean;
    errorKey: keyof AuditoriaErrors;
  }[] = [
      { label: "Empresa:", name: "empresa", placeholder: "Nombre de la empresa", errorKey: "empresa" },
      { label: "Nit:", name: "nit", placeholder: "1004404347", numeric: true, errorKey: "nit" },
      { label: "Dirección:", name: "direccion", placeholder: "calle 0 numero 0-200", errorKey: "direccion" },
      { label: "Razón social:", name: "razonSocial", placeholder: "Comercializadora los Robles SAS", errorKey: "razonSocial" },
      { label: "Responsable o representante legal:", name: "responsable", placeholder: "Mauricio contreras", errorKey: "responsable" },
      { label: "Actividad Económica CIU:", name: "actividadEconomica", placeholder: "1105", errorKey: "actividadEconomica" },
      { label: "Contacto:", name: "contacto", placeholder: "000 000 000", numeric: true, errorKey: "contacto" },
    ];

  return (
    <div className="mb-8">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">
        Empresa
      </h2>

      {/* Aviso si hay errores en esta sección */}
      {fields.some((f) => errors[f.errorKey]) && (
        <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
          Selecciona una empresa usando el buscador de arriba para completar
          estos campos.
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {fields.map(({ label, name, placeholder, numeric, errorKey }) => (
          <div key={name} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <label className="text-sm text-gray-600 sm:w-44 flex-shrink-0">
              {label}
            </label>
            <div className="flex-1">
              <input
                type="text"
                name={name}
                value={(formData[name] as string) ?? ""}
                onChange={numeric ? handleNumericChange : onInputChange}
                placeholder={placeholder}
                disabled
                className={fieldClass(errors[errorKey])}
              />
              {errors[errorKey] && (
                <p className="mt-1 text-xs text-red-500">{errors[errorKey]}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
