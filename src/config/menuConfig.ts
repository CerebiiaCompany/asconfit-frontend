export interface MenuItem {
  id: string;
  path: string;
  label: string;
  icon: string;
}

export type UserRole = "admin" | "auditor" | "delegado";

// Definición de todos los items del menú
export const ALL_MENU_ITEMS: MenuItem[] = [
  {
    id: "dashboard",
    path: "/dashboard",
    label: "Inicio",
    icon: "/dashboard.png",
  },
  {
    id: "auditorias",
    path: "/auditorias",
    label: "Auditorias",
    icon: "/search.png",
  },
  {
    id: "mis-tareas",
    path: "/mis-tareas",
    label: "Mis Tareas",
    icon: "/search.png",
  },
  {
    id: "empresas",
    path: "/empresas",
    label: "Empresas",
    icon: "/building.png",
  },
  {
    id: "roles",
    path: "/roles",
    label: "Administración",
    icon: "/adminstracion.png",
  },
  {
    id: "perfil",
    path: "/perfil",
    label: "Perfil",
    icon: "/profile.png",
  },
];

// Configuración de menús por rol
export const MENU_BY_ROLE: Record<UserRole, string[]> = {
  admin: [
    "dashboard",
    "auditorias",
    "mis-tareas",
    "empresas",
    "roles",
    "perfil",
  ],
  auditor: ["dashboard", "auditorias", "empresas", "perfil"],
  delegado: ["dashboard", "mis-tareas", "perfil"],
};

// Mapeo de rutas a IDs de menú (incluyendo rutas anidadas)
export const ROUTE_TO_MENU_ID: Record<string, string> = {
  "/dashboard": "dashboard",
  "/auditorias": "auditorias",
  "/auditorias/nueva": "auditorias",
  "/auditorias/:id": "auditorias",
  "/mis-tareas": "mis-tareas",
  "/mis-tareas/:id": "mis-tareas",
  "/empresas": "empresas",
  "/roles": "roles",
  "/roles/nuevo": "roles",
  "/roles/:id": "roles",
  "/perfil": "perfil",
};

// Función para obtener items del menú según el rol
export const getMenuItemsByRole = (role: UserRole): MenuItem[] => {
  const allowedIds = MENU_BY_ROLE[role] || MENU_BY_ROLE["delegado"];
  return ALL_MENU_ITEMS.filter((item) => allowedIds.includes(item.id));
};

// Función para verificar si un usuario puede acceder a una ruta
export const canAccessRoute = (path: string, role: UserRole): boolean => {
  // Normalizar el rol a minúsculas
  const normalizedRole = role.toLowerCase() as UserRole;

  // Buscar el ID del menú correspondiente a la ruta
  let menuId = ROUTE_TO_MENU_ID[path];

  // Si no se encuentra una coincidencia exacta, buscar por patrón
  if (!menuId) {
    for (const [routePattern, id] of Object.entries(ROUTE_TO_MENU_ID)) {
      if (routePattern.includes(":")) {
        const regex = new RegExp(
          "^" + routePattern.replace(/:[^/]+/g, "[^/]+") + "$",
        );
        if (regex.test(path)) {
          menuId = id;
          break;
        }
      }
    }
  }

  // Si no se encuentra el menuId, denegar acceso por defecto
  if (!menuId) return false;

  // Verificar si el rol tiene acceso a este item del menú
  const allowedIds = MENU_BY_ROLE[normalizedRole] || MENU_BY_ROLE["delegado"];
  return allowedIds.includes(menuId);
};
