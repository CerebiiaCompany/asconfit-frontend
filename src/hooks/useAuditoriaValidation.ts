import { Categoria } from "../types/auditoria.types";

interface ValidationResult {
  isValid: boolean;
  message: string;
}

export const useAuditoriaValidation = () => {
  const validateForm = (
    formData: any,
    categorias: Categoria[]
  ): ValidationResult => {
    // Validar campos de empresa
    const camposEmpresaRequeridos = [
      { campo: "empresa", nombre: "Empresa" },
      { campo: "nit", nombre: "NIT" },
      { campo: "razonSocial", nombre: "Razón Social" },
      { campo: "direccion", nombre: "Dirección" },
      { campo: "responsable", nombre: "Responsable o Representante Legal" },
      { campo: "actividadEconomica", nombre: "Actividad Económica" },
      { campo: "contacto", nombre: "Contacto" },
    ];

    for (const { campo, nombre } of camposEmpresaRequeridos) {
      const valor = formData[campo as keyof typeof formData];
      if (!valor || (typeof valor === "string" && valor.trim() === "")) {
        return {
          isValid: false,
          message: `El campo "${nombre}" es obligatorio`,
        };
      }
    }

    // Validar que se haya seleccionado un delegado
    if (!formData.delegadoId) {
      return {
        isValid: false,
        message: "Debe seleccionar un delegado responsable",
      };
    }

    // Validar que haya al menos una categoría
    if (categorias.length === 0 || !categorias[0].nombre) {
      return {
        isValid: false,
        message: "Debe agregar al menos una categoría",
      };
    }

    // Validar cada categoría y sus subtareas
    for (let i = 0; i < categorias.length; i++) {
      const categoria = categorias[i];

      if (!categoria.nombre || categoria.nombre.trim() === "") {
        return {
          isValid: false,
          message: `La categoría ${i + 1} debe tener un nombre`,
        };
      }

      // Validar que tenga al menos una subtarea
      if (!categoria.subtareas || categoria.subtareas.length === 0) {
        return {
          isValid: false,
          message: `La categoría "${categoria.nombre}" debe tener al menos un requerimiento`,
        };
      }

      // Validar cada subtarea
      for (let j = 0; j < categoria.subtareas.length; j++) {
        const subtarea = categoria.subtareas[j];
        const subtareaNum = j + 1;

        if (!subtarea.nombre || subtarea.nombre.trim() === "") {
          return {
            isValid: false,
            message: `El requerimiento ${subtareaNum} de "${categoria.nombre}" debe tener un nombre`,
          };
        }

        if (!subtarea.prioridad) {
          return {
            isValid: false,
            message: `El requerimiento "${subtarea.nombre}" debe tener una prioridad`,
          };
        }

        if (!subtarea.fechaSolicitud) {
          return {
            isValid: false,
            message: `El requerimiento "${subtarea.nombre}" debe tener una fecha de solicitud`,
          };
        }

        if (!subtarea.tiempoEntrega || subtarea.tiempoEntrega.trim() === "") {
          return {
            isValid: false,
            message: `El requerimiento "${subtarea.nombre}" debe tener un tiempo de entrega`,
          };
        }

        if (!subtarea.estadoInformacion) {
          return {
            isValid: false,
            message: `El requerimiento "${subtarea.nombre}" debe tener un estado de información`,
          };
        }

        if (!subtarea.formatoArchivo) {
          return {
            isValid: false,
            message: `El requerimiento "${subtarea.nombre}" debe tener un formato de archivo`,
          };
        }
      }
    }

    return { isValid: true, message: "" };
  };

  return { validateForm };
};
