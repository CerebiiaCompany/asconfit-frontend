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
  role_id: number;
}

export const userService = {
  async getUsersByRole(roleId: number): Promise<User[]> {
    const response = await axios.get(`${API_URL}/users/role/${roleId}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  async getDelegados(): Promise<User[]> {
    return this.getUsersByRole(3); // rol delegado id = 3
  },
};
