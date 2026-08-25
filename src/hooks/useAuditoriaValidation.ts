import { Categoria } from "../types/auditoria.types";

export interface AuditoriaErrors {
  // EmpresaSection
  empresa?: string;
  nit?: string;
  razonSocial?: string;
  direccion?: string;
  responsable?: string;
  actividadEconomica?: string;
  contacto?: string;
  // TipoAuditoriaSection
  tipoAuditoria?: string;
  // FechasSection
  fechaInicial?: string;
  fechaCorte?: string;
  // DelegadosSection
  delegado0?: string;
  // CategoriasSection — errores de categorías/subtareas (se muestran en modal)
  categorias?: string;
  // Errores dinámicos para subtareas (formato: categoriaId_subtareaId_campo)
  [key: string]: string | undefined;
}

interface ValidationResult {
  isValid: boolean;
  errors: AuditoriaErrors;
  /** Mensaje corto para el modal cuando el error es de categoría/subtarea */
  modalMessage?: string;
}

export const useAuditoriaValidation = () => {
  const validateForm = (
    formData: any,
    categorias: Categoria[],
    delegados: Array<number | null>,
  ): ValidationResult => {
    const errors: AuditoriaErrors = {};

    // ── Campos de empresa (se llenan seleccionando empresa) ───────────────────
    if (!formData.empresa?.trim()) errors.empresa = "Campo obligatorio";
    if (!formData.nit?.trim()) errors.nit = "Campo obligatorio";
    if (!formData.razonSocial?.trim()) errors.razonSocial = "Campo obligatorio";
    if (!formData.direccion?.trim()) errors.direccion = "Campo obligatorio";
    if (!formData.responsable?.trim()) errors.responsable = "Campo obligatorio";
    if (!formData.actividadEconomica?.trim()) errors.actividadEconomica = "Campo obligatorio";
    if (!formData.contacto?.trim()) errors.contacto = "Campo obligatorio";

    // ── Tipo de auditoría ─────────────────────────────────────────────────────
    if (!formData.tipoAuditoria?.trim()) errors.tipoAuditoria = "Campo obligatorio";

    // ── Fechas ────────────────────────────────────────────────────────────────
    if (!formData.fechaInicial) errors.fechaInicial = "Selecciona una fecha";
    if (!formData.fechaCorte) errors.fechaCorte = "Selecciona una fecha";

    // ── Delegados ─────────────────────────────────────────────────────────────
    const selectedDelegados = delegados.filter((id) => id !== null) as number[];
    if (selectedDelegados.length === 0) {
      errors.delegado0 = "Selecciona al menos un delegado";
    } else if (new Set(selectedDelegados).size !== selectedDelegados.length) {
      errors.delegado0 = "Los delegados deben ser diferentes";
    }

    // ── Categorías (sólo si se agregaron) ─────────────────────────────────────
    if (categorias.length > 0) {
      for (let i = 0; i < categorias.length; i++) {
        const categoria = categorias[i];

        if (!categoria.nombre?.trim()) {
          errors[`${categoria.id}_nombre`] = "Campo obligatorio";
        }

        if (!categoria.delegadoId) {
          errors[`${categoria.id}_delegadoId`] = "Campo obligatorio";
        }

        for (let j = 0; j < categoria.subtareas.length; j++) {
          const sub = categoria.subtareas[j];
          const n = j + 1;
          const subKey = `${categoria.id}_${sub.id}`;

          if (!sub.nombre?.trim()) {
            errors[`${subKey}_nombre`] = "Campo obligatorio";
          }
          if (!sub.prioridad) {
            errors[`${subKey}_prioridad`] = "Campo obligatorio";
          }
          if (!sub.fechaSolicitud) {
            errors[`${subKey}_fechaSolicitud`] = "Campo obligatorio";
          }
          if (!sub.tiempoEntrega?.trim()) {
            errors[`${subKey}_tiempoEntrega`] = "Campo obligatorio";
          }
          if (!sub.formatoArchivo) {
            errors[`${subKey}_formatoArchivo`] = "Campo obligatorio";
          }
        }
      }
    }

    const hasFieldErrors = Object.keys(errors).length > 0;
    return {
      isValid: !hasFieldErrors,
      errors,
      modalMessage: hasFieldErrors
        ? "Hay campos incompletos. Por favor completa todos los campos marcados en rojo."
        : undefined,
    };
  };

  return { validateForm };
};
