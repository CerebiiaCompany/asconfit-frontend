import React, { useEffect, useState } from "react";
import { userService, User } from "../../../services/userService";

interface DelegadosSectionProps {
  selectedDelegados: Array<number | null>;
  onDelegateChange: (index: number, value: number | null) => void;
}

export const DelegadosSection: React.FC<DelegadosSectionProps> = ({
  selectedDelegados,
  onDelegateChange,
}) => {
  const [delegados, setDelegados] = useState<User[]>([]);

  useEffect(() => {
    const cargarDelegados = async () => {
      try {
        const lista = await userService.getDelegados();
        setDelegados(lista);
      } catch (error) {
        console.error("Error al cargar delegados:", error);
      }
    };

    cargarDelegados();
  }, []);

  const renderSelect = (index: number) => {
    return (
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
        <label className="text-sm text-gray-600 sm:w-44 flex-shrink-0">
          {index === 0 ? "Delegado 1:" : "Delegado 2:"}
        </label>
        <select
          value={selectedDelegados[index] ?? ""}
          onChange={(e) => {
            const value = e.target.value;
            onDelegateChange(index, value ? Number(value) : null);
          }}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
