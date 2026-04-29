import React, { useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";
import { Plus, Lock, FolderPlus, X, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { documentoService, Carpeta } from "../../services/documentoService";
import { useToast } from "../../contexts/ToastContext";
import { DeleteConfirmModal } from "../common/DeleteConfirmModal";

interface CompanyTabsProps {
  empresaId: number;
  activeCarpetaId: number | null;
  setActiveCarpeta: (carpeta: Carpeta) => void;
  onNoCarpetas?: () => void;
  isAdmin: boolean;
  activeCarpetaData?: Carpeta | null;
}

export const CompanyTabs: React.FC<CompanyTabsProps> = ({
  empresaId, activeCarpetaId, setActiveCarpeta, onNoCarpetas, isAdmin, activeCarpetaData,
}) => {
  const [carpetas, setCarpetas] = useState<Carpeta[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [nombre, setNombre] = useState("");
  const [creating, setCreating] = useState(false);
  const [tabMenu, setTabMenu] = useState<number | null>(null);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const [renameModal, setRenameModal] = useState<{ id: number; nombre: string } | null>(null);
  const [deleteModal, setDeleteModal] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { addToast } = useToast();

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    if (!tabMenu) return;
    const close = () => setTabMenu(null);
    // setTimeout para evitar que el mismo clic que abre el menú lo cierre inmediatamente
    const timer = setTimeout(() => {
      document.addEventListener('click', close);
    }, 0);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', close);
    };
  }, [tabMenu]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { loadCarpetas(); }, [empresaId]);

  useEffect(() => {
    if (activeCarpetaData) {
      setCarpetas(prev =>
        prev.map(c => c.id === activeCarpetaData.id ? { ...c, is_private: activeCarpetaData.is_private } : c)
      );
    }
  }, [activeCarpetaData]);

  // Focus input when modal opens
  useEffect(() => {
    if (showModal) setTimeout(() => inputRef.current?.focus(), 50);
  }, [showModal]);

  const loadCarpetas = async () => {
    try {
      const data = await documentoService.getCarpetasByEmpresa(empresaId);
      setCarpetas(data);
      if (data.length > 0) setActiveCarpeta(data[0]);
      else onNoCarpetas?.();
    } catch (error) {
      console.error(error);
      addToast("Error al cargar las carpetas", "error");
    }
  };

  const handleConfirm = async () => {
    if (!nombre.trim()) return;
    try {
      setCreating(true);
      const newCarpeta = await documentoService.createCarpeta(empresaId, nombre.trim());
      setCarpetas(prev => [...prev, newCarpeta]);
      setActiveCarpeta(newCarpeta);
      addToast("Carpeta creada", "success");
      setShowModal(false);
      setNombre("");
    } catch (error) {
      console.error(error);
      addToast("Error al crear la carpeta. Es posible que el nombre ya exista.", "error");
    } finally {
      setCreating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleConfirm();
    if (e.key === "Escape") { setShowModal(false); setNombre(""); }
  };

  const handleRename = async () => {
    if (!renameModal?.nombre.trim()) return;
    try {
      const updated = await documentoService.renameCarpeta(renameModal.id, renameModal.nombre.trim());
      setCarpetas(prev => prev.map(c => c.id === updated.id ? { ...c, nombre: updated.nombre } : c));
      addToast("Carpeta renombrada", "success");
      setRenameModal(null);
    } catch {
      addToast("Error al renombrar la carpeta", "error");
    }
  };

  const handleDelete = async () => {
    if (!deleteModal) return;
    try {
      await documentoService.deleteCarpeta(deleteModal);
      const remaining = carpetas.filter(c => c.id !== deleteModal);
      setCarpetas(remaining);
      if (remaining.length > 0) setActiveCarpeta(remaining[0]);
      addToast("Carpeta eliminada y documentos movidos a papelera", "success");
      setDeleteModal(null);
    } catch {
      addToast("Error al eliminar la carpeta", "error");
    }
  };

  return (
    <>
      <div className="flex gap-2 mb-2 overflow-x-auto pb-1 custom-scrollbar" style={{ overflowY: 'visible' }}>
        {carpetas.map((carpeta) => {
          const isActive = carpeta.id === activeCarpetaId;
          return (
            <div key={carpeta.id} className="relative group/tab flex-shrink-0">
              <button
                onClick={() => setActiveCarpeta(carpeta)}
                className={`pr-2 pl-4 py-2.5 rounded text-sm font-bold shadow-sm transition-colors whitespace-nowrap flex items-center gap-1 ${isActive
                  ? "bg-orange-500 hover:bg-orange-600 text-white border border-orange-500"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
              >
                {carpeta.nombre}
                {carpeta.is_private && <Lock className="w-3 h-3 opacity-80" />}
                <span
                  role="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                    setMenuPos({ top: rect.bottom + 4, left: rect.left });
                    setTabMenu(tabMenu === carpeta.id ? null : carpeta.id);
                  }}
                  className={`ml-1 w-5 h-5 rounded flex items-center justify-center opacity-0 group-hover/tab:opacity-100 transition-opacity ${isActive ? 'hover:bg-orange-600' : 'hover:bg-gray-100'}`}
                >
                  <MoreVertical className="w-3.5 h-3.5" />
                </span>
              </button>
            </div>
          );
        })}

        {/* Dropdown via portal — siempre por encima de todo */}
        {tabMenu !== null && carpetas.find(c => c.id === tabMenu) && ReactDOM.createPortal(
          <div
            style={{ position: 'fixed', top: menuPos.top, left: menuPos.left, zIndex: 9999 }}
            className="bg-white border border-gray-200 rounded-lg shadow-xl min-w-[150px] py-1"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => { const c = carpetas.find(x => x.id === tabMenu)!; setRenameModal({ id: c.id, nombre: c.nombre }); setTabMenu(null); }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <Pencil className="w-4 h-4 text-gray-400" />
              Renombrar
            </button>
            <button
              onClick={() => { setDeleteModal(tabMenu); setTabMenu(null); }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
              Eliminar
            </button>
          </div>,
          document.body
        )}

        {(isAdmin || carpetas.length > 0) && (
          <button
            onClick={() => setShowModal(true)}
            title="Crear nueva carpeta"
            className="bg-white border border-orange-200 text-orange-400 px-4 py-2.5 rounded shadow-sm hover:bg-gray-50 transition-colors flex items-center justify-center flex-shrink-0"
          >
            <Plus className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => { setShowModal(false); setNombre(""); }}
          />

          {/* Card */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                  <FolderPlus className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-800">Nueva carpeta</h2>
                  <p className="text-xs text-gray-400">Ingresa el nombre de la carpeta</p>
                </div>
              </div>
              <button
                onClick={() => { setShowModal(false); setNombre(""); }}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Input */}
            <input
              ref={inputRef}
              type="text"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ej: Documentos contables"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 transition-all mb-5"
            />

            {/* Actions */}
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => { setShowModal(false); setNombre(""); }}
                className="px-5 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirm}
                disabled={!nombre.trim() || creating}
                className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {creating ? "Creando..." : "Crear carpeta"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal renombrar */}
      {renameModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setRenameModal(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-base font-bold text-gray-800 mb-4">Renombrar carpeta</h2>
            <input
              autoFocus
              type="text"
              value={renameModal.nombre}
              onChange={e => setRenameModal({ ...renameModal, nombre: e.target.value })}
              onKeyDown={e => { if (e.key === 'Enter') handleRename(); if (e.key === 'Escape') setRenameModal(null); }}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 mb-5"
            />
            <div className="flex gap-3 justify-end">
              <button onClick={() => setRenameModal(null)} className="px-5 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">
                Cancelar
              </button>
              <button
                onClick={handleRename}
                disabled={!renameModal.nombre.trim()}
                className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold disabled:opacity-50"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal eliminar */}
      <DeleteConfirmModal
        isOpen={deleteModal !== null}
        onClose={() => setDeleteModal(null)}
        onConfirm={handleDelete}
        loading={false}
      />
    </>
  );
};
