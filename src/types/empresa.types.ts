export interface Empresa {
    id: number;
    nombre: string;
    rut: string;
    razon_social: string;
    direccion: string;
    telefono: string;
    email: string;
    estado: 'activa' | 'inactiva' | 'revision';
    created_at: string;
    updated_at: string;
}

export interface EmpresaStats {
    total: number;
    activas: number;
    enRevision: number;
    inactivas: number;
}

export interface EmpresaFormData {
    nombre: string;
    rut: string;
    razon_social: string;
    direccion: string;
    telefono: string;
    email: string;
}
