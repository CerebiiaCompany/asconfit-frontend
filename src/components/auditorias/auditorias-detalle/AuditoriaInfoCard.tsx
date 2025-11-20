import React from 'react';

interface AuditoriaInfoCardProps {
    auditoria: any;
}

export const AuditoriaInfoCard: React.FC<AuditoriaInfoCardProps> = ({ auditoria }) => {
    return (
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden mb-6">
            <div className="px-6 py-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">
                    Detalle de Auditoría
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InfoField label="Empresa" value={auditoria.empresa} />
                    <InfoField label="NIT" value={auditoria.nit} />
                    <InfoField label="Razón Social" value={auditoria.razon_social} className="md:col-span-2" />
                    <InfoField label="Actividad Económica" value={auditoria.actividad_economica} />
                    <InfoField label="Dirección" value={auditoria.direccion} />
                    <InfoField label="Responsable" value={auditoria.responsable} />
                    <InfoField label="Contacto" value={auditoria.contacto} />
                    <InfoField label="PT" value={auditoria.pt} />
                    <InfoField label="Fecha Inicial" value={auditoria.fecha_inicial} />
                    <InfoField label="Fecha Corte" value={auditoria.fecha_corte} />
                </div>
            </div>
        </div>
    );
};

interface InfoFieldProps {
    label: string;
    value: string;
    className?: string;
}

const InfoField: React.FC<InfoFieldProps> = ({ label, value, className = '' }) => (
    <div className={className}>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <p className="text-gray-900">{value || '-'}</p>
    </div>
);
