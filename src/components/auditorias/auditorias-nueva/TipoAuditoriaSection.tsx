import React from "react";
import { AuditoriaErrors } from "../../../hooks/useAuditoriaValidation";

interface TipoAuditoriaSectionProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    errors?: AuditoriaErrors;
}

export const TipoAuditoriaSection: React.FC<TipoAuditoriaSectionProps> = ({
    value,
    onChange,
    errors = {},
}) => {
    return (
        <div className="mb-8 flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
            <label className="text-sm text-gray-600 sm:w-44 flex-shrink-0 sm:pt-2">
                Tipo de Auditoría: <span className="text-red-500">*</span>
            </label>
            <div className="flex-1">
                <input
                    type="text"
                    name="tipoAuditoria"
                    value={value}
                    onChange={onChange}
                    placeholder="Ej: Financiera, Gestión, Tributaria, etc."
                    className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent bg-[#F3F3F3] text-sm sm:text-base ${errors.tipoAuditoria
                            ? "border-red-500 focus:ring-red-400 bg-red-50"
                            : "border-gray-300 focus:ring-blue-500"
                        }`}
                />
                {errors.tipoAuditoria && (
                    <p className="mt-1 text-xs text-red-500">{errors.tipoAuditoria}</p>
                )}
            </div>
        </div>
    );
};
