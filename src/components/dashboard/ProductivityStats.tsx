import React, { useState, useEffect } from 'react';
import { auditoriaService } from '../../services/auditoriaService';

interface ActivityItem {
  nombre: string;
  estado: string;
  delegado: string;
  empresa: string;
  fecha: string;
}

interface DocumentItem {
  nombre: string;
  empresa: string;
  fecha: string;
}

interface ProductivityStatsData {
  ranking_delegados: Record<string, { total: number; this_month: number }>;
  documentos_recientes: DocumentItem[];
  actividad_reciente: ActivityItem[];
}

export const ProductivityStats: React.FC = () => {
  const [stats, setStats] = useState<ProductivityStatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await auditoriaService.getProductivityStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading productivity stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const truncateText = (text: string | null | undefined, maxLength: number) => {
    if (!text) return 'Sin nombre';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  if (loading) {
    return (
      <div className="bg-white shadow-xl rounded-2xl p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-xl rounded-2xl p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Estadísticas de Productividad</h3>
      
      {/* Ranking Delegados */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Ranking de Delegados</h4>
        {Object.keys(stats?.ranking_delegados || {}).length > 0 ? (
          <div className="space-y-2">
            {Object.entries(stats?.ranking_delegados || {}).map(([delegado, data], index) => (
              <div key={delegado} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    index === 0 ? 'bg-yellow-400 text-yellow-900' :
                    index === 1 ? 'bg-gray-300 text-gray-700' :
                    index === 2 ? 'bg-orange-300 text-orange-700' :
                    'bg-gray-200 text-gray-600'
                  }`}>
                    {index + 1}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{delegado}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-800">{data.total} tareas</p>
                  <p className="text-xs text-gray-500">{data.this_month} este mes</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 text-center py-4">No hay datos disponibles</p>
        )}
      </div>

      {/* Documentos Recientes */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Documentos Recientes</h4>
        {stats?.documentos_recientes && stats.documentos_recientes.length > 0 ? (
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {stats.documentos_recientes.map((doc, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate" title={doc.nombre}>
                    {truncateText(doc.nombre, 30)}
                  </p>
                  <p className="text-xs text-gray-500">{doc.empresa}</p>
                </div>
                <p className="text-xs text-gray-400 ml-2">{doc.fecha}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 text-center py-4">No hay documentos recientes</p>
        )}
      </div>

      {/* Actividad Reciente */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Actividad Reciente</h4>
        {stats?.actividad_reciente && stats.actividad_reciente.length > 0 ? (
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {stats.actividad_reciente.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate" title={activity.nombre}>
                    {truncateText(activity.nombre, 30)}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      activity.estado === 'completado' ? 'bg-green-100 text-green-700' :
                      activity.estado === 'revision' ? 'bg-blue-100 text-blue-700' :
                      activity.estado === 'recibido' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {activity.estado || 'pendiente'}
                    </span>
                    <span className="text-xs text-gray-500">{activity.delegado}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-400 ml-2">{activity.fecha}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 text-center py-4">No hay actividad reciente</p>
        )}
      </div>
    </div>
  );
};
