import React, { useState, useEffect } from 'react';
import { usePapelera } from '../../hooks/usePapelera';
import { auditoriaService } from '../../services/auditoriaService';
import { DeleteConfirmModal } from '../common/DeleteConfirmModal';
import { PapeleraToolbar } from './PapeleraToolbar';
import { PapeleraTable } from './PapeleraTable';
import { PapeleraCards } from './PapeleraCards';
import { SearchInput } from '../SearchInput';
import { useToast } from '../../contexts/ToastContext';

interface AuditoriaTrashed {
  id: number;
  empresa?: {
    razon_social: string;
    nit: string;
  };
  fecha_inicial?: string;
  fecha_corte?: string;
  estado: string;
  deleted_at: string;
  tipo_auditoria?: string;
}

export const PapeleraList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [auditorias, setAuditorias] = useState<AuditoriaTrashed[]>([]);
  const [loadingAuditorias, setLoadingAuditorias] = useState(false);
  const [selectedAuditoriaIds, setSelectedAuditoriaIds] = useState<number[]>([]);
  const [showConfirmAuditorias, setShowConfirmAuditorias] = useState(false);
  const [activeTab, setActiveTab] = useState<'documentos' | 'auditorias'>('documentos');
  const { addToast } = useToast();

  const {
    documentos, loading, selectedIds, showConfirm, setShowConfirm,
    handleSelectAll, handleSelect, handleRestore, handleForceDelete,
  } = usePapelera();

  useEffect(() => {
    if (activeTab === 'auditorias') {
      fetchAuditoriasPapelera();
    }
  }, [activeTab]);

  const fetchAuditoriasPapelera = async () => {
    setLoadingAuditorias(true);
    try {
      const data = await auditoriaService.getPapelera();
      setAuditorias(data);
    } catch (error) {
      console.error('Error al cargar auditorías en papelera:', error);
    } finally {
      setLoadingAuditorias(false);
    }
  };

  const handleRestoreAuditoria = async () => {
    if (selectedAuditoriaIds.length === 0) return;

    try {
      for (const id of selectedAuditoriaIds) {
        await auditoriaService.restoreAuditoria(id);
      }
      setSelectedAuditoriaIds([]);
      fetchAuditoriasPapelera();
      addToast('Auditorías restauradas exitosamente', 'success');
    } catch (error) {
      console.error('Error al restaurar auditorías:', error);
      addToast('Error al restaurar auditorías', 'error');
    }
  };

  const handleForceDeleteAuditoria = async () => {
    if (selectedAuditoriaIds.length === 0) return;

    try {
      for (const id of selectedAuditoriaIds) {
        await auditoriaService.forceDeleteAuditoria(id);
      }
      setSelectedAuditoriaIds([]);
      setShowConfirmAuditorias(false);
      fetchAuditoriasPapelera();
      addToast('Auditorías eliminadas permanentemente', 'success');
    } catch (error) {
      console.error('Error al eliminar auditorías:', error);
      addToast('Error al eliminar auditorías', 'error');
    }
  };

  const filteredDocs = documentos.filter(doc =>
    (doc.nombre_original || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (doc.carpeta?.empresa?.razon_social || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (doc.carpeta?.nombre || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAuditorias = auditorias.filter(aud =>
    (aud.empresa?.razon_social || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (aud.empresa?.nit || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDaysRemaining = (deletedAt: string) => {
    const deleted = new Date(deletedAt);
    const now = new Date();
    const diff = 30 - Math.floor((now.getTime() - deleted.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-8 mt-6">
      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('documentos')}
          className={`pb-3 px-4 font-medium transition-colors ${activeTab === 'documentos'
            ? 'text-orange-500 border-b-2 border-orange-500'
            : 'text-gray-500 hover:text-gray-700'
            }`}
        >
          Documentos ({documentos.length})
        </button>
        <button
          onClick={() => setActiveTab('auditorias')}
          className={`pb-3 px-4 font-medium transition-colors ${activeTab === 'auditorias'
            ? 'text-orange-500 border-b-2 border-orange-500'
            : 'text-gray-500 hover:text-gray-700'
            }`}
        >
          Auditorías ({auditorias.length})
        </button>
      </div>

      {activeTab === 'documentos' ? (
        <>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
            <SearchInput
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Buscar por nombre, empresa..."
              className="w-full sm:w-80"
            />
            <div className="flex gap-2 sm:gap-4">
              <button
                onClick={() => setShowConfirm(true)}
                disabled={selectedIds.length === 0 || loading}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-6 py-2 border border-red-500 text-red-600 bg-white rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span className="font-medium">Destruir ({selectedIds.length})</span>
              </button>
              <button
                onClick={handleRestore}
                disabled={selectedIds.length === 0 || loading}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-6 py-2 bg-[#FF9411] text-white rounded-lg hover:opacity-90 transition-opacity shadow-sm disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
                <span className="font-semibold">Restaurar ({selectedIds.length})</span>
              </button>
            </div>
          </div>

          <PapeleraTable
            docs={filteredDocs}
            loading={loading}
            selectedIds={selectedIds}
            onSelectAll={checked => handleSelectAll(checked, filteredDocs)}
            onSelect={handleSelect}
          />

          <DeleteConfirmModal
            isOpen={showConfirm}
            onClose={() => setShowConfirm(false)}
            onConfirm={handleForceDelete}
            loading={loading}
            title="Destruir Totalmente"
            message={`Estás a punto de vaciar y destruir definitivamente ${selectedIds.length} archivo(s).\nYa NO podrán recuperarse.\n\n¿Deseas continuar?`}
          />
        </>
      ) : (
        <>
          {/* Toolbar para auditorías */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
            <SearchInput
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Buscar por nombre, empresa..."
              className="w-full sm:w-80"
            />
            <div className="flex gap-2 sm:gap-4">
              <button
                onClick={() => setShowConfirmAuditorias(true)}
                disabled={selectedAuditoriaIds.length === 0 || loadingAuditorias}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-6 py-2 border border-red-500 text-red-600 bg-white rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span className="font-medium">Destruir ({selectedAuditoriaIds.length})</span>
              </button>
              <button
                onClick={handleRestoreAuditoria}
                disabled={selectedAuditoriaIds.length === 0 || loadingAuditorias}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-6 py-2 bg-[#FF9411] text-white rounded-lg hover:opacity-90 transition-opacity shadow-sm disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
                <span className="font-semibold">Restaurar ({selectedAuditoriaIds.length})</span>
              </button>
            </div>
          </div>

          {/* Lista de auditorías */}
          {loadingAuditorias ? (
            <div className="py-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Cargando auditorías...</p>
            </div>
          ) : filteredAuditorias.length === 0 ? (
            <div className="py-16 text-center">
              <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <p className="text-gray-400 font-medium">No hay auditorías en la papelera</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAuditorias.map((auditoria) => (
                <div key={auditoria.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    {/* Checkbox personalizado */}
                    <label className="relative flex items-center cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedAuditoriaIds.includes(auditoria.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedAuditoriaIds([...selectedAuditoriaIds, auditoria.id]);
                          } else {
                            setSelectedAuditoriaIds(selectedAuditoriaIds.filter(id => id !== auditoria.id));
                          }
                        }}
                        className="sr-only peer"
                      />
                      <div className={`w-6 h-6 border-2 rounded-md transition-all duration-200 flex items-center justify-center ${selectedAuditoriaIds.includes(auditoria.id)
                        ? 'bg-orange-500 border-orange-500'
                        : 'bg-white border-gray-300 group-hover:border-orange-400'
                        }`}>
                        {selectedAuditoriaIds.includes(auditoria.id) && (
                          <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </label>
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Información de la empresa */}
                      <div className="md:col-span-2">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {auditoria.empresa?.razon_social || 'Sin empresa'}
                        </h3>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-gray-500">NIT:</span>
                            <span className="ml-2 font-medium text-gray-700">{auditoria.empresa?.nit || '-'}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Fecha:</span>
                            <span className="ml-2 font-medium text-gray-700">
                              {auditoria.fecha_inicial ? new Date(auditoria.fecha_inicial).toLocaleDateString('es-ES', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                              }) : '-'}
                            </span>
                          </div>
                          {auditoria.tipo_auditoria && (
                            <div className="col-span-2">
                              <span className="text-gray-500">Tipo:</span>
                              <span className="ml-2 font-medium text-gray-700">{auditoria.tipo_auditoria}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Badge de días restantes */}
                      <div className="flex items-start justify-end">
                        <div className="text-right">
                          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm ${getDaysRemaining(auditoria.deleted_at) > 15
                            ? 'bg-green-100 text-green-800'
                            : getDaysRemaining(auditoria.deleted_at) > 7
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                            }`}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {getDaysRemaining(auditoria.deleted_at)} días restantes
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            Eliminada: {new Date(auditoria.deleted_at).toLocaleDateString('es-ES')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <DeleteConfirmModal
            isOpen={showConfirmAuditorias}
            onClose={() => setShowConfirmAuditorias(false)}
            onConfirm={handleForceDeleteAuditoria}
            loading={loadingAuditorias}
            title="Eliminar Permanentemente"
            message={`Estás a punto de eliminar definitivamente ${selectedAuditoriaIds.length} auditoría(s).\nYa NO podrán recuperarse.\n\n¿Deseas continuar?`}
          />
        </>
      )}
    </div>
  );
};
