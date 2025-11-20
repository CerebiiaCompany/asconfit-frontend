import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const getAuthHeader = () => {
  const token = localStorage.getItem("auth_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const plantillaService = {
  async getPlantillas() {
    const response = await axios.get(`${API_URL}/categoria-plantillas`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  async getPlantilla(codigo: string) {
    const response = await axios.get(
      `${API_URL}/categoria-plantillas/${codigo}`,
      { headers: getAuthHeader() }
    );
    return response.data;
  },

  async updatePlantilla(codigo: string, data: any) {
    const response = await axios.put(
      `${API_URL}/categoria-plantillas/${codigo}`,
      data,
      { headers: getAuthHeader() }
    );
    return response.data;
  },
};
