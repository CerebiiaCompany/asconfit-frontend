import React, { useState, useEffect } from 'react';
import { auditoriaService } from '../../services/auditoriaService';

interface OverdueTask {
  id: number;
  nombre: string;
  delegado: string;
  empresa: string;
  dias_atraso: number;
  fecha_entrega: string;
  estado: string;
}

interface OverdueStats {
  total_atrasadas: number;
  promedio_dias_atraso: number;
  max_dias_atraso: number;
  por_delegado: Record<string, { total: number; promedio_dias: number; max_dias: number }>;
  detalles: OverdueTask[];
}

export const OverdueStats: React.FC = () => {
  const [stats, setStats] = useState<OverdueStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await auditoriaService.getOverdueStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading overdue stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const truncateText = (text: string, maxLength: number) => {
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

  if (!stats || stats.total_atrasadas === 0) {
    return (
      <div className="bg-white shadow-xl rounded-2xl p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Estadísticas de Atrasos</h3>
        <div className="flex items-center justify-center py-8 text-gray-500">
          <svg className="w-12 h-12 text-green-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-center">No hay tareas atrasadas</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-xl rounded-2xl p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Estadísticas de Atrasos</h3>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-red-50 rounded-xl p-4 border border-red-100">
          <p className="text-xs font-semibold text-red-600 uppercase tracking-wider mb-1">Total Atrasadas</p>
          <p className="text-2xl font-bold text-red-700">{stats.total_atrasadas}</p>
        </div>
        <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
          <p className="text-xs font-semibold text-orange-600 uppercase tracking-wider mb-1">Promedio Días</p>
          <p className="text-2xl font-bold text-orange-700">{stats.promedio_dias_atraso}</p>
        </div>
        <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100">
          <p className="text-xs font-semibold text-yellow-600 uppercase tracking-wider mb-1">Máximo Días</p>
          <p className="text-2xl font-bold text-yellow-700">{stats.max_dias_atraso}</p>
        </div>
      </div>

      {/* By Delegate Chart */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Por Delegado</h4>
        <div className="space-y-2">
          {Object.entries(stats.por_delegado).map(([delegado, data]) => (
            <div key={delegado} className="flex items-center gap-3">
              <div className="flex-1">
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-gray-700">{delegado}</span>
                  <span className="text-gray-500">{data.total} tareas</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-orange-500 h-2 rounded-full transition-all"
                    style={{ width: `${(data.total / stats.total_atrasadas) * 100}%` }}
                  />
                </div>
              </div>
              <div className="text-xs text-gray-500 w-16 text-right">
                {data.promedio_dias}d prom
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Overdue Tasks List */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Tareas Atrasadas</h4>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {stats.detalles.map((tarea) => (
            <div 
              key={tarea.id} 
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate" title={tarea.nombre}>
                  {truncateText(tarea.nombre, 40)}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-500">{tarea.delegado}</span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500">{tarea.empresa}</span>
                </div>
              </div>
              <div className="ml-3 text-right">
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                  tarea.dias_atraso > 10 ? 'bg-red-100 text-red-700' :
                  tarea.dias_atraso > 5 ? 'bg-orange-100 text-orange-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {tarea.dias_atraso} días
                </div>
                <p className="text-xs text-gray-400 mt-1">{tarea.fecha_entrega}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
