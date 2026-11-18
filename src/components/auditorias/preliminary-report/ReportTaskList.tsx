import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Auditoria } from "../../../types/auditoria";
import { Finding } from "../../../services/findingService";
import { SEVERIDAD_CONFIG } from "../../../types/finding.types";
import { auditoriaService } from "../../../services/auditoriaService";
import { InformePreliminarIA } from "../../../types/informePreliminar";
import { exportPreliminaryReportPdf } from "../../../utils/preliminaryReportPdf";

const formatDate = (d?: string) => {
    if (!d) return null;
    const raw = d.includes("T") ? d.split("T")[0] : d;
    const [y, m, day] = raw.split("-");
    const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
    return `${parseInt(day)} de ${meses[parseInt(m) - 1]} de ${y}`;
};

const PRIORIDAD_CLASS: Record<string, string> = {
    alta: "bg-red-100 text-red-700",
    media: "bg-amber-100 text-amber-700",
    baja: "bg-green-100 text-green-700",
};

interface ReportTaskListProps {
    auditoria: Auditoria;
    findings: Finding[];
    empresaNombre: string;
}

const TextoIA: React.FC<{ loading: boolean; texto?: string; placeholder: string }> = ({
    loading,
    texto,
    placeholder,
}) => {
    if (loading && !texto) {
        return <p className="text-gray-400 italic">{placeholder}</p>;
    }
    if (texto) {
        return <p className="text-gray-700 leading-relaxed">{texto}</p>;
    }
    return <p className="text-gray-400 italic">No disponible.</p>;
};

