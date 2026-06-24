import axios from "axios";
import { NuevaAuditoriaData } from "../types/auditoria.types";

const API_URL = process.env.REACT_APP_API_URL;

const getAuthHeader = () => {
  const token = localStorage.getItem("auth_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const auditoriaService = {
  async createAuditoria(data: NuevaAuditoriaData) {
    const response = await axios.post(`${API_URL}/auditorias`, data, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  async getAuditorias() {
    const response = await axios.get(`${API_URL}/auditorias`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  async getAuditoria(id: string) {
    const response = await axios.get(`${API_URL}/auditorias/${id}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  async updateAuditoria(id: string, data: Partial<NuevaAuditoriaData>) {
    const response = await axios.put(`${API_URL}/auditorias/${id}`, data, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  async deleteAuditoria(id: string) {
    const response = await axios.delete(`${API_URL}/auditorias/${id}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  async uploadFile(subtareaId: number, file: File, carpetaId?: number | null) {
    const formData = new FormData();
    formData.append("file", file);
    if (carpetaId) {
      formData.append("carpeta_id", carpetaId.toString());
    }

    const response = await axios.post(
      `${API_URL}/auditorias/subtareas/${subtareaId}/upload`,
      formData,
      {
        headers: {
          ...getAuthHeader(),
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  async downloadFile(subtareaId: number) {
    const response = await axios.get(
      `${API_URL}/auditorias/subtareas/${subtareaId}/download`,
      {
        headers: getAuthHeader(),
        responseType: "blob",
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
  },

  async analizarIA(empresaId: string, tipoAuditoria: string) {
    const response = await axios.post(
      `${API_URL}/auditorias/analizar-ia`,
      { empresa_id: empresaId, tipo_auditoria: tipoAuditoria },
      { headers: getAuthHeader() }
    );
    return response.data;
  },

  async uploadInformePreliminar(auditoriaId: string, file: File) {
    const formData = new FormData();
    formData.append("informe", file);
    const response = await axios.post(
      `${API_URL}/auditorias/${auditoriaId}/informe-preliminar`,
      formData,
      { headers: { ...getAuthHeader(), "Content-Type": "multipart/form-data" } }
    );
    return response.data as { url: string; path: string };
  },

  async getInformePreliminar(auditoriaId: string) {
    const response = await axios.get(
      `${API_URL}/auditorias/${auditoriaId}/informe-preliminar`,
      { headers: getAuthHeader() }
    );
    return response.data as { url: string | null; path: string | null };
  },

  async getPapelera() {
    const response = await axios.get(`${API_URL}/auditorias/papelera/list`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  async restoreAuditoria(id: number) {
    const response = await axios.post(
      `${API_URL}/auditorias/${id}/restore`,
      {},
      { headers: getAuthHeader() }
    );
    return response.data;
  },

  async forceDeleteAuditoria(id: number) {
    const response = await axios.delete(
      `${API_URL}/auditorias/${id}/force`,
      { headers: getAuthHeader() }
    );
    return response.data;
  },

  async getOverdueStats(): Promise<any> {
    const response = await axios.get(`${API_URL}/auditorias/estadisticas-atrasos`, {
      headers: getAuthHeader()
    });
    return response.data;
  },
};
