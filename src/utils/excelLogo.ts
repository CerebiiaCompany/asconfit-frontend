/** Logo de ASCONFIT en color oscuro (para fondos claros). 924x168 px. */
export const LOGO_OSCURO_PATH = "/asconfit-logo-oscuro.png";

/**
 * Descarga una imagen de /public y la devuelve en base64 (sin el prefijo data:),
 * que es el formato que espera ExcelJS en workbook.addImage().
 */
export async function fetchImageBase64(path: string): Promise<string> {
    const blob = await fetch(path).then((res) => {
        if (!res.ok) throw new Error(`No se pudo cargar ${path}`);
        return res.blob();
    });
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string).split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}
