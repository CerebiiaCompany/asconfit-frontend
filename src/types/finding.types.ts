import { Auditoria } from "./auditoria";

export interface Finding {
    titulo: string;
    descripcion: string;
    actividad_id: number | null;
    severidad: "critico" | "grave" | "leve" | "";
    responsable: string;
    fecha_limite: string;
}

export interface CrearFindingModalProps {
    auditoria: Auditoria;
    onClose: () => void;
    onSave?: (findings: Finding[]) => void;
}

export const SEVERIDAD_CONFIG = {
    critico: { label: "Crítico", color: "bg-red-500", ring: "ring-red-500", text: "text-red-600" },
    grave:   { label: "Grave",   color: "bg-yellow-400", ring: "ring-yellow-400", text: "text-yellow-600" },
    leve:    { label: "Leve",    color: "bg-green-500", ring: "ring-green-500", text: "text-green-600" },
} as const;

export const emptyFinding = (): Finding => ({
    titulo: "",
    descripcion: "",
    actividad_id: null,
    severidad: "",
    responsable: "",
    fecha_limite: "",
});
