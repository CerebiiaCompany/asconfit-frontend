import { Categoria } from "../types/auditoria.types";

interface ValidationResult {
  isValid: boolean;
  message: string;
}

export const useAuditoriaValidation = () => {
  const validateForm = (
    formData: any,
    categorias: Categoria[],
    delegados: Array<number | null>
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

    const selectedDelegados = delegados.filter((id) => id !== null) as number[];
    if (selectedDelegados.length === 0) {
      return {
        isValid: false,
        message: "Debe seleccionar al menos un delegado",
      };
    }

    if (selectedDelegados.length > 2) {
      return {
        isValid: false,
        message: "Sólo puedes seleccionar hasta dos delegados",
      };
    }

    if (new Set(selectedDelegados).size !== selectedDelegados.length) {
      return {
        isValid: false,
        message: "Cada delegado debe ser único",
      };
    }

    // Validar cada categoría y sus subtareas sólo si se agregaron categorías
    if (categorias.length > 0) {
      for (let i = 0; i < categorias.length; i++) {
        const categoria = categorias[i];

        if (!categoria.nombre || categoria.nombre.trim() === "") {
          return {
            isValid: false,
            message: `La categoría ${i + 1} debe tener un nombre`,
          };
        }

        // Validar que se haya seleccionado un delegado para la categoría
        if (!categoria.delegadoId) {
          return {
            isValid: false,
            message: `Debe seleccionar un delegado responsable para la categoría "${categoria.nombre}"`,
          };
        }

        if (categoria.subtareas && categoria.subtareas.length > 0) {
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
      }
    }

    return { isValid: true, message: "" };
  };

  return { validateForm };
};
