export interface RolePermission {
    menuItemId: string;
    label: string;
}

export interface Role {
    id?: string;
    name: string;
    description?: string;
    permissions: string[]; // Array de IDs de items del menú
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateRolePayload {
    name: string;
    description?: string;
    permissions: string[];
}

export interface UpdateRolePayload extends CreateRolePayload {
    id: string;
}
