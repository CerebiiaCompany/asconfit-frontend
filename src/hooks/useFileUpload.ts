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

  const getAcceptedFileTypes = (formatoArchivo: string | null): string => {
    if (!formatoArchivo) return "*";

    const formatos: Record<string, string> = {
      pdf: ".pdf",
      excel: ".xlsx,.xls,.csv,.xlsm,.xlsb,.xltx,.xltm",
      word: ".doc,.docx,.docm,.dotx,.dotm,.odt",
    };
    return formatos[formatoArchivo.toLowerCase()] || "*";
  };

  const getExtensionesPermitidas = (
    formatoArchivo: string | null
  ): string[] => {
    if (!formatoArchivo) return [];

    const extensiones: Record<string, string[]> = {
      pdf: ["pdf"],
      excel: ["xlsx", "xls", "csv", "xlsm", "xlsb", "xltx", "xltm"],
      word: ["doc", "docx", "docm", "dotx", "dotm", "odt"],
    };
    return extensiones[formatoArchivo.toLowerCase()] || [];
  };

  const validateFile = (
    file: File,
    formatoArchivo: string | null
  ): { valid: boolean; error?: string } => {
    if (!formatoArchivo) return { valid: true };

    const extension = file.name.split(".").pop()?.toLowerCase();
    const formatosPermitidos = getExtensionesPermitidas(formatoArchivo);

    if (
      extension &&
      formatosPermitidos.length > 0 &&
      !formatosPermitidos.includes(extension)
    ) {
      return {
        valid: false,
        error: `El archivo debe ser de tipo: ${formatosPermitidos.join(", ")}`,
      };
    }

    return { valid: true };
  };

  const uploadFile = async (
    subtareaId: number,
    file: File,
    formatoArchivo: string | null,
    carpetaId?: number | null
  ) => {
    const validation = validateFile(file, formatoArchivo);

    if (!validation.valid) {
      options?.onError?.(validation.error!);
      return { success: false, error: validation.error };
    }

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

    // Obtener el formato desde el input accept attribute o desde el data attribute
    const formatoArchivo = event.target.getAttribute("data-formato") || null;
    await uploadFile(subtareaId, file, formatoArchivo);
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
    getExtensionesPermitidas,
    handleFileSelect,
    handleFileChange,
    handleOpenFile,
  };
};
