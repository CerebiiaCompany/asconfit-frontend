import React from "react";

interface AuditoriaInfoCardProps {
  auditoria: any;
}

const formatDate = (dateString?: string): string => {
  if (!dateString) return "-";
  try {
    let date: Date;
    if (dateString.includes("T")) {
      date = new Date(dateString);
    } else {
      date = new Date(dateString + "T00:00:00");
    }
    if (isNaN(date.getTime())) return "-";
    const day = date.getUTCDate();
    const monthNames = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
    const month = monthNames[date.getUTCMonth()];
    const year = date.getUTCFullYear();
    return `${day} ${month} ${year}`;
  } catch {
    return "-";
  }
};

const InfoField: React.FC<{ label: string; value?: string }> = ({ label, value }) => (
  <div className="space-y-0.5">
    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">{label}</span>
    <span className="text-sm font-semibold text-gray-800 block">{value || "—"}</span>
  </div>
);

export const AuditoriaInfoCard: React.FC<AuditoriaInfoCardProps> = ({ auditoria }) => {
  return (
    <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden mb-6">
      <div className="bg-gradient-to-r from-slate-50 to-gray-50 px-5 py-3 border-b border-gray-100">
        <h2 className="text-base font-bold text-gray-800">Detalle de Auditoría</h2>
      </div>
      <div className="px-5 py-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-4">
          <InfoField label="NIT" value={auditoria.empresa?.nit || auditoria.nit} />
          <InfoField label="Razón Social" value={auditoria.empresa?.razon_social || auditoria.razon_social} />
          <InfoField label="Actividad Económica" value={auditoria.empresa?.actividad_economica || auditoria.actividad_economica} />
          <InfoField label="Dirección" value={auditoria.empresa?.direccion || auditoria.direccion} />
          <InfoField label="Responsable" value={auditoria.empresa?.representante_legal || auditoria.responsable} />
          <InfoField label="Contacto" value={auditoria.empresa?.telefono_empresarial || auditoria.contacto} />
          <InfoField label="PT" value={auditoria.pt} />
          <InfoField label="Fecha Inicial" value={formatDate(auditoria.fecha_inicial)} />
          <InfoField label="Fecha Corte" value={formatDate(auditoria.fecha_corte)} />
          {auditoria.delegado1 && (
            <InfoField label="Delegado 1" value={auditoria.delegado1.name} />
          )}
          {auditoria.delegado2 && (
            <InfoField label="Delegado 2" value={auditoria.delegado2.name} />
          )}
        </div>
      </div>
    </div>
  );
};
