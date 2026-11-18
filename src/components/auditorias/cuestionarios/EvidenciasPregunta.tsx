import React, { useRef, useState } from "react";
import { cuestionarioService, EvidenciaPregunta } from "../../../services/cuestionarioService";
import { useAuth } from "../../../contexts/AuthContext";
import { useToast } from "../../../contexts/ToastContext";
import { exceedsUploadLimit, MAX_UPLOAD_MB } from "../../../utils/uploadLimits";

interface EvidenciasPreguntaProps {
    cuestionarioId: number;
    auditoriaId: string;
    preguntaId: number;
    /** Creador de la auditoría: también puede eliminar evidencias de otros. */
    auditoriaCreadorId?: number | null;
    archivos: EvidenciaPregunta[];
    onChange: (archivos: EvidenciaPregunta[]) => void;
}

const tamanoLegible = (bytes: number | null) => {
    if (!bytes) return "";
    if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
};

/**
 * Evidencias opcionales de una pregunta del cuestionario: se pueden adjuntar uno o
 * varios archivos de cualquier formato. Se suben al elegirlos (no dependen del
 * botón Guardar) y quedan enlazados en el Excel exportado.
 */
export const EvidenciasPregunta: React.FC<EvidenciasPreguntaProps> = ({
    cuestionarioId, auditoriaId, preguntaId, auditoriaCreadorId, archivos, onChange,
}) => {
    const { user } = useAuth();
    const { addToast } = useToast();
    const inputRef = useRef<HTMLInputElement>(null);
    const [subiendo, setSubiendo] = useState(false);
    const [confirmarId, setConfirmarId] = useState<number | null>(null);
    const [borrandoId, setBorrandoId] = useState<number | null>(null);

    const isAdmin = user?.role?.nombre?.toLowerCase() === "admin";
    const puedeEliminar = (a: EvidenciaPregunta) =>
        isAdmin
        || (!!user && auditoriaCreadorId != null && Number(auditoriaCreadorId) === Number(user.id))
        || (!!user && a.user_id != null && Number(a.user_id) === Number(user.id));

    const subir = async (lista: FileList | null) => {
        const files = Array.from(lista ?? []);
        if (inputRef.current) inputRef.current.value = "";
        if (files.length === 0) return;

        const grandes = files.filter(exceedsUploadLimit);
        if (grandes.length) {
            addToast(`${grandes.map((f) => f.name).join(", ")} supera${grandes.length > 1 ? "n" : ""} los ${MAX_UPLOAD_MB} MB y no se subi${grandes.length > 1 ? "eron" : "ó"}.`, "error");
        }
        const validos = files.filter((f) => !exceedsUploadLimit(f));
        if (validos.length === 0) return;

        setSubiendo(true);
        try {
            const res = await cuestionarioService.subirArchivos(cuestionarioId, auditoriaId, preguntaId, validos);
            onChange([...archivos, ...res.archivos]);
            addToast(res.message, "success");
        } catch (err: any) {
            const errores = err?.response?.data?.errors;
            const primero = errores ? (Object.values(errores)[0] as string[])?.[0] : null;
            addToast(primero || err?.response?.data?.message || "No se pudieron subir los archivos", "error");
        } finally {
            setSubiendo(false);
        }
    };

    const abrir = async (a: EvidenciaPregunta) => {
        // Se abre la pestaña de inmediato (evita el bloqueador de ventanas) y luego se carga el archivo
        const tab = window.open("", "_blank");
        try {
            const url = await cuestionarioService.getArchivoBlobUrl(a.id);
            if (tab) tab.location.href = url;
            else window.open(url, "_blank");
        } catch {
            tab?.close();
            addToast("No se pudo abrir el archivo", "error");
        }
    };

    const eliminar = async (a: EvidenciaPregunta) => {
        setBorrandoId(a.id);
        try {
            await cuestionarioService.eliminarArchivo(a.id);
            onChange(archivos.filter((x) => x.id !== a.id));
            setConfirmarId(null);
            addToast("Archivo eliminado", "success");
        } catch (err: any) {
            addToast(err?.response?.data?.message || "No se pudo eliminar el archivo", "error");
        } finally {
            setBorrandoId(null);
        }
    };

    return (
        <div className="mt-3">
            <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-gray-400">Evidencias (opcional)</span>
                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    disabled={subiendo}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-dashed border-gray-300 text-xs font-medium text-gray-600 hover:border-orange-400 hover:text-orange-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 disabled:opacity-60 transition-colors"
                >
                    {subiendo ? (
                        <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                    ) : (
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                    )}
                    {subiendo ? "Subiendo..." : "Adjuntar archivos"}
                </button>
                <input
                    ref={inputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => subir(e.target.files)}
                />
            </div>

            {archivos.length > 0 && (
                <ul className="mt-2 flex flex-wrap gap-2">
                    {archivos.map((a) => (
                        <li
                            key={a.id}
                            className="inline-flex items-center gap-1 max-w-full pl-2.5 pr-1 py-1 rounded-lg bg-orange-50 border border-orange-100 text-xs"
                        >
                            <button
                                type="button"
                                onClick={() => abrir(a)}
                                className="truncate max-w-[16rem] text-orange-700 hover:underline focus:outline-none focus-visible:underline"
                                title={`Abrir ${a.nombre}${a.user?.name ? `, subido por ${a.user.name}` : ""}`}
                            >
                                {a.nombre}
                            </button>
                            {a.tamano ? <span className="text-gray-400 shrink-0">{tamanoLegible(a.tamano)}</span> : null}
                            {puedeEliminar(a) && (
                                confirmarId === a.id ? (
                                    <span className="inline-flex items-center gap-1 ml-1 shrink-0">
                                        <button
                                            type="button"
                                            onClick={() => eliminar(a)}
                                            disabled={borrandoId === a.id}
                                            className="px-1.5 py-0.5 rounded bg-red-500 text-white font-medium hover:bg-red-600 disabled:opacity-60"
                                        >
                                            {borrandoId === a.id ? "Eliminando..." : "Eliminar"}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setConfirmarId(null)}
                                            className="px-1.5 py-0.5 rounded text-gray-500 hover:bg-gray-100"
                                        >
                                            Cancelar
                                        </button>
                                    </span>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => setConfirmarId(a.id)}
                                        aria-label={`Eliminar ${a.nombre}`}
                                        className="p-0.5 rounded text-gray-400 hover:text-red-500 hover:bg-white shrink-0"
                                    >
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                )
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
