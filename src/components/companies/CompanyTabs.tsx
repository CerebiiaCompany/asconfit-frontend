import React, { useEffect, useState, useRef } from "react";
import { Plus, Lock, FolderPlus, X } from "lucide-react";
import { documentoService, Carpeta } from "../../services/documentoService";
import { useToast } from "../../contexts/ToastContext";

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
  const inputRef = useRef<HTMLInputElement>(null);
  const { addToast } = useToast();

  useEffect(() => { loadCarpetas(); }, [empresaId]);

  useEffect(() => {
    if (activeCarpetaData) {
      setCarpetas(prev =>
        prev.map(c => c.id === activeCarpetaData.id ? { ...c, is_private: activeCarpetaData.is_private } : c)
      );
    }
  }, [activeCarpetaData?.is_private]);

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

  return (
    <>
      <div className="flex gap-2 mb-2 overflow-x-auto pb-1 custom-scrollbar">
        {carpetas.map((carpeta) => {
          const isActive = carpeta.id === activeCarpetaId;
          return (
            <button
              key={carpeta.id}
              onClick={() => setActiveCarpeta(carpeta)}
              className={`px-8 py-2.5 rounded text-sm font-bold shadow-sm transition-colors whitespace-nowrap flex items-center gap-2 ${isActive
                  ? "bg-orange-500 hover:bg-orange-600 text-white border border-orange-500"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
            >
              {carpeta.nombre}
              {carpeta.is_private && <Lock className="w-3 h-3 opacity-80" />}
            </button>
          );
        })}

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
    </>
  );
};
