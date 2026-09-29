import { useState, useRef } from "react";
import { auditoriaService } from "../services/auditoriaService";

interface UseFileUploadOptions {
  onSuccess?: (fileName: string) => void;
  onError?: (message: string) => void;
}

export const useFileUpload = (options?: UseFileUploadOptions) => {
  const [uploading, setUploading] = useState(false);
  const [uploadingSubtareaId, setUploadingSubtareaId] = useState<number | null>(
    null
  );
  const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});

  // Se permite subir archivos de cualquier formato, sin restricción por tipo.
  const getAcceptedFileTypes = (_formatoArchivo?: string | null): string => {
    return "*";
  };

  const uploadFile = async (
    subtareaId: number,
    file: File,
    _formatoArchivo?: string | null,
    carpetaId?: number | null
  ) => {
    try {
      setUploading(true);
      setUploadingSubtareaId(subtareaId);
      await auditoriaService.uploadFile(subtareaId, file, carpetaId);
      options?.onSuccess?.(file.name);
      return { success: true };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "No se pudo subir el archivo";
      options?.onError?.(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setUploading(false);
      setUploadingSubtareaId(null);
    }
  };

  const handleFileSelect = (subtareaId: number) => {
    fileInputRefs.current[subtareaId]?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    subtareaId: number
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    await uploadFile(subtareaId, file);
  };

  const handleOpenFile = async (subtareaId: number, fileName: string) => {
    try {
      const baseUrl =
        process.env.REACT_APP_API_URL || "http://localhost:8000/api";
      const token = localStorage.getItem("auth_token");

      // Usar la ruta de descarga que incluye autenticación
      const response = await fetch(
        `${baseUrl}/auditorias/subtareas/${subtareaId}/download`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("No se pudo cargar el archivo");
      }

      // Crear un blob del archivo y abrirlo en una nueva pestaña
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");

      // Liberar el objeto URL después de un tiempo
      setTimeout(() => window.URL.revokeObjectURL(url), 100);
    } catch (error) {
      console.error("Error al abrir archivo:", error);
      options?.onError?.("No se pudo abrir el archivo");
    }
  };

  return {
    uploadFile,
    uploading,
    uploadingSubtareaId,
    fileInputRefs,
    getAcceptedFileTypes,
    handleFileSelect,
    handleFileChange,
    handleOpenFile,
  };
};
