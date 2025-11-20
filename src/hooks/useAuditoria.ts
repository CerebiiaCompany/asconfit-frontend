import { useState, useEffect } from "react";
import { auditoriaService } from "../services/auditoriaService";
import { Auditoria, ModalState } from "../types/tarea.types";

interface UseAuditoriaResult {
  auditoria: Auditoria | null;
  loading: boolean;
  modal: ModalState;
  setModal: React.Dispatch<React.SetStateAction<ModalState>>;
  handleFileUpload: (subtareaId: string, file: File) => Promise<void>;
  recargarAuditoria: () => Promise<void>;
}

export const useAuditoria = (
  auditoriaId: string | undefined
): UseAuditoriaResult => {
  const [auditoria, setAuditoria] = useState<Auditoria | null>(null);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
  });

  const cargarAuditoria = async () => {
    if (!auditoriaId) return;

    try {
      setLoading(true);
      const data = await auditoriaService.getAuditoria(auditoriaId);
      setAuditoria(data);
    } catch (error) {
      console.error("Error al cargar auditoría:", error);
      setModal({
        isOpen: true,
        type: "error",
        title: "Error",
        message: "No se pudo cargar la auditoría",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (subtareaId: string, file: File) => {
    try {
      // Convertir string a number para el servicio
      await auditoriaService.uploadFile(parseInt(subtareaId, 10), file);

      setModal({
        isOpen: true,
        type: "success",
        title: "¡Éxito!",
        message: "Archivo subido correctamente",
      });

      // Recargar la auditoría para mostrar el archivo actualizado
      await cargarAuditoria();
    } catch (error) {
      console.error("Error al subir archivo:", error);
      setModal({
        isOpen: true,
        type: "error",
        title: "Error",
        message: "No se pudo subir el archivo",
      });
    }
  };

  useEffect(() => {
    cargarAuditoria();
  }, [auditoriaId]);

  return {
    auditoria,
    loading,
    modal,
    setModal,
    handleFileUpload,
    recargarAuditoria: cargarAuditoria,
  };
};
