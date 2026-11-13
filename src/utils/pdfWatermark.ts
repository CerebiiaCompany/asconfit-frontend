/**
 * Marca de agua de ASCONFIT para todos los informes PDF que exporta la aplicación.
 *
 * Los PDF se generan escribiendo un HTML en una ventana nueva y llamando a
 * window.print(). Cualquier PDF nuevo debe imprimirse con printHtmlWithWatermark()
 * (o pasar su HTML por withPdfWatermark()) para que lleve la marca de agua.
 *
 * El elemento es `position: fixed`, así que el navegador lo repite en cada
 * página impresa. Va por encima del contenido (semitransparente) para que se vea
 * también sobre tablas y celdas con fondo de color. La imagen es una versión
 * oscura del logo (el original es blanco y no se vería sobre papel blanco).
 */

export const WATERMARK_IMAGE_PATH = "/asconfit-watermark.png";

/** URL absoluta: el HTML se escribe en una ventana about:blank, sin URL base propia. */
export const watermarkImageUrl = (): string =>
    `${window.location.origin}${WATERMARK_IMAGE_PATH}`;

export const WATERMARK_STYLE = `
    .asconfit-watermark{
      position:fixed;inset:0;z-index:9999;pointer-events:none;
      display:flex;align-items:center;justify-content:center;
    }
    .asconfit-watermark img{
      width:70%;max-width:720px;opacity:0.08;transform:rotate(-30deg);
    }
`;

export const watermarkHtml = (): string =>
    `<div class="asconfit-watermark" aria-hidden="true"><img src="${watermarkImageUrl()}" alt=""/></div>`;

/** Inserta la marca de agua en un documento HTML completo destinado a imprimirse como PDF. */
export function withPdfWatermark(html: string): string {
    return html
        .replace(/<\/head>/i, `<style>${WATERMARK_STYLE}</style></head>`)
        .replace(/<body([^>]*)>/i, `<body$1>${watermarkHtml()}`);
}

/**
 * Abre el HTML en una ventana nueva con la marca de agua y lanza la impresión
 * (Guardar como PDF) cuando el logo ya cargó, para que no salga sin marca.
 */
export function printHtmlWithWatermark(html: string, features = "width=900,height=700"): void {
    const win = window.open("", "_blank", features);
    if (!win) return;
    win.document.open();
    win.document.write(withPdfWatermark(html));
    win.document.close();

    let printed = false;
    const doPrint = () => {
        if (printed) return;
        printed = true;
        win.focus();
        win.onafterprint = () => win.close();
        win.print();
    };

    const img = win.document.querySelector<HTMLImageElement>(".asconfit-watermark img");
    if (!img || img.complete) {
        setTimeout(doPrint, 50);
    } else {
        img.addEventListener("load", doPrint);
        img.addEventListener("error", doPrint);
        setTimeout(doPrint, 3000); // por si el evento nunca llega
    }
}
