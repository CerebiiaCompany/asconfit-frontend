import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const getAuthHeader = () => {
    const token = localStorage.getItem('auth_token');
    return { Authorization: `Bearer ${token}` };
};

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

    exportar: async (cuestionarioId: number, auditoriaId: string) => {
        const res = await axios.get(
            `${API_URL}/cuestionarios/${cuestionarioId}/auditoria/${auditoriaId}/exportar`,
            { headers: getAuthHeader() }
        );
        return res.data;
    },
};
