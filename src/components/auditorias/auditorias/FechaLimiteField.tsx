import React from "react";

interface FechaLimiteFieldProps {
    value: string;
    minDate?: string;
    maxDate?: string;
    disabled: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FechaLimiteField: React.FC<FechaLimiteFieldProps> = ({
    value,
    minDate,
    maxDate,
    disabled,
    onChange,
}) => {
    const formatDate = (d: string) =>
        new Date(d).toLocaleDateString("es-CO", { day: "2-digit", month: "2-digit", year: "numeric" });

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha límite</label>
            <input
                type="date"
                value={value}
                min={minDate}
                max={maxDate}
                disabled={disabled}
                onChange={onChange}
                className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none transition-colors ${
                    disabled
                        ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed pointer-events-none"
                        : "border-gray-200 focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                }`}
            />
            {disabled ? (
                <p className="mt-1 text-xs text-gray-400 italic">Selecciona una actividad primero</p>
            ) : (minDate || maxDate) ? (
                <p className="mt-1 text-xs text-gray-400">
                    Rango permitido:{" "}
                    {minDate ? formatDate(minDate) : "—"}
                    {" → "}
                    {maxDate ? formatDate(maxDate) : "—"}
                </p>
            ) : null}
        </div>
    );
};
