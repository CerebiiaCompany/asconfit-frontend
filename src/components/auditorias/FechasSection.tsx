import React from 'react';

interface FechasSectionProps {
    fechaInicial: string;
    fechaCorte: string;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FechasSection: React.FC<FechasSectionProps> = ({
    fechaInicial,
    fechaCorte,
    onInputChange
}) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
                <label className="block text-sm text-gray-600 mb-2">Fecha inicial de auditoría</label>
                <div className="flex items-center gap-2">
                    <img src="/Date.png" alt="Calendar" className="h-6 w-6" />
                    <input
                        type="date"
                        name="fechaInicial"
                        value={fechaInicial}
                        onChange={onInputChange}
                        className="w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-[#F3F3F3]"
                        style={{ colorScheme: 'light' }}
                    />
                </div>
            </div>
            <div>
                <label className="block text-sm text-gray-600 mb-2">Fecha de Corte:</label>
                <div className="flex items-center gap-2">
                    <img src="/Date.png" alt="Calendar" className="h-6 w-6" />
                    <input
                        type="date"
                        name="fechaCorte"
                        value={fechaCorte}
                        onChange={onInputChange}
                        className="w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-[#F3F3F3]"
                        style={{ colorScheme: 'light' }}
                    />
                </div>
            </div>
        </div>
    );
};
