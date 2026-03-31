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
    nombre: string;
    is_default: boolean;
    created_at?: string;
}

export interface Documento {
    id: number;
    carpeta_id: number;
    nombre_original: string;
    ruta_archivo: string;
    extension: string;
    tamano: number;
    url: string;
    created_at?: string;
}

export const documentoService = {
    // Carpetas
    getCarpetasByEmpresa: async (empresaId: number): Promise<Carpeta[]> => {
        const response = await axios.get(`${API_URL}/empresas/${empresaId}/carpetas`, getAuthHeaders());
        return response.data;
    },
    
    createCarpeta: async (empresaId: number, nombre: string): Promise<Carpeta> => {
        const response = await axios.post(`${API_URL}/carpetas`, { empresa_id: empresaId, nombre }, getAuthHeaders());
        return response.data.carpeta;
    },
    
    deleteCarpeta: async (carpetaId: number): Promise<void> => {
        await axios.delete(`${API_URL}/carpetas/${carpetaId}`, getAuthHeaders());
    },

    // Documentos
    getDocumentosByCarpeta: async (carpetaId: number): Promise<Documento[]> => {
        const response = await axios.get(`${API_URL}/carpetas/${carpetaId}/documentos`, getAuthHeaders());
        return response.data.map((doc: Documento) => ({
            ...doc,
            url: BASE_URL + doc.url
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
            url: BASE_URL + doc.url
        };
    },

    deleteDocumento: async (documentoId: number): Promise<void> => {
        await axios.delete(`${API_URL}/documentos/${documentoId}`, getAuthHeaders());
    }
};
