import React from "react";
import { Auditoria } from "../../types/tarea.types";

interface InfoEmpresaProps {
  auditoria: Auditoria;
}

export const InfoEmpresa: React.FC<InfoEmpresaProps> = ({ auditoria }) => {
  return (
    <div className="bg-white shadow-xl rounded-2xl p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        {auditoria.empresa?.razon_social || auditoria.razon_social || 'Sin nombre'}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-600">NIT:</span>
          <span className="ml-2 font-medium">{auditoria.empresa?.nit || auditoria.nit || '-'}</span>
        </div>
        <div>
          <span className="text-gray-600">Representante Legal:</span>
          <span className="ml-2 font-medium">{auditoria.empresa?.representante_legal || auditoria.responsable || '-'}</span>
        </div>
        <div>
          <span className="text-gray-600">Contacto:</span>
          <span className="ml-2 font-medium">{auditoria.contacto}</span>
        </div>
      </div>
    </div>
  );
};
