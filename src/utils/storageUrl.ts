const API_BASE = (process.env.REACT_APP_API_URL || "http://localhost:8000/api").replace(/\/api$/, "");

export function storageUrl(path: string | null | undefined): string | null {
    if (!path) return null;
    // Si ya es una URL completa, devolverla tal cual
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    return `${API_BASE}/storage/${path}`;
}
