import { Role, CreateRolePayload } from '../types/role';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const getHeaders = () => {
    const token = localStorage.getItem('auth_token');
    const headers: any = {
        'Content-Type': 'application/json',
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
};

export const roleService = {
    // Obtener todos los roles
    async getAllRoles(): Promise<Role[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/roles`, {
                method: 'GET',
                headers: getHeaders(),
            });

            if (!response.ok) {
                let errorMessage = `Error ${response.status}: ${response.statusText}`;
                try {
                    const error = await response.json();
                    errorMessage = error.message || errorMessage;
                } catch (e) {
                    // Si no es JSON, usar el mensaje por defecto
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();
            // Mapear la respuesta del backend al formato del frontend
            return data.map((role: any) => ({
                id: role.id,
                name: role.nombre,
                description: role.descripcion,
                permissions: role.permissions || [],
            }));
        } catch (error) {
            console.error('Error fetching roles:', error);
            throw error;
        }
    },

    // Obtener un rol por ID
    async getRoleById(id: string): Promise<Role> {
        const response = await fetch(`${API_BASE_URL}/roles/${id}`, {
            method: 'GET',
            headers: getHeaders(),
        });

        if (!response.ok) {
            throw new Error('Error al obtener el rol');
        }

        const role = await response.json();
        return {
            id: role.id,
            name: role.nombre,
            description: role.descripcion,
            permissions: role.permissions || [],
        };
    },

    // Crear un nuevo rol
    async createRole(payload: CreateRolePayload): Promise<Role> {
        const response = await fetch(`${API_BASE_URL}/roles`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            let errorMessage = 'Error al crear el rol';
            try {
                const error = await response.json();
                errorMessage = error.message || error.errors?.name?.[0] || errorMessage;
            } catch (e) {
                errorMessage = `Error ${response.status}: ${response.statusText}`;
            }
            throw new Error(errorMessage);
        }

        const role = await response.json();
        return {
            id: role.id,
            name: role.nombre,
            description: role.descripcion,
            permissions: role.permissions || [],
        };
    },

    // Actualizar un rol
    async updateRole(id: string, payload: CreateRolePayload): Promise<Role> {
        const response = await fetch(`${API_BASE_URL}/roles/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            let errorMessage = 'Error al actualizar el rol';
            try {
                const error = await response.json();
                errorMessage = error.message || error.errors?.name?.[0] || errorMessage;
            } catch (e) {
                errorMessage = `Error ${response.status}: ${response.statusText}`;
            }
            throw new Error(errorMessage);
        }

        const role = await response.json();
        return {
            id: role.id,
            name: role.nombre,
            description: role.descripcion,
            permissions: role.permissions || [],
        };
    },

    // Eliminar un rol
    async deleteRole(id: string): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/roles/${id}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al eliminar el rol');
        }
    },
};
