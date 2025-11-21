export interface RolePermission {
    menuItemId: string;
    label: string;
}

export interface Role {
    id?: string | number;
    name?: string;
    nombre?: string;
    description?: string;
    descripcion?: string;
    permissions?: string[]; // Array de IDs de items del menú
    createdAt?: string;
    updatedAt?: string;
}

// Helper para obtener el nombre del rol
export const getRoleName = (role: Role): string => {
    return role.name || role.nombre || 'Sin nombre';
};

export interface CreateRolePayload {
    name: string;
    description?: string;
    permissions: string[];
}

export interface UpdateRolePayload extends CreateRolePayload {
    id: string;
}
