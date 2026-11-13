import React, { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Eye, FileText, Trash2, X } from "lucide-react";
import { auditoriaService, SubtareaArchivo } from "../../services/auditoriaService";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";

interface SubtareaArchivosModalProps {
    subtareaId: number;
    subtareaNombre?: string;
    onClose: () => void;
    /** Se llama al cerrar si se eliminó algún archivo, para refrescar la vista de origen. */
    onChanged?: () => void;
    /** Id del creador de la auditoría: puede eliminar cualquier archivo (además del admin y de quien lo subió). */
    auditoriaCreadorId?: number | null;
}

const formatSize = (bytes: number | null) => {
    if (!bytes) return "";
    if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
};

/** Lista de archivos de una tarea: permite abrir cada uno y eliminar los propios. */
export const SubtareaArchivosModal: React.FC<SubtareaArchivosModalProps> = ({
    subtareaId, subtareaNombre, onClose, onChanged, auditoriaCreadorId,
}) => {
    const { user } = useAuth();
    const { addToast } = useToast();
    const [archivos, setArchivos] = useState<SubtareaArchivo[] | null>(null);
    const [confirmId, setConfirmId] = useState<number | null>(null);
    const [busyId, setBusyId] = useState<number | null>(null);
    // La vista de origen se refresca al cerrar (si refrescara al eliminar, se
    // desmontaría esta ventana y no se podrían eliminar varios archivos seguidos).
    const [huboCambios, setHuboCambios] = useState(false);
    const cerrar = () => {
        if (huboCambios) onChanged?.();
        onClose();
    };

    const isAdmin = user?.role?.nombre?.toLowerCase() === "admin";
    const canDeleteAll = !!user && auditoriaCreadorId != null && Number(auditoriaCreadorId) === Number(user.id);

    const cargar = useCallback(() => {
        auditoriaService.getArchivosSubtarea(subtareaId)
            .then(setArchivos)
            .catch(() => {
                setArchivos([]);
                addToast("No se pudieron cargar los archivos", "error");
            });
    }, [subtareaId, addToast]);

    useEffect(() => { cargar(); }, [cargar]);

    const abrir = async (a: SubtareaArchivo) => {
        // Se abre la pestaña de inmediato (evita el bloqueador de pop-ups) y luego se carga el archivo
        const tab = window.open("", "_blank");
        try {
            const url = await auditoriaService.getArchivoSubtareaBlobUrl(subtareaId, a.id);
            if (tab) tab.location.href = url;
            else window.open(url, "_blank");
        } catch {
            tab?.close();
            addToast("No se pudo abrir el archivo", "error");
        }
    };

    const eliminar = async (a: SubtareaArchivo) => {
        setBusyId(a.id);
        try {
            await auditoriaService.deleteArchivoSubtarea(subtareaId, a.id);
            addToast("Archivo eliminado", "success");
            setConfirmId(null);
            setHuboCambios(true);
            cargar();
        } catch (err: any) {
            addToast(err?.response?.data?.message || "No se pudo eliminar el archivo", "error");
        } finally {
            setBusyId(null);
        }
    };

    const puedeEliminar = (a: SubtareaArchivo) =>
        isAdmin || canDeleteAll || (!!user && a.user_id !== null && Number(a.user_id) === Number(user.id));

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div className="min-w-0">
                        <h2 className="text-lg font-semibold text-gray-800">Archivos de la tarea</h2>
                        {subtareaNombre && <p className="text-xs text-gray-400 mt-0.5 truncate">{subtareaNombre}</p>}
                    </div>
                    <button onClick={cerrar} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600" title="Cerrar">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-4">
                    {archivos === null ? (
                        <p className="text-sm text-gray-400">Cargando...</p>
                    ) : archivos.length === 0 ? (
                        <p className="text-sm text-gray-400">Esta tarea no tiene archivos</p>
                    ) : (
                        <ul className="space-y-2">
                            {archivos.map((a, i) => (
                                <li key={a.id} className="flex items-center justify-between gap-3 border border-gray-100 rounded-lg px-3 py-2">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-8 h-8 shrink-0 bg-orange-100 rounded-lg flex items-center justify-center">
                                            <FileText className="w-4 h-4 text-orange-500" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-gray-800 truncate" title={a.nombre}>
                                                {a.nombre}
                                                {i === 0 && <span className="ml-2 text-[10px] font-semibold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded">Más reciente</span>}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                {new Date(a.created_at).toLocaleDateString("es-CO", { day: "2-digit", month: "2-digit", year: "numeric" })}
                                                {a.user?.name && ` · ${a.user.name}`}
                                                {a.tamano ? ` · ${formatSize(a.tamano)}` : ""}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 shrink-0">
                                        {confirmId === a.id ? (
                                            <>
                                                <button
                                                    onClick={() => eliminar(a)}
                                                    disabled={busyId === a.id}
                                                    className="px-2.5 py-1 text-xs font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg disabled:opacity-50"
                                                >
                                                    {busyId === a.id ? "Eliminando..." : "Eliminar"}
                                                </button>
                                                <button onClick={() => setConfirmId(null)} className="px-2.5 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded-lg">
                                                    Cancelar
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button onClick={() => abrir(a)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg" title="Abrir">
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                {puedeEliminar(a) && (
                                                    <button onClick={() => setConfirmId(a.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg" title="Eliminar">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
};
