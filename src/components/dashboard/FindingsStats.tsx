import React, { useState, useEffect } from 'react';
import { findingService } from '../../services/findingService';

interface FindingsStatsData {
  this_month: number;
  by_severity: { critico: number; grave: number; leve: number };
  total: number;
}

export const FindingsStats: React.FC = () => {
  const [stats, setStats] = useState<FindingsStatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await findingService.getStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading findings stats:', error);
    } finally {
      setLoading(false);
    }
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

  if (!stats || stats.total === 0) {
    return (
      <div className="bg-white shadow-xl rounded-2xl p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Estadísticas de Hallazgos</h3>
        <div className="flex items-center justify-center py-8 text-gray-500">
          <svg className="w-12 h-12 text-green-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-center">No hay hallazgos registrados</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-xl rounded-2xl p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Estadísticas de Hallazgos</h3>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
          <p className="text-xs font-semibold text-purple-600 uppercase tracking-wider mb-1">Este Mes</p>
          <p className="text-2xl font-bold text-purple-700">{stats.this_month}</p>
        </div>
        <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
          <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">Total</p>
          <p className="text-2xl font-bold text-indigo-700">{stats.total}</p>
        </div>
      </div>

      {/* By Severity */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Por Severidad</h4>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-medium text-gray-700">Crítico</span>
              <span className="text-gray-500">{stats.by_severity.critico}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-red-500 h-2 rounded-full transition-all"
                style={{ width: `${stats.total > 0 ? (stats.by_severity.critico / stats.total) * 100 : 0}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-medium text-gray-700">Grave</span>
              <span className="text-gray-500">{stats.by_severity.grave}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-orange-500 h-2 rounded-full transition-all"
                style={{ width: `${stats.total > 0 ? (stats.by_severity.grave / stats.total) * 100 : 0}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-medium text-gray-700">Leve</span>
              <span className="text-gray-500">{stats.by_severity.leve}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-yellow-500 h-2 rounded-full transition-all"
                style={{ width: `${stats.total > 0 ? (stats.by_severity.leve / stats.total) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
