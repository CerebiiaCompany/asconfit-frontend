/**
 * Ruta a la que volver después de iniciar sesión (p. ej. un enlace de evidencia
 * abierto desde el Excel). Solo se aceptan rutas internas de la app.
 */
export const rutaTrasLogin = (state: unknown): string => {
    const from = (state as { from?: unknown } | null)?.from;
    return typeof from === "string" && from.startsWith("/") && !from.startsWith("//") && from !== "/login"
        ? from
        : "/dashboard";
};
