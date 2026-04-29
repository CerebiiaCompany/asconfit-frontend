import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";
const BASE_URL = API_URL.replace(/\/api\/?$/, '');

const getAuthHeaders = () => {
    const token = localStorage.getItem('auth_token');
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

export interface Carpeta {
    id: number;
    empresa_id: number;
    parent_id?: number | null;
    nombre: string;
    is_private: boolean;
    created_at?: string;
}

export interface Documento {
    id: number;
    carpeta_id: number;
    nombre_original: string;
    ruta_archivo: string;
    extension: string;
    tamano: number;
    url: string;        // URL del endpoint autenticado (para PDFs)
    storageUrl: string; // URL directa del storage (para imágenes)
    ruta_carpeta?: string;
    created_at?: string;
    deleted_at?: string;
    carpeta?: {
        id: number;
        nombre: string;
        parent?: {
            id: number;
            nombre: string;
        } | null;
        empresa?: {
            id: number;
            razon_social: string;
        }
    };
}

export const documentoService = {
    // Carpetas
    getCarpetasByEmpresa: async (empresaId: number): Promise<Carpeta[]> => {
        const response = await axios.get(`${API_URL}/empresas/${empresaId}/carpetas`, getAuthHeaders());
        return response.data;
    },

    createCarpeta: async (empresaId: number, nombre: string, parentId?: number): Promise<Carpeta> => {
        const response = await axios.post(`${API_URL}/carpetas`, { empresa_id: empresaId, nombre, parent_id: parentId ?? null }, getAuthHeaders());
        return response.data.carpeta;
    },

    deleteCarpeta: async (carpetaId: number): Promise<void> => {
        await axios.delete(`${API_URL}/carpetas/${carpetaId}`, getAuthHeaders());
    },

    toggleCarpetaPrivate: async (carpetaId: number): Promise<{ is_private: boolean }> => {
        const response = await axios.patch(`${API_URL}/carpetas/${carpetaId}/toggle-private`, {}, getAuthHeaders());
        return response.data;
    },

    getSubcarpetas: async (carpetaId: number): Promise<Carpeta[]> => {
        const response = await axios.get(`${API_URL}/carpetas/${carpetaId}/subcarpetas`, getAuthHeaders());
        return response.data;
    },

    renameCarpeta: async (carpetaId: number, nombre: string): Promise<Carpeta> => {
        const response = await axios.patch(`${API_URL}/carpetas/${carpetaId}/rename`, { nombre }, getAuthHeaders());
        return response.data.carpeta;
    },

    // Documentos
    getDocumentosByCarpeta: async (carpetaId: number): Promise<Documento[]> => {
        const response = await axios.get(`${API_URL}/carpetas/${carpetaId}/documentos`, getAuthHeaders());
        return response.data.map((doc: Documento) => ({
            ...doc,
            url: `${API_URL}/documentos/${doc.id}/file`,
            storageUrl: BASE_URL + '/storage/' + doc.ruta_archivo,
        }));
    },

    uploadDocumento: async (carpetaId: number, file: File): Promise<Documento> => {
        const formData = new FormData();
        formData.append('carpeta_id', carpetaId.toString());
        formData.append('archivo', file);

        const response = await axios.post(`${API_URL}/documentos`, formData, {
            headers: {
                ...getAuthHeaders().headers,
                'Content-Type': 'multipart/form-data',
            }
        });

        const doc = response.data.documento;
        return {
            ...doc,
            url: `${API_URL}/documentos/${doc.id}/file`,
            storageUrl: BASE_URL + '/storage/' + doc.ruta_archivo,
        };
    },

    deleteDocumento: async (documentoId: number): Promise<void> => {
        await axios.delete(`${API_URL}/documentos/${documentoId}`, getAuthHeaders());
    },

    // Papelera
    getTrashedDocumentos: async (): Promise<Documento[]> => {
        const response = await axios.get(`${API_URL}/papelera/documentos`, getAuthHeaders());
        return response.data.map((doc: Documento) => ({
            ...doc,
            url: `${API_URL}/documentos/${doc.id}/file`,
            storageUrl: BASE_URL + '/storage/' + doc.ruta_archivo,
        }));
    },

    restoreDocumentos: async (ids: number[]): Promise<void> => {
        await axios.post(`${API_URL}/papelera/restaurar`, { ids }, getAuthHeaders());
    },

    forceDeleteDocumentos: async (ids: number[]): Promise<void> => {
        await axios.post(`${API_URL}/papelera/destruir`, { ids }, getAuthHeaders());
    }
};
