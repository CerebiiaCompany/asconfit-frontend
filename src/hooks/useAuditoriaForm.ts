import { useState } from "react";
import {
  AuditoriaFormData,
  Categoria,
  Subtarea,
} from "../types/auditoria.types";

const initialFormData: AuditoriaFormData = {
  empresa: "",
  nit: "",
  razonSocial: "",
  actividadEconomica: "",
  direccion: "",
  responsable: "",
  contacto: "",
  pt: "",
  tipoAuditoria: "",
  fechaInicial: "",
  fechaCorte: "",
  empresaId: null,
};

export const useAuditoriaForm = () => {
  const [formData, setFormData] = useState<AuditoriaFormData>(initialFormData);
  const [categorias, setCategorias] = useState<Categoria[]>([
    { id: "1", nombre: "", delegadoId: null, subtareas: [] },
  ]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddCategoria = () => {
    setCategorias((prev) => [
      ...prev,
      { id: Date.now().toString(), nombre: "", delegadoId: null, subtareas: [] },
    ]);
  };

  const handleRemoveCategoria = (id: string) => {
    setCategorias((prev) => prev.filter((cat) => cat.id !== id));
  };

  const handleCategoriaChange = (id: string, field: keyof Categoria, value: any) => {
    setCategorias((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, [field]: value } : cat))
    );
  };

  const handleAddSubtarea = (categoriaId: string) => {
    setCategorias((prev) =>
      prev.map((cat) => {
        if (cat.id === categoriaId) {
          const newSubtarea: Subtarea = {
            id: Date.now().toString(),
            nombre: "",
            prioridad: "",
            fechaSolicitud: "",
            tiempoEntrega: "",
            observaciones: "",
            estadoInformacion: "pendiente",
            archivoNombre: "",
            formatoArchivo: "",
          };
          return { ...cat, subtareas: [...cat.subtareas, newSubtarea] };
        }
        return cat;
      })
    );
  };

  const handleRemoveSubtarea = (categoriaId: string, subtareaId: string) => {
    setCategorias((prev) =>
      prev.map((cat) => {
        if (cat.id === categoriaId) {
          return {
            ...cat,
            subtareas: cat.subtareas.filter((st) => st.id !== subtareaId),
          };
        }
        return cat;
      })
    );
  };

  const handleSubtareaChange = (
    categoriaId: string,
    subtareaId: string,
    field: keyof Subtarea,
    value: string
  ) => {
    setCategorias((prev) =>
      prev.map((cat) => {
        if (cat.id === categoriaId) {
          return {
            ...cat,
            subtareas: cat.subtareas.map((st) =>
              st.id === subtareaId ? { ...st, [field]: value } : st
            ),
          };
        }
        return cat;
      })
    );
  };

  const handleLoadPlantilla = async (
    categoriaId: string,
    codigoONombre: string
  ) => {
    try {
      const { plantillaService } = await import("../services/plantillaService");
      const plantilla = await plantillaService.getPlantilla(codigoONombre);

      setCategorias((prev) =>
        prev.map((cat) => {
          if (cat.id === categoriaId) {
            const subtareas: Subtarea[] = plantilla.requerimientos.map(
              (req: any, index: number) => ({
                id: `${Date.now()}-${index}`,
                nombre: req.nombre,
                prioridad: "",
                fechaSolicitud: "",
                tiempoEntrega: "",
                observaciones: "",
                estadoInformacion: "pendiente",
                archivoNombre: "",
                formatoArchivo: req.formato_archivo || "",
              })
            );
            return { ...cat, subtareas, delegadoId: cat.delegadoId };
          }
          return cat;
        })
      );
    } catch (error) {
      console.error("Error al cargar plantilla:", error);
    }
  };

  return {
    formData,
    setFormData,
    categorias,
    handleInputChange,
    handleAddCategoria,
    handleRemoveCategoria,
    handleCategoriaChange,
    handleAddSubtarea,
    handleRemoveSubtarea,
    handleSubtareaChange,
    handleLoadPlantilla,
  };
};
