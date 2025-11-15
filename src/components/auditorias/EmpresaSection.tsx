import React from 'react';
import { AuditoriaFormData } from '../../types/auditoria.types';

interface EmpresaSectionProps {
    formData: AuditoriaFormData;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const EmpresaSection: React.FC<EmpresaSectionProps> = ({ formData, onInputChange }) => {
    return (
        <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Empresa</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-4">
                    <label className="text-sm text-gray-600 w-44 flex-shrink-0">Nit:</label>
                    <input
                        type="text"
                        name="nit"
                        value={formData.nit}
                        onChange={onInputChange}
                        placeholder="1004404347E-0"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-[#F3F3F3]"
                    />
                </div>
                <div className="flex items-center gap-4">
                    <label className="text-sm text-gray-600 w-44 flex-shrink-0">Dirección:</label>
                    <input
                        type="text"
                        name="direccion"
                        value={formData.direccion}
                        onChange={onInputChange}
                        placeholder="calle 0 numero 0-200"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-[#F3F3F3]"
                    />
                </div>
                <div className="flex items-center gap-4">
                    <label className="text-sm text-gray-600 w-44 flex-shrink-0">Razón social:</label>
                    <input
                        type="text"
                        name="razonSocial"
                        value={formData.razonSocial}
                        onChange={onInputChange}
                        placeholder="Comercializadora los Robles SAS"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-[#F3F3F3]"
                    />
                </div>
                <div className="flex items-center gap-4">
                    <label className="text-sm text-gray-600 w-44 flex-shrink-0">Responsable o representante legal:</label>
                    <input
                        type="text"
                        name="responsable"
                        value={formData.responsable}
                        onChange={onInputChange}
                        placeholder="Mauricio contreras"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-[#F3F3F3]"
                    />
                </div>
                <div className="flex items-center gap-4">
                    <label className="text-sm text-gray-600 w-44 flex-shrink-0">Actividad Económica CIU:</label>
                    <input
                        type="text"
                        name="actividadEconomica"
                        value={formData.actividadEconomica}
                        onChange={onInputChange}
                        placeholder="1105"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-[#F3F3F3]"
                    />
                </div>
                <div className="flex items-center gap-4">
                    <label className="text-sm text-gray-600 w-44 flex-shrink-0">Contacto:</label>
                    <input
                        type="text"
                        name="contacto"
                        value={formData.contacto}
                        onChange={onInputChange}
                        placeholder="000 000 000"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-[#F3F3F3]"
                    />
                </div>
            </div>
        </div>
    );
};
