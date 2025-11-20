import axios from 'axios';
import { NuevaAuditoriaData } from '../types/auditoria.types';

const API_URL = 'http://localhost:8000/api';

const getAuthHeader = () => {
    const token = localStorage.getItem('auth_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const auditoriaService = {
    async createAuditoria(data: NuevaAuditoriaData) {
        const response = await axios.post(
            `${API_URL}/auditorias`,
            data,
            { headers: getAuthHeader() }
        );
        return response.data;
    },

    async getAuditorias() {
        const response = await axios.get(
            `${API_URL}/auditorias`,
            { headers: getAuthHeader() }
        );
        return response.data;
    },

    async getAuditoria(id: string) {
        const response = await axios.get(
            `${API_URL}/auditorias/${id}`,
            { headers: getAuthHeader() }
        );
        return response.data;
    },

    async updateAuditoria(id: string, data: Partial<NuevaAuditoriaData>) {
        const response = await axios.put(
            `${API_URL}/auditorias/${id}`,
            data,
            { headers: getAuthHeader() }
        );
        return response.data;
    },

    async deleteAuditoria(id: string) {
        const response = await axios.delete(
            `${API_URL}/auditorias/${id}`,
            { headers: getAuthHeader() }
        );
        return response.data;
    },

    async uploadFile(subtareaId: number, file: File) {
        const formData = new FormData();
        formData.append('file', file);

        const response = await axios.post(
            `${API_URL}/auditorias/subtareas/${subtareaId}/upload`,
            formData,
            {
                headers: {
                    ...getAuthHeader(),
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        return response.data;
    },

    async downloadFile(subtareaId: number) {
        const response = await axios.get(
            `${API_URL}/auditorias/subtareas/${subtareaId}/download`,
            {
                headers: getAuthHeader(),
                responseType: 'blob'
            }
        );
        return response;
    },

    async updateEstadoSubtarea(subtareaId: number, estado: string) {
        const response = await axios.put(
            `${API_URL}/auditorias/subtareas/${subtareaId}/estado`,
            { estado_informacion: estado },
            { headers: getAuthHeader() }
        );
        return response.data;
    }
};
