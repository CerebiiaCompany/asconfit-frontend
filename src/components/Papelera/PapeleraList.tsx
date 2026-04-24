import React, { useState } from 'react';
import { usePapelera } from '../../hooks/usePapelera';
import { DeleteConfirmModal } from '../common/DeleteConfirmModal';
import { PapeleraToolbar } from './PapeleraToolbar';
import { PapeleraTable } from './PapeleraTable';
import { PapeleraCards } from './PapeleraCards';

export const PapeleraList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const {
    documentos, loading, selectedIds, showConfirm, setShowConfirm,
    handleSelectAll, handleSelect, handleRestore, handleForceDelete,
  } = usePapelera();

  const filteredDocs = documentos.filter(doc =>
    (doc.nombre_original || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (doc.carpeta?.empresa?.razon_social || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (doc.carpeta?.nombre || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-8 mt-6">
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
    </div>
  );
};
