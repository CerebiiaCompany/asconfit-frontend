/**
 * Tamaño máximo de los archivos que se suben a la aplicación.
 * Debe coincidir con el backend (config/uploads.php → UPLOAD_MAX_KB = 40960).
 */
export const MAX_UPLOAD_MB = 40;
export const MAX_UPLOAD_BYTES = MAX_UPLOAD_MB * 1024 * 1024;

export const UPLOAD_TOO_LARGE_MESSAGE = `El archivo no puede superar los ${MAX_UPLOAD_MB} MB.`;

export const exceedsUploadLimit = (file: File): boolean => file.size > MAX_UPLOAD_BYTES;

/** Lanza un error con mensaje legible si el archivo supera el límite (se usa antes de subir). */
export function assertUploadSize(file: File): void {
    if (exceedsUploadLimit(file)) {
        const sizeMb = (file.size / 1024 / 1024).toFixed(1);
        throw new Error(`"${file.name}" pesa ${sizeMb} MB. ${UPLOAD_TOO_LARGE_MESSAGE}`);
    }
}
