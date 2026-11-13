import React from "react";
import { ChevronDown } from "lucide-react";
import { AuditoriaErrors } from "../../../hooks/useAuditoriaValidation";
import { TIPOS_AUDITORIA } from "../../../constants/tipos";

interface TipoAuditoriaSectionProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    errors?: AuditoriaErrors;
}

export const TipoAuditoriaSection: React.FC<TipoAuditoriaSectionProps> = ({
    value,
    onChange,
    errors = {},
}) => {
    // Si la auditoría tiene un tipo antiguo escrito a mano, se conserva como opción.
    const opciones: string[] = [...TIPOS_AUDITORIA];
    if (value && !opciones.includes(value)) opciones.unshift(value);

    return (
        <div className="mb-8 flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
            <label className="text-sm text-gray-600 sm:w-44 flex-shrink-0 sm:pt-2">
                Tipo de Auditoría: <span className="text-red-500">*</span>
            </label>
            <div className="flex-1">
                <div className="relative">
                    <select
                        name="tipoAuditoria"
                        value={value}
                        onChange={onChange}
                        className={`w-full appearance-none px-3 sm:px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:border-transparent bg-[#F3F3F3] text-sm sm:text-base ${errors.tipoAuditoria
                                ? "border-red-500 focus:ring-red-400 bg-red-50"
                                : "border-gray-300 focus:ring-blue-500"
                            } ${value ? "text-gray-800" : "text-gray-400"}`}
                    >
                        <option value="">Selecciona el tipo de auditoría</option>
                        {opciones.map((tipo) => (
                            <option key={tipo} value={tipo} className="text-gray-800">{tipo}</option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
                {errors.tipoAuditoria && (
                    <p className="mt-1 text-xs text-red-500">{errors.tipoAuditoria}</p>
                )}
            </div>
        </div>
    );
};
