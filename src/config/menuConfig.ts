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
    icon: "/Search.png",
  },
  {
    id: "mis-tareas",
    path: "/mis-tareas",
    label: "Mis Tareas",
    icon: "/mytask.png",
  },
  {
    id: "empresas",
    path: "/empresas/ver",
    label: "Empresas",
    icon: "/building.png",
  },
  {
    id: "hallazgos",
    path: "/hallazgos",
    label: "Hallazgos",
    icon: "/Hallazgos.png",
  },
  {
    id: "ai-analysis",
    path: "/ai-analysis",
    label: "Análisis IA",
    icon: "/ai-analysis.png",
  },
  {
    id: "roles",
    path: "/roles",
    label: "Administración",
    icon: "/adminstracion.png",
  },
  {
    id: "papelera",
    path: "/papelera",
    label: "Papelera",
    icon: "/bin.png",
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
    "hallazgos",
    "auditorias",
    "ai-analysis",
    "mis-tareas",
    "empresas",
    "roles",
    "papelera",
    "perfil",
  ],
  auditor: ["dashboard", "hallazgos", "auditorias", "ai-analysis", "mis-tareas", "empresas", "perfil"],
  delegado: ["dashboard", "mis-tareas", "perfil"],
};

// Mapeo de rutas a IDs de menú (incluyendo rutas anidadas)
export const ROUTE_TO_MENU_ID: Record<string, string> = {
  "/dashboard": "dashboard",
  "/hallazgos": "hallazgos",
  "/auditorias": "auditorias",
  "/auditorias/nueva": "auditorias",
  "/auditorias/:id": "auditorias",
  "/auditorias/:id/informe-preliminar": "auditorias",
  "/ai-analysis": "ai-analysis",
  "/mis-tareas": "mis-tareas",
  "/mis-tareas/:id": "mis-tareas",
  "/empresas": "empresas",
  "/empresas/crear": "empresas",
  "/empresas/ver": "empresas",
  "/roles": "roles",
  "/roles/nuevo": "roles",
  "/roles/:id": "roles",
  "/perfil": "perfil",
  "/papelera": "papelera",
};

// Función para obtener items del menú según el rol
export const getMenuItemsByRole = (role: UserRole): MenuItem[] => {
  const allowedIds = MENU_BY_ROLE[role] || MENU_BY_ROLE["delegado"];
  return ALL_MENU_ITEMS.filter((item) => allowedIds.includes(item.id));
};

// Función para obtener items del menú según los permisos granulares
export const getMenuItemsByPermissions = (permissions: string[]): MenuItem[] => {
  if (!permissions || permissions.length === 0) return [];
  return ALL_MENU_ITEMS.filter((item) => permissions.includes(item.id));
};

// Función para verificar si un usuario puede acceder a una ruta
export const canAccessRoute = (path: string, role: UserRole): boolean => {
  // Normalizar el rol a minúsculas, con guard por si llega undefined/null
  if (!role) return false;
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
