import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { documentoService, Carpeta } from "../../services/documentoService";
import { useToast } from "../../contexts/ToastContext";

interface EmpresaTabsProps {
  empresaId: number;
  activeCarpetaId: number | null;
  setActiveCarpetaId: (id: number) => void;
}

export const EmpresaTabs: React.FC<EmpresaTabsProps> = ({ empresaId, activeCarpetaId, setActiveCarpetaId }) => {
  const [carpetas, setCarpetas] = useState<Carpeta[]>([]);
  const { addToast } = useToast();

  useEffect(() => {
    loadCarpetas();
  }, [empresaId]);

  const loadCarpetas = async () => {
    try {
      const data = await documentoService.getCarpetasByEmpresa(empresaId);
      setCarpetas(data);
      // Auto-seleccionar la primera carpeta ("Papeles de trabajo") si no hay nada activo
      if (!activeCarpetaId && data.length > 0) {
        setActiveCarpetaId(data[0].id);
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
      setActiveCarpetaId(newCarpeta.id);
      addToast("Carpeta creada", "success");
    } catch (error) {
      console.error(error);
      addToast("Error al crear la carpeta. Es posible que el nombre ya exista.", "error");
    }
  };

  return (
    <div className="flex gap-2 mb-2 overflow-x-auto pb-1 custom-scrollbar">
      {carpetas.map((carpeta) => {
        const isActive = carpeta.id === activeCarpetaId;
        return (
          <button 
            key={carpeta.id}
            onClick={() => setActiveCarpetaId(carpeta.id)}
            className={`px-8 py-2.5 rounded text-sm font-bold shadow-sm transition-colors whitespace-nowrap ${
              isActive 
                ? 'bg-orange-500 hover:bg-orange-600 text-white border border-orange-500' 
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {carpeta.nombre}
          </button>
        );
      })}
      
      <button 
        onClick={handleCreateCarpeta}
        title="Crear nueva carpeta"
        className="bg-white border border-orange-200 text-orange-400 px-4 py-2.5 rounded shadow-sm hover:bg-gray-50 transition-colors flex items-center justify-center flex-shrink-0"
      >
        <Plus className="w-5 h-5" />
      </button>
    </div>
  );
};
