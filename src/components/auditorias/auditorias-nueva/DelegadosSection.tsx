import React, { useEffect, useState } from "react";
import { userService, User } from "../../../services/userService";
import { AuditoriaErrors } from "../../../hooks/useAuditoriaValidation";

interface DelegadosSectionProps {
  selectedDelegados: Array<number | null>;
  onDelegateChange: (index: number, value: number | null) => void;
  errors?: AuditoriaErrors;
}

export const DelegadosSection: React.FC<DelegadosSectionProps> = ({
  selectedDelegados,
  onDelegateChange,
  errors = {},
}) => {
  const [delegados, setDelegados] = useState<User[]>([]);

  useEffect(() => {
    userService
      .getDelegados()
      .then(setDelegados)
      .catch((err) => console.error("Error al cargar delegados:", err));
  }, []);

  const renderSelect = (index: number) => {
    // Solo delegado 0 puede mostrar error (el requerido)
    const hasError = index === 0 && !!errors.delegado0;

    return (
      <div
        key={index}
        className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4"
      >
        <label className="text-sm text-gray-600 sm:w-44 flex-shrink-0 sm:pt-2">
          {index === 0 ? (
            <>
              Delegado 1: <span className="text-red-500">*</span>
            </>
          ) : (
            "Delegado 2:"
          )}
        </label>
        <div className="flex-1">
          <select
            value={selectedDelegados[index] ?? ""}
            onChange={(e) => {
              const value = e.target.value;
              onDelegateChange(index, value ? Number(value) : null);
            }}
            className={`w-full px-3 py-2 border rounded-lg bg-white text-sm focus:ring-2 focus:border-transparent ${hasError
                ? "border-red-500 focus:ring-red-400 bg-red-50"
                : "border-gray-300 focus:ring-orange-500"
              }`}
          >
            <option value="">Selecciona un delegado</option>
            {delegados.map((delegado) => (
              <option
                key={delegado.id}
                value={delegado.id}
                disabled={
                  delegado.id === selectedDelegados[(index + 1) % 2] &&
                  selectedDelegados[(index + 1) % 2] !== null
                }
              >
                {delegado.name}
              </option>
            ))}
          </select>
          {hasError && (
            <p className="mt-1 text-xs text-red-500">{errors.delegado0}</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="mb-8">
      <div className="mb-4">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
          Delegados
        </h2>
        <p className="text-sm text-gray-600">
          Asigna hasta dos delegados responsables de esta auditoría.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {renderSelect(0)}
        {renderSelect(1)}
      </div>
    </div>
  );
};
