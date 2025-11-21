import React from "react";

interface FechasSectionProps {
  fechaInicial: string;
  fechaCorte: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FechasSection: React.FC<FechasSectionProps> = ({
  fechaInicial,
  fechaCorte,
  onInputChange,
}) => {
  // Calcular fecha mínima para fecha de corte (fecha inicial + 1 día)
  const getMinFechaCorte = () => {
    if (!fechaInicial) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow.toISOString().split("T")[0];
    }

    const date = new Date(fechaInicial);
    date.setDate(date.getDate() + 1); // Sumar 1 día
    return date.toISOString().split("T")[0];
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8">
      <div>
        <label className="block text-sm text-gray-600 mb-2">
          Fecha inicial de auditoría
        </label>
        <div className="flex items-center gap-2">
          <img
            src="/Date.png"
            alt="Calendar"
            className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0"
          />
          <input
            type="date"
            name="fechaInicial"
            value={fechaInicial}
            onChange={onInputChange}
            min={new Date().toISOString().split("T")[0]}
            className="flex-1 sm:w-64 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-[#F3F3F3] text-sm sm:text-base"
            style={{ colorScheme: "light" }}
          />
        </div>
      </div>
      <div>
        <label className="block text-sm text-gray-600 mb-2">
          Fecha de Corte:
        </label>
        <div className="flex items-center gap-2">
          <img
            src="/Date.png"
            alt="Calendar"
            className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0"
          />
          <input
            type="date"
            name="fechaCorte"
            value={fechaCorte}
            onChange={onInputChange}
            min={getMinFechaCorte()}
            className="flex-1 sm:w-64 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-[#F3F3F3] text-sm sm:text-base"
            style={{ colorScheme: "light" }}
          />
        </div>
      </div>
    </div>
  );
};
