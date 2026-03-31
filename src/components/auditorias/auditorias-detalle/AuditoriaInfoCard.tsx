import React from "react";

interface AuditoriaInfoCardProps {
  auditoria: any;
}

// Formatea fechas como "2025-11-21" a partir de valores ISO con tiempo/microsegundos
const formatDate = (dateString?: string): string => {
  if (!dateString) return "-";

  try {
    // Si viene en formato ISO con tiempo (2025-11-21T00:00:00.000000Z), tomar solo la parte de la fecha
    if (dateString.includes("T")) {
      return dateString.split("T")[0];
    }

    return dateString;
  } catch {
    return dateString || "-";
  }
};

export const AuditoriaInfoCard: React.FC<AuditoriaInfoCardProps> = ({
  auditoria,
}) => {
  return (
    <div className="bg-white shadow-xl rounded-2xl overflow-hidden mb-6">
      <div className="px-6 py-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Detalle de Auditoría
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoField label="NIT" value={auditoria.empresa?.nit || auditoria.nit} />
          <InfoField
            label="Razón Social"
            value={auditoria.empresa?.razon_social || auditoria.razon_social}
            className="md:col-span-2"
          />
          <InfoField
            label="Actividad Económica"
            value={auditoria.empresa?.actividad_economica || auditoria.actividad_economica}
          />
          <InfoField label="Dirección" value={auditoria.empresa?.direccion || auditoria.direccion} />
          <InfoField label="Responsable" value={auditoria.empresa?.representante_legal || auditoria.responsable} />
          <InfoField label="Contacto" value={auditoria.empresa?.telefono_empresarial || auditoria.contacto} />
          <InfoField label="PT" value={auditoria.pt} />
          <InfoField
            label="Fecha Inicial"
            value={formatDate(auditoria.fecha_inicial)}
          />
          <InfoField
            label="Fecha Corte"
            value={formatDate(auditoria.fecha_corte)}
          />
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

const InfoField: React.FC<InfoFieldProps> = ({
  label,
  value,
  className = "",
}) => (
  <div className={className}>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <p className="text-gray-900">{value || "-"}</p>
  </div>
);
