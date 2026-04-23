import React, { useEffect, useState } from "react";
import { Plus, Lock } from "lucide-react";
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

export const CompanyTabs: React.FC<CompanyTabsProps> = ({ empresaId, activeCarpetaId, setActiveCarpeta, onNoCarpetas, isAdmin, activeCarpetaData }) => {
  const [carpetas, setCarpetas] = useState<Carpeta[]>([]);
  const { addToast } = useToast();

  useEffect(() => {
    loadCarpetas();
  }, [empresaId]);

  // Sync is_private en la lista local cuando el padre actualiza la carpeta activa
  useEffect(() => {
    if (activeCarpetaData) {
      setCarpetas(prev => prev.map(c => c.id === activeCarpetaData.id ? { ...c, is_private: activeCarpetaData.is_private } : c));
    }
  }, [activeCarpetaData?.is_private]);

  const loadCarpetas = async () => {
    try {
      const data = await documentoService.getCarpetasByEmpresa(empresaId);
      setCarpetas(data);
      if (data.length > 0) {
        setActiveCarpeta(data[0]);
      } else {
        onNoCarpetas?.();
      }
    } catch (error) {
      console.error(error);
      addToast("Error al cargar las carpetas", "error");
    }
  };

  const handleCreateCarpeta = async () => {
    const nombre = window.prompt("Nombre de la nueva carpeta:");
    if (!nombre || nombre.trim() === "") return;

    try {
      const newCarpeta = await documentoService.createCarpeta(empresaId, nombre);
      setCarpetas(prev => [...prev, newCarpeta]);
      setActiveCarpeta(newCarpeta);
      addToast("Carpeta creada", "success");
    } catch (error) {
      console.error(error);
      addToast("Error al crear la carpeta. Es posible que el nombre ya exista.", "error");
    }
  };

  // Sync carpeta activa cuando cambia is_private desde el padre
  const handleSelectCarpeta = (carpeta: Carpeta) => {
    setActiveCarpeta(carpeta);
  };

  return (
    <div className="flex gap-2 mb-2 overflow-x-auto pb-1 custom-scrollbar">
      {carpetas.map((carpeta) => {
        const isActive = carpeta.id === activeCarpetaId;
        return (
          <button
            key={carpeta.id}
            onClick={() => handleSelectCarpeta(carpeta)}
            className={`px-8 py-2.5 rounded text-sm font-bold shadow-sm transition-colors whitespace-nowrap flex items-center gap-2 ${isActive
              ? 'bg-orange-500 hover:bg-orange-600 text-white border border-orange-500'
              : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
          >
            {carpeta.nombre}
            {carpeta.is_private && (
              <Lock className="w-3 h-3 opacity-80" />
            )}
          </button>
        );
      })}

      {(isAdmin || carpetas.length > 0) && (
        <button
          onClick={handleCreateCarpeta}
          title="Crear nueva carpeta"
          className="bg-white border border-orange-200 text-orange-400 px-4 py-2.5 rounded shadow-sm hover:bg-gray-50 transition-colors flex items-center justify-center flex-shrink-0"
        >
          <Plus className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};
