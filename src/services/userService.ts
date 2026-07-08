import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const getAuthHeader = () => {
  const token = localStorage.getItem("auth_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export interface User {
  id: number;
  name: string;
  email: string;
  role_id: number | null;
  role?: {
    id: number;
    name?: string;
    nombre?: string;
    description?: string;
    descripcion?: string;
  };
  cv_path?: string;
  cv_url?: string;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  country?: string;
  city?: string;
  department?: string;
  role?: string;
  profile_photo_url?: string;
  cv_url?: string;
  has_cv: boolean;
  tarjeta_profesional_url?: string;
  has_tarjeta_profesional: boolean;
  created_at: string;
  especialidad_revisoria_fiscal?: boolean;
  especialidad_auditoria_externa?: boolean;
  especialidad_evaluacion_estructuras?: boolean;
  especialidad_valoracion_empresas?: boolean;
  especialidad_control_interno?: boolean;
  especialidad_auditoria_financiera?: boolean;
  especialidad_analisis_riesgos?: boolean;
  especialidad_otros?: boolean;
}

export interface CreateDelegadoData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role_id?: number;
}

export const userService = {
  /**
   * Crea un usuario delegado usando el endpoint público POST /register.
   *
   * IMPORTANTE: la respuesta incluye un access_token del NUEVO usuario. NO lo
   * almacenamos deliberadamente para no reemplazar la sesión del admin que
   * está creando el delegado desde el panel de administración.
   */
  async createDelegado(data: CreateDelegadoData): Promise<User> {
    const response = await axios.post(`${API_URL}/register`, data, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    return response.data.user;
  },

  async getAllUsers(): Promise<User[]> {
    const response = await axios.get(`${API_URL}/users`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  async getUsersByRole(roleId: number): Promise<User[]> {
    const response = await axios.get(`${API_URL}/users/role/${roleId}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  async updateUserRole(userId: number, roleId: number): Promise<User> {
    const response = await axios.put(
      `${API_URL}/users/${userId}/role`,
      { role_id: roleId },
      { headers: getAuthHeader() }
    );
    return response.data;
  },

  async getDelegados(): Promise<User[]> {
    const response = await axios.get(`${API_URL}/users/delegados`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  async getUserProfile(userId: number): Promise<UserProfile> {
    const response = await axios.get(`${API_URL}/users/${userId}/profile`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  async getUserCV(userId: number): Promise<string> {
    const response = await axios.get(`${API_URL}/users/${userId}/cv`, {
      headers: getAuthHeader(),
      responseType: 'blob'
    });
    return URL.createObjectURL(response.data);
  },

  async getUserTarjetaProfesional(userId: number): Promise<string> {
    const response = await axios.get(`${API_URL}/users/${userId}/tarjeta-profesional`, {
      headers: getAuthHeader(),
      responseType: 'blob'
    });
    return URL.createObjectURL(response.data);
  },
};
