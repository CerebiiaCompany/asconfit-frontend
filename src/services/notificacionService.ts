import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const getAuthHeader = () => {
  const token = localStorage.getItem("auth_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export interface Notificacion {
  id: number;
  user_id: number;
  auditoria_id: number | null;
  subtarea_id: number | null;
  tipo: string;
  titulo: string;
  mensaje: string;
  leida: boolean;
  created_at: string;
  updated_at: string;
  auditoria?: any;
  subtarea?: any;
}

export const notificacionService = {
  async getAll(): Promise<Notificacion[]> {
    const response = await axios.get(`${API_URL}/notificaciones`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  async getUnread(): Promise<Notificacion[]> {
    const response = await axios.get(`${API_URL}/notificaciones/unread`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  async markAsRead(id: number): Promise<void> {
    await axios.put(
      `${API_URL}/notificaciones/${id}/read`,
      {},
      { headers: getAuthHeader() }
    );
  },

  async markAllAsRead(): Promise<void> {
    await axios.put(
      `${API_URL}/notificaciones/read-all`,
      {},
      { headers: getAuthHeader() }
    );
  },

  async delete(id: number): Promise<void> {
    await axios.delete(`${API_URL}/notificaciones/${id}`, {
      headers: getAuthHeader(),
    });
  },

  async deleteAll(): Promise<void> {
    await axios.delete(`${API_URL}/notificaciones`, {
      headers: getAuthHeader(),
    });
  },
};
