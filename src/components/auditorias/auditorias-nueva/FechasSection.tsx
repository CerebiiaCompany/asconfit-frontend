import React from "react";
import { DatePicker } from "../../common/DatePicker";

interface FechasSectionProps {
  fechaInicial: string;
  fechaCorte: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFechaInicialChange?: (val: string) => void;
  onFechaCorteChange?: (val: string) => void;
}

export const FechasSection: React.FC<FechasSectionProps> = ({
  fechaInicial,
  fechaCorte,
  onInputChange,
  onFechaInicialChange,
  onFechaCorteChange,
}) => {
  const today = new Date().toISOString().split("T")[0];

  const getMinFechaCorte = () => {
    if (!fechaInicial) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow.toISOString().split("T")[0];
    }
    const date = new Date(fechaInicial);
    date.setDate(date.getDate() + 1);
    return date.toISOString().split("T")[0];
  };

  // Adapter: si no se pasan los handlers directos, simula el evento para compatibilidad
  const handleFechaInicial = (val: string) => {
    if (onFechaInicialChange) {
      onFechaInicialChange(val);
    } else {
      onInputChange({ target: { name: "fechaInicial", value: val } } as React.ChangeEvent<HTMLInputElement>);
    }
    // Si la fecha de corte queda antes de la nueva fecha inicial, limpiarla
    if (fechaCorte && val && fechaCorte <= val) {
      if (onFechaCorteChange) onFechaCorteChange("");
      else onInputChange({ target: { name: "fechaCorte", value: "" } } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  const handleFechaCorte = (val: string) => {
    if (onFechaCorteChange) {
      onFechaCorteChange(val);
    } else {
      onInputChange({ target: { name: "fechaCorte", value: val } } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8">
      <div>
        <label className="block text-sm text-gray-600 mb-2">
          Fecha inicial de auditoría
        </label>
        <div className="flex items-center gap-2">
          <img src="/Date.png" alt="Calendar" className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" />
          <div className="flex-1">
            <DatePicker
              value={fechaInicial}
              onChange={handleFechaInicial}
              min={today}
            />
          </div>
        </div>
      </div>
      <div>
        <label className="block text-sm text-gray-600 mb-2">
          Fecha de Corte:
        </label>
        <div className="flex items-center gap-2">
          <img src="/Date.png" alt="Calendar" className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" />
          <div className="flex-1">
            <DatePicker
              value={fechaCorte}
              onChange={handleFechaCorte}
              min={getMinFechaCorte()}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
