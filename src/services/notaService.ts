import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const getAuthHeader = () => {
  const token = localStorage.getItem("auth_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const notaService = {
  async getNota(subtareaId: number) {
    const response = await axios.get(
      `${API_URL}/subtareas/${subtareaId}/nota`,
      { headers: getAuthHeader() }
    );
    return response.data;
  },

  async updateNota(subtareaId: number, contenido: string) {
    const response = await axios.put(
      `${API_URL}/subtareas/${subtareaId}/nota`,
      { contenido },
      { headers: getAuthHeader() }
    );
    return response.data;
  },

  async deleteNota(subtareaId: number) {
    const response = await axios.delete(
      `${API_URL}/subtareas/${subtareaId}/nota`,
      { headers: getAuthHeader() }
    );
    return response.data;
  },
};
