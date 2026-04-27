import React, { useState, useEffect } from 'react';
import { usePapelera } from '../../hooks/usePapelera';
import { auditoriaService } from '../../services/auditoriaService';
import { DeleteConfirmModal } from '../common/DeleteConfirmModal';
import { PapeleraToolbar } from './PapeleraToolbar';
import { PapeleraTable } from './PapeleraTable';
import { PapeleraCards } from './PapeleraCards';

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
}

export const PapeleraList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [auditorias, setAuditorias] = useState<AuditoriaTrashed[]>([]);
  const [loadingAuditorias, setLoadingAuditorias] = useState(false);
  const [selectedAuditoriaIds, setSelectedAuditoriaIds] = useState<number[]>([]);
  const [showConfirmAuditorias, setShowConfirmAuditorias] = useState(false);
  const [activeTab, setActiveTab] = useState<'documentos' | 'auditorias'>('documentos');

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
      alert('Auditorías restauradas exitosamente');
    } catch (error) {
      console.error('Error al restaurar auditorías:', error);
      alert('Error al restaurar auditorías');
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
      alert('Auditorías eliminadas permanentemente');
    } catch (error) {
      console.error('Error al eliminar auditorías:', error);
      alert('Error al eliminar auditorías');
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
          <PapeleraToolbar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedCount={selectedIds.length}
            loading={loading}
            onDestruir={() => setShowConfirm(true)}
            onRestaurar={handleRestore}
          />

          <PapeleraTable
            docs={filteredDocs}
            loading={loading}
            selectedIds={selectedIds}
            onSelectAll={checked => handleSelectAll(checked, filteredDocs)}
            onSelect={handleSelect}
          />

          <PapeleraCards
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
          <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <input
              type="text"
              placeholder="Buscar auditorías..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <div className="flex gap-2">
              <button
                onClick={handleRestoreAuditoria}
                disabled={selectedAuditoriaIds.length === 0 || loadingAuditorias}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Restaurar ({selectedAuditoriaIds.length})
              </button>
              <button
                onClick={() => setShowConfirmAuditorias(true)}
                disabled={selectedAuditoriaIds.length === 0 || loadingAuditorias}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Eliminar permanentemente
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
            <div className="py-12 text-center">
              <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <p className="text-gray-500">No hay auditorías en la papelera</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAuditorias.map((auditoria) => (
                <div key={auditoria.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start gap-4">
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
                      className="mt-1 w-5 h-5 text-orange-500 focus:ring-orange-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {auditoria.empresa?.razon_social || 'Sin empresa'}
                          </h3>
                          <p className="text-sm text-gray-500">NIT: {auditoria.empresa?.nit || '-'}</p>
                          <p className="text-sm text-gray-500">
                            Fecha: {auditoria.fecha_inicial ? new Date(auditoria.fecha_inicial).toLocaleDateString() : '-'}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`inline-block px-2 py-1 text-xs rounded ${getDaysRemaining(auditoria.deleted_at) > 15
                            ? 'bg-green-100 text-green-800'
                            : getDaysRemaining(auditoria.deleted_at) > 7
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                            }`}>
                            {getDaysRemaining(auditoria.deleted_at)} días restantes
                          </span>
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
