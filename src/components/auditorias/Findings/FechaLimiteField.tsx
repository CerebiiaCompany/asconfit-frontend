import React from "react";
import { DatePicker } from "../../common/DatePicker";

interface FechaLimiteFieldProps {
    value: string;
    minDate?: string;
    maxDate?: string;
    disabled: boolean;
    onChange: (val: string) => void;
}

export const FechaLimiteField: React.FC<FechaLimiteFieldProps> = ({
    value, minDate, maxDate, disabled, onChange,
}) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Fecha límite</label>
        {disabled ? (
            <div className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-100 text-gray-400 cursor-not-allowed">
                dd/mm/aaaa
            </div>
        ) : (
            <DatePicker
                value={value}
                onChange={onChange}
                min={minDate}
                max={maxDate}
            />
        )}
        {disabled && (
            <p className="mt-1 text-xs text-gray-400 italic">Selecciona una actividad primero</p>
        )}
    </div>
);