export const ReportTaskList: React.FC<ReportTaskListProps> = ({ auditoria, findings, empresaNombre }) => {
    const [iaInforme, setIaInforme] = useState<InformePreliminarIA | null>(null);
    const [loadingIA, setLoadingIA] = useState(true);
    const [errorIA, setErrorIA] = useState<string | null>(null);

    const categorias = (auditoria.categorias ?? []).filter(c => (c.subtareas ?? []).length > 0);
    const totalSubtareas = categorias.flatMap(c => c.subtareas ?? []).length;
    const aprobadas = categorias.flatMap(c => c.subtareas ?? []).filter(s => s.estado_informacion === "aprobado").length;
    const pendientes = totalSubtareas - aprobadas;

    const conclusionesPorFinding = useMemo(() => {
        const map = new Map<number, string>();
        iaInforme?.hallazgos?.forEach(h => {
            if (h.finding_id && h.conclusion) {
                map.set(h.finding_id, h.conclusion);
            }
        });
        return map;
    }, [iaInforme]);

    // Si los datos de la auditoría no cambiaron, el backend devuelve el informe guardado
    // sin volver a llamar a la IA; "Regenerar" fuerza una versión nueva.
    const cargarInformeIA = useCallback((regenerar = false) => {
        if (!auditoria?.id) return;
        setLoadingIA(true);
        setErrorIA(null);
        auditoriaService
            .generarInformePreliminarIA(String(auditoria.id), regenerar)
            .then(setIaInforme)
            .catch((err: any) => {
                setErrorIA(err.response?.data?.error || "No se pudo generar el informe con IA.");
            })
            .finally(() => setLoadingIA(false));
    }, [auditoria?.id]);

    useEffect(() => {
        cargarInformeIA();
    }, [cargarInformeIA]);

    const renderHallazgo = (f: Finding, numero: number) => {
        const sev = SEVERIDAD_CONFIG[f.severidad as keyof typeof SEVERIDAD_CONFIG];
        const conclusion = conclusionesPorFinding.get(f.id);
        const actividadNombre = f.actividad?.nombre;

        return (
            <div key={f.id ?? numero} className="pl-3 space-y-2">
                <div className="flex gap-2 items-start">
                    {sev && (
                        <span className={`mt-1 shrink-0 inline-block w-2 h-2 rounded-full ${sev.color}`} />
                    )}
                    <div className="space-y-2">
                        <p className="font-medium text-gray-900 text-sm">
                            Hallazgo {numero}: {f.titulo}
                            {sev ? ` (${sev.label})` : ""}
                        </p>
                        {actividadNombre && (
                            <p className="text-xs text-gray-500">Actividad: {actividadNombre}</p>
                        )}
                        <div>
                            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-0.5">
                                Problema identificado
                            </p>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                {f.descripcion || f.titulo}
                                {f.responsable ? `. Responsable: ${f.responsable}` : ""}
                                {f.fecha_limite ? `. Fecha límite: ${formatDate(f.fecha_limite)}` : ""}
                            </p>
                        </div>
                        <div className="bg-orange-50 border border-orange-100 rounded-lg px-3 py-2">
                            <p className="text-xs font-semibold text-orange-700 uppercase tracking-wide mb-1">
                                Conclusión y recomendaciones (IA)
                            </p>
                            {loadingIA ? (
                                <p className="text-sm text-gray-400 italic">Generando conclusión...</p>
                            ) : conclusion ? (
                                <p className="text-gray-700 text-sm leading-relaxed">{conclusion}</p>
                            ) : (
                                <p className="text-sm text-gray-400 italic">No se generó conclusión para este hallazgo.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-4 flex items-center justify-between gap-3">
                <div>
                    <h2 className="text-white font-semibold text-base">Informe Preliminar</h2>
                    <p className="text-orange-100 text-xs mt-0.5">
                        {aprobadas} de {totalSubtareas} aprobados · {pendientes} pendientes
                        {loadingIA
                            ? " · Generando con IA..."
                            : iaInforme?.generado_en
                                ? ` · Generado con IA el ${new Date(iaInforme.generado_en).toLocaleString("es-CO", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}`
                                : " · Generado con IA"}
                    </p>
                </div>
                <div className="shrink-0 flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => cargarInformeIA(true)}
                    disabled={loadingIA}
                    title="Vuelve a redactar el informe con la IA (consume tokens)"
                    className="inline-flex items-center px-3 py-1.5 rounded-lg border border-white/60 text-white text-xs font-semibold hover:bg-white/10 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                >
                    Regenerar
                </button>
                <button
                    type="button"
                    onClick={() => exportPreliminaryReportPdf({ auditoria, findings, informe: iaInforme, empresa: empresaNombre })}
                    disabled={loadingIA || !iaInforme}
                    title={loadingIA ? "Espera a que termine de generarse el informe" : "Exportar a PDF con marca de agua"}
                    className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-orange-600 text-xs font-semibold hover:bg-orange-50 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M6 20h12a2 2 0 002-2V8l-6-6H6a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    Exportar PDF
                </button>
                </div>
            </div>

            {errorIA && (
                <div className="mx-5 mt-4 p-3 bg-red-50 border border-red-100 rounded-lg flex items-center justify-between gap-3">
                    <p className="text-sm text-red-700">{errorIA}</p>
                    <button
                        onClick={() => cargarInformeIA()}
                        className="text-sm font-medium text-red-700 hover:text-red-900 whitespace-nowrap"
                    >
                        Reintentar
                    </button>
                </div>
            )}

            <div className="px-6 py-5 space-y-5 text-sm text-gray-700 leading-relaxed">
                {iaInforme?.resumen_ejecutivo && (
                    <div className="bg-orange-50 border border-orange-100 border-l-4 border-l-orange-500 rounded-lg px-4 py-3">
                        <p className="text-xs font-semibold text-orange-700 mb-1">Resumen ejecutivo</p>
                        <p className="text-gray-700 leading-relaxed">{iaInforme.resumen_ejecutivo}</p>
                    </div>
                )}

                <div>
                    <p className="text-xs font-semibold text-orange-600 uppercase tracking-wide mb-2">
                        Introducción
                    </p>
                    <TextoIA
                        loading={loadingIA}
                        texto={iaInforme?.introduccion}
                        placeholder="Generando introducción..."
                    />
                </div>

                {totalSubtareas > 0 && (
                    <div className="pt-2 border-t border-gray-100">
                        <p className="text-xs font-semibold text-orange-600 uppercase tracking-wide mb-2">
                            Estado de requerimientos
                        </p>
                        <TextoIA
                            loading={loadingIA}
                            texto={iaInforme?.cierre_requerimientos}
                            placeholder="Generando resumen de requerimientos..."
                        />
                    </div>
                )}

                {findings.length > 0 && (
                    <div className="pt-3 border-t border-gray-100">
                        <p className="text-xs font-semibold text-orange-600 uppercase tracking-wide mb-3">
                            Hallazgos identificados
                        </p>
                        <div className="mb-4">
                            <TextoIA
                                loading={loadingIA}
                                texto={iaInforme?.intro_hallazgos}
                                placeholder="Generando introducción de hallazgos..."
                            />
                        </div>

                        {categorias.map((cat, ci) => {
                            const findingsCat = findings.filter(f =>
                                (cat.subtareas ?? []).some(s => s.id === f.actividad_id)
                            );
                            if (findingsCat.length === 0) return null;

                            let contador = 0;
                            return (
                                <div key={cat.id ?? ci} className="mb-4">
                                    <p className="font-semibold mb-1.5 uppercase tracking-wide text-xs text-orange-600">
                                        {cat.nombre}
                                    </p>
                                    <div className="space-y-4 pl-1 border-l-2 border-orange-100">
                                        {(cat.subtareas ?? []).map(s => {
                                            const findingsSub = findingsCat.filter(f => f.actividad_id === s.id);
                                            if (findingsSub.length === 0) return null;
                                            return (
                                                <div key={s.id} className="space-y-3">
                                                    <p className="pl-3 font-medium text-gray-900 text-sm">{s.nombre}</p>
                                                    {findingsSub.map(f => {
                                                        contador += 1;
                                                        return renderHallazgo(f, contador);
                                                    })}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}

                        {(() => {
                            const sinActividad = findings.filter(f => !f.actividad_id);
                            if (sinActividad.length === 0) return null;
                            const offset = findings.filter(f => f.actividad_id).length;
                            return (
                                <div className="mb-4">
                                    <p className="font-semibold mb-1.5 uppercase tracking-wide text-xs text-orange-600">
                                        Generales
                                    </p>
                                    <div className="space-y-4 pl-1 border-l-2 border-orange-100">
                                        {sinActividad.map((f, fi) => renderHallazgo(f, offset + fi + 1))}
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                )}

                {(iaInforme?.plan_accion?.length ?? 0) > 0 && (
                    <div className="pt-3 border-t border-gray-100">
                        <p className="text-xs font-semibold text-orange-600 uppercase tracking-wide mb-3">
                            Plan de acción sugerido
                        </p>
                        <ul className="space-y-2">
                            {iaInforme!.plan_accion!.map((p, i) => (
                                <li key={i} className="flex items-start justify-between gap-3">
                                    <span className="text-gray-700">{p.accion}</span>
                                    <span className="shrink-0 text-xs text-gray-500 whitespace-nowrap">
                                        {p.plazo}
                                        <span className={`ml-2 px-1.5 py-0.5 rounded font-medium ${PRIORIDAD_CLASS[p.prioridad] ?? "bg-gray-100 text-gray-600"}`}>
                                            {p.prioridad.charAt(0).toUpperCase() + p.prioridad.slice(1)}
                                        </span>
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="pt-3 border-t border-gray-100">
                    <p className="text-xs font-semibold text-orange-600 uppercase tracking-wide mb-3">
                        Conclusión y recomendaciones generales
                    </p>
                    {loadingIA && !iaInforme?.conclusion_general ? (
                        <p className="text-gray-400 italic">Generando conclusión general...</p>
                    ) : iaInforme?.conclusion_general ? (
                        iaInforme.conclusion_general.split("\n\n").filter(Boolean).map((parrafo, i) => (
                            <p key={i} className="text-gray-700 leading-relaxed mb-3">{parrafo}</p>
                        ))
                    ) : (
                        <p className="text-gray-400 italic">No se pudo generar la conclusión general.</p>
                    )}
                </div>
            </div>
        </div>
    );
};
