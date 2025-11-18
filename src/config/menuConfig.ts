export interface MenuItem {
    id: string;
    path: string;
    label: string;
    icon: string;
}

export type UserRole = 'admin' | 'auditor' | 'delegado';

// Definición de todos los items del menú
export const ALL_MENU_ITEMS: MenuItem[] = [
    {
        id: 'dashboard',
        path: '/dashboard',
        label: 'Inicio',
        icon: '/dashboard.png',
    },
    {
        id: 'auditorias',
        path: '/auditorias',
        label: 'Auditorias',
        icon: '/search.png',
    },
    {
        id: 'mis-tareas',
        path: '/mis-tareas',
        label: 'Mis Tareas',
        icon: '/search.png',
    },
    {
        id: 'empresas',
        path: '/empresas',
        label: 'Empresas',
        icon: '/building.png',
    },
    {
        id: 'perfil',
        path: '/perfil',
        label: 'Perfil',
        icon: '/profile.png',
    },
];

// Configuración de menús por rol
export const MENU_BY_ROLE: Record<UserRole, string[]> = {
    admin: ['dashboard', 'auditorias', 'mis-tareas', 'empresas', 'perfil'],
    auditor: ['dashboard', 'auditorias', 'empresas', 'perfil'],
    delegado: ['dashboard', 'mis-tareas', 'perfil'],
};

// Función para obtener items del menú según el rol
export const getMenuItemsByRole = (role: UserRole): MenuItem[] => {
    const allowedIds = MENU_BY_ROLE[role] || MENU_BY_ROLE['delegado'];
    return ALL_MENU_ITEMS.filter(item => allowedIds.includes(item.id));
};
