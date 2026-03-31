import axios from "axios";

// Uso el esquema de URL base de los otros servicios, cayendo a la URL de desarrollo por defecto si no existe .env
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

const getAuthHeader = () => {
  const token = localStorage.getItem("auth_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export interface Empresa {
  id?: number;
  razon_social: string;
  nit: string;
  tipo_sociedad: string;
  actividad_economica: string;
  estado: string;
  representante_legal: string;
  tipo_documento: string;
  numero_documento: string;
  correo_personal: string;
  telefono_personal: string;
  pais: string;
  departamento: string;
  ciudad: string;
  direccion: string;
  telefono_empresarial?: string | null;
  correo_empresarial?: string | null;
  created_at?: string;
  updated_at?: string;
}

export const empresaService = {
  async getAll(): Promise<Empresa[]> {
    const response = await axios.get(`${API_URL}/empresas`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  async getById(id: number): Promise<Empresa> {
    const response = await axios.get(`${API_URL}/empresas/${id}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  async create(empresaData: Empresa): Promise<{ message: string; empresa: Empresa }> {
    const response = await axios.post(`${API_URL}/empresas`, empresaData, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  async update(id: number, empresaData: Partial<Empresa>): Promise<{ message: string; empresa: Empresa }> {
    const response = await axios.put(`${API_URL}/empresas/${id}`, empresaData, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  async delete(id: number): Promise<{ message: string }> {
    const response = await axios.delete(`${API_URL}/empresas/${id}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  }
};
