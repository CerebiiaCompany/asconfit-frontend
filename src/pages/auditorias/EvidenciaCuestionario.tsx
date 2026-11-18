import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { cuestionarioService } from "../../services/cuestionarioService";
import { LoadingState } from "../../components/common/LoadingState";

type Info = Awaited<ReturnType<typeof cuestionarioService.getArchivoInfo>>;

const PREVISUALIZABLE = /\.(pdf|png|jpe?g|gif|webp|svg|txt)$/i;

/**
 * Destino de los enlaces de evidencias del Excel del cuestionario. El enlace no
 * caduca: al abrirlo se inicia sesión (si hace falta) y el archivo se descarga
 * con los permisos del usuario.
 */
export const EvidenciaCuestionario: React.FC = () => {
    const { archivoId } = useParams<{ archivoId: string }>();
    const navigate = useNavigate();
    const [info, setInfo] = useState<Info | null>(null);
    const [url, setUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let blobUrl: string | null = null;
        const id = Number(archivoId);
        Promise.all([cuestionarioService.getArchivoInfo(id), cuestionarioService.getArchivoBlobUrl(id)])
            .then(([i, u]) => {
                blobUrl = u;
                setInfo(i);
                setUrl(u);
            })
            .catch((err) => {
                const status = err?.response?.status;
                setError(
                    status === 404 || status === 403
                        ? "Este archivo no existe o no tienes acceso a la auditoría a la que pertenece."
                        : "No se pudo cargar el archivo. Revisa tu conexión e inténtalo de nuevo."
                );
            });
        return () => { if (blobUrl) URL.revokeObjectURL(blobUrl); };
    }, [archivoId]);

    if (error) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center px-4">
                <div className="max-w-md text-center">
                    <h1 className="text-lg font-semibold text-gray-800">No se puede abrir la evidencia</h1>
                    <p className="mt-2 text-sm text-gray-500">{error}</p>
                    <button
                        onClick={() => navigate("/auditorias")}
                        className="mt-5 px-4 py-2 rounded-lg bg-orange-500 text-white text-sm font-medium hover:bg-orange-600"
                    >
                        Ir a auditorías
                    </button>
                </div>
            </div>
        );
    }

    if (!info || !url) return <LoadingState message="Cargando evidencia..." />;

    const previsualizar = PREVISUALIZABLE.test(info.nombre);

    return (
        <div className="pb-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto pt-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="min-w-0">
                        <h1 className="text-lg font-semibold text-gray-800 truncate">{info.nombre}</h1>
                        {info.pregunta && (
                            <p className="text-sm text-gray-500 mt-1">Evidencia de: {info.pregunta}</p>
                        )}
                    </div>
                    <div className="flex gap-2 shrink-0">
                        <button
                            onClick={() => navigate(`/auditorias/${info.auditoria_id}/cuestionarios/${info.cuestionario_id}`)}
                            className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Ir al cuestionario
                        </button>
                        <a
                            href={url}
                            download={info.nombre}
                            className="px-4 py-2 rounded-lg bg-orange-500 text-white text-sm font-medium hover:bg-orange-600"
                        >
                            Descargar
                        </a>
                    </div>
                </div>

                {previsualizar ? (
                    /\.(png|jpe?g|gif|webp|svg)$/i.test(info.nombre) ? (
                        <img src={url} alt={info.nombre} className="mt-6 max-w-full mx-auto rounded-lg border border-gray-200" />
                    ) : (
                        <iframe src={url} title={info.nombre} className="mt-6 w-full h-[75vh] rounded-lg border border-gray-200 bg-white" />
                    )
                ) : (
                    <p className="mt-6 text-sm text-gray-500 text-center">
                        Este tipo de archivo no se puede mostrar en el navegador. Usa "Descargar" para abrirlo.
                    </p>
                )}
            </div>
        </div>
    );
};
