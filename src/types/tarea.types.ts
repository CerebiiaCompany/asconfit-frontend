export interface Subtarea {
  id: string;
  nombre: string;
  formato_archivo?: string;
  observaciones?: string;
  archivo_nombre?: string;
  prioridad?: string;
  fecha_solicitud?: string;
  tiempo_entrega?: string;
  estado_informacion?: string;
}

export interface Categoria {
  id: string;
  nombre: string;
  subtareas: Subtarea[];
}

export interface Auditoria {
  id: string;
  empresa: string;
  nit: string;
  razon_social: string;
  responsable: string;
  contacto: string;
  actividad_economica?: string;
  direccion?: string;
  pt?: string;
  fecha_inicial?: string;
  fecha_corte?: string;
  categorias: Categoria[];
}

export interface ModalState {
  isOpen: boolean;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
}
