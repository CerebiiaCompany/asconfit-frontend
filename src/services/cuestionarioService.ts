import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const getAuthHeader = () => {
    const token = localStorage.getItem('auth_token');
    return { Authorization: `Bearer ${token}` };
};

export interface EvidenciaPregunta {
    id: number;
    nombre: string;
    tamano: number | null;
    user_id: number | null;
    user?: { id: number; name: string } | null;
    created_at: string;
}

/** Enlace estable a una evidencia dentro de la app (pide iniciar sesión; se usa en el Excel). */
export const evidenciaAppUrl = (archivoId: number) =>
    `${window.location.origin}/evidencias/cuestionario/${archivoId}`;

export const cuestionarioService = {
    getCuestionarios: async () => {
        const res = await axios.get(`${API_URL}/cuestionarios`, { headers: getAuthHeader() });
        return res.data;
    },

    getCuestionario: async (cuestionarioId: number, auditoriaId: string) => {
        const res = await axios.get(
            `${API_URL}/cuestionarios/${cuestionarioId}/auditoria/${auditoriaId}`,
            { headers: getAuthHeader() }
        );
        return res.data;
    },

    saveRespuestas: async (cuestionarioId: number, auditoriaId: string, respuestas: any[]) => {
        const res = await axios.post(
            `${API_URL}/cuestionarios/${cuestionarioId}/auditoria/${auditoriaId}/respuestas`,
            { respuestas },
            { headers: getAuthHeader() }
        );
        return res.data;
    },

    /** Sube uno o varios archivos de evidencia a una pregunta (opcional). */
    subirArchivos: async (cuestionarioId: number, auditoriaId: string, preguntaId: number, files: File[]) => {
        const form = new FormData();
        files.forEach((f) => form.append('archivos[]', f));
        const res = await axios.post<{ message: string; archivos: EvidenciaPregunta[] }>(
            `${API_URL}/cuestionarios/${cuestionarioId}/auditoria/${auditoriaId}/preguntas/${preguntaId}/archivos`,
            form,
            { headers: getAuthHeader(), timeout: 300000 }
        );
        return res.data;
    },

    eliminarArchivo: async (archivoId: number) => {
        const res = await axios.delete(`${API_URL}/cuestionario-archivos/${archivoId}`, { headers: getAuthHeader() });
        return res.data;
    },

    getArchivoInfo: async (archivoId: number) => {
        const res = await axios.get<{ id: number; nombre: string; auditoria_id: number; cuestionario_id: number; pregunta: string | null }>(
            `${API_URL}/cuestionario-archivos/${archivoId}`,
            { headers: getAuthHeader() }
        );
        return res.data;
    },

    /** Descarga la evidencia con la sesión del usuario y devuelve una URL local (blob) para abrirla. */
    getArchivoBlobUrl: async (archivoId: number) => {
        const res = await axios.get(`${API_URL}/cuestionario-archivos/${archivoId}/ver`, {
            headers: getAuthHeader(),
            responseType: 'blob',
        });
        return URL.createObjectURL(res.data);
    },

    exportar: async (cuestionarioId: number, auditoriaId: string) => {
        const res = await axios.get(
            `${API_URL}/cuestionarios/${cuestionarioId}/auditoria/${auditoriaId}/exportar`,
            { headers: getAuthHeader() }
        );
        return res.data;
    },
};
