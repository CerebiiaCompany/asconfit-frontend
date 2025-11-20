import React from "react";
import { Auditoria } from "../../../types/auditoria";

interface AuditoriaListProps {
  auditorias: Auditoria[];
  onViewAuditoria: (id: number) => void;
}

export const AuditoriaList: React.FC<AuditoriaListProps> = ({
  auditorias,
  onViewAuditoria,
}) => {
  const getEstadoBadge = (estado: Auditoria["estado"]) => {
    const badges = {
      pendiente: "bg-red-100 text-red-800 border-red-200",
      en_progreso: "bg-yellow-100 text-yellow-800 border-yellow-200",
      completada: "bg-green-100 text-green-800 border-green-200",
    };
    const labels = {
      pendiente: "Pendiente",
      en_progreso: "En Progreso",
      completada: "Completada",
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold border ${badges[estado]}`}
      >
        {labels[estado]}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Empresa
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              NIT
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Razón Social
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fecha Creación
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {auditorias.map((auditoria) => (
            <tr
              key={auditoria.id}
              className="hover:bg-gray-50 transition-colors"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {auditoria.empresa || "Sin empresa"}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">
                  {auditoria.nit || "-"}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-500 max-w-xs truncate">
                  {auditoria.razon_social || "-"}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getEstadoBadge(auditoria.estado)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(auditoria.created_at)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => onViewAuditoria(auditoria.id)}
                  className="text-blue-600 hover:text-blue-900 transition-colors"
                >
                  Ver detalles
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
