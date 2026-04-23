import React, { useState } from "react";
import { Auditoria } from "../../../types/auditoria";

const formatDate = (d?: string) => {
    if (!d) return null;
    const raw = d.includes("T") ? d.split("T")[0] : d;
    const [y, m, day] = raw.split("-");
    const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
    return `${parseInt(day)} de ${meses[parseInt(m) - 1]} de ${y}`;
};

const estadoTexto = (s: any): string => {
    const estado = s.estado_informacion ?? "pendiente";
    const entrega = formatDate(s.tiempo_entrega);
    const solicitud = formatDate(s.fecha_solicitud);
    const tieneArchivo = !!s.archivo_nombre;

    if (estado === "aprobado") {
        return `fue entregada y aprobada${s.archivo_nombre ? `, con el archivo "${s.archivo_nombre}"` : ""}${entrega ? ` antes de la fecha límite del ${entrega}` : ""}.`;
    }
    if (estado === "rechazado") {
        return `fue entregada pero rechazada${entrega ? `, con fecha límite el ${entrega}` : ""}. Se requiere corrección.`;
    }
    if (estado === "recibido" || estado === "revision") {
        return `fue entregada${s.archivo_nombre ? ` con el archivo "${s.archivo_nombre}"` : ""} y se encuentra en espera de revisión por parte del auditor${entrega ? `, con fecha límite el ${entrega}` : ""}.`;
    }
    if (tieneArchivo) {
        return `el archivo "${s.archivo_nombre}" fue enviado${entrega ? ` antes de la fecha límite del ${entrega}` : ""}, sin embargo aún no ha sido aceptado ni rechazado por el auditor y se encuentra en espera de respuesta.`;
    }
    if (entrega) {
        const vencida = new Date(s.tiempo_entrega) < new Date();
        if (vencida) return `se encuentra pendiente y su fecha límite de entrega fue el ${entrega}, por lo que se encuentra vencida.`;
        return `se encuentra pendiente de entrega, con fecha máxima el ${entrega}${solicitud ? `, solicitada desde el ${solicitud}` : ""}.`;
    }
    return `se encuentra pendiente de entrega${solicitud ? `, solicitada desde el ${solicitud}` : ""}.`;
};

const generarConclusion = (auditoria: Auditoria): string => {
    const empresa = auditoria.empresa?.razon_social || auditoria.razon_social || "la empresa";
    const tipo = auditoria.tipo_auditoria ?? "auditoría";
    const subtareas = (auditoria.categorias ?? []).flatMap(c => c.subtareas ?? []);
    const total = subtareas.length;
    const aprobadas = subtareas.filter(s => s.estado_informacion === "aprobado").length;
    const rechazadas = subtareas.filter(s => (s.estado_informacion as string) === "rechazado").length;
    const enEspera = subtareas.filter(s =>
    (s.estado_informacion === "recibido" || s.estado_informacion === "revision" ||
        (s.estado_informacion === "pendiente" && !!s.archivo_nombre))
    ).length;
    const sinEntregar = subtareas.filter(s =>
        (s.estado_informacion === "pendiente" || !s.estado_informacion) && !s.archivo_nombre
    ).length;
    const vencidas = subtareas.filter(s =>
        !s.archivo_nombre && s.tiempo_entrega && new Date(s.tiempo_entrega) < new Date()
    ).length;

    const pct = total > 0 ? Math.round((aprobadas / total) * 100) : 0;

    let texto = `Con base en la revisión del estado de los requerimientos solicitados en el marco de la ${tipo} practicada a ${empresa}, `;

    if (pct === 100) {
        texto += `se concluye que la totalidad de los ${total} requerimientos han sido entregados y aprobados satisfactoriamente, lo que refleja un alto nivel de cumplimiento y colaboración por parte de la entidad auditada.`;
    } else {
        texto += `se evidencia un avance del ${pct}% en la entrega y aprobación de los ${total} requerimientos solicitados. `;

        if (aprobadas > 0) texto += `Un total de ${aprobadas} ${aprobadas === 1 ? "requerimiento fue aprobado" : "requerimientos fueron aprobados"} correctamente. `;
        if (enEspera > 0) texto += `${enEspera} ${enEspera === 1 ? "requerimiento se encuentra" : "requerimientos se encuentran"} en proceso de revisión, pendiente${enEspera === 1 ? "" : "s"} de respuesta por parte del equipo auditor. `;
        if (rechazadas > 0) texto += `${rechazadas} ${rechazadas === 1 ? "requerimiento fue rechazado y requiere" : "requerimientos fueron rechazados y requieren"} corrección y nueva entrega por parte del auditado. `;
        if (sinEntregar > 0) texto += `${sinEntregar} ${sinEntregar === 1 ? "requerimiento no ha sido entregado" : "requerimientos no han sido entregados"} a la fecha de elaboración de este informe. `;
        if (vencidas > 0) texto += `Se alerta que ${vencidas} ${vencidas === 1 ? "requerimiento se encuentra vencido" : "requerimientos se encuentran vencidos"}, superando la fecha límite establecida. `;

        texto += `\n\nSe recomienda a ${empresa} priorizar la entrega de los requerimientos pendientes a la mayor brevedad posible, con el fin de no retrasar el proceso de auditoría y garantizar el cumplimiento de los plazos acordados.`;

        if (rechazadas > 0) {
            texto += ` Así mismo, se solicita revisar y corregir los documentos rechazados conforme a las observaciones realizadas por el auditor.`;
        }
    }

    return texto;
};

interface ReportTaskListProps {
    auditoria: Auditoria;
}

export const ReportTaskList: React.FC<ReportTaskListProps> = ({ auditoria }) => {
    const empresaNombre = auditoria.empresa?.razon_social || auditoria.razon_social || "la empresa";
    const tipoAuditoria = auditoria.tipo_auditoria ?? "auditoría";
    const fechaInicio = formatDate(auditoria.fecha_inicial);
    const fechaCorte = formatDate(auditoria.fecha_corte);

    const categorias = (auditoria.categorias ?? []).filter(c => (c.subtareas ?? []).length > 0);
    const totalSubtareas = categorias.flatMap(c => c.subtareas ?? []).length;
    const aprobadas = categorias.flatMap(c => c.subtareas ?? []).filter(s => s.estado_informacion === "aprobado").length;
    const pendientes = totalSubtareas - aprobadas;

    const [conclusion, setConclusion] = useState(() => generarConclusion(auditoria));

    const handleRegenerate = () => {
        setConclusion(generarConclusion(auditoria));
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-4">
                <h2 className="text-white font-semibold text-base">Informe Preliminar</h2>
                <p className="text-orange-100 text-xs mt-0.5">
                    {aprobadas} de {totalSubtareas} aprobados · {pendientes} pendientes
                </p>
            </div>

            <div className="px-6 py-5 overflow-y-auto max-h-[calc(100vh-220px)] space-y-5 text-sm text-gray-700 leading-relaxed">

                {/* Párrafo introductorio */}
                <p>
                    En el marco de la <span className="font-medium">{tipoAuditoria}</span> realizada a{" "}
                    <span className="font-medium">{empresaNombre}</span>
                    {fechaInicio ? `, con fecha de inicio el ${fechaInicio}` : ""}
                    {fechaCorte ? ` y fecha de corte el ${fechaCorte}` : ""}
                    , se solicitaron un total de <span className="font-medium">{totalSubtareas} requerimientos</span> distribuidos
                    en {categorias.length} {categorias.length === 1 ? "categoría" : "categorías"}.
                    A continuación se presenta el estado actual de cada uno:
                </p>

                {/* Párrafos por categoría */}
                {categorias.map((cat, ci) => (
                    <div key={cat.id ?? ci}>
                        <p className="font-semibold mb-1.5 uppercase tracking-wide text-xs text-orange-600">
                            {cat.nombre}
                        </p>
                        <div className="space-y-2 pl-1 border-l-2 border-orange-100">
                            {(cat.subtareas ?? []).map((s, si) => (
                                <p key={s.id ?? si} className="pl-3">
                                    <span className="font-medium text-gray-900">{si + 1}. {s.nombre}</span>
                                    {" — "}
                                    <span className="text-gray-600">{estadoTexto(s)}</span>
                                </p>
                            ))}
                        </div>
                    </div>
                ))}

                {/* Párrafo de cierre */}
                {totalSubtareas > 0 && (
                    <p className="pt-2 border-t border-gray-100 text-gray-500 italic">
                        {(() => {
                            const subtareas = categorias.flatMap(c => c.subtareas ?? []);
                            const enEspera = subtareas.filter(s =>
                                (s.estado_informacion === "pendiente" || s.estado_informacion === "recibido" || s.estado_informacion === "revision") && !!s.archivo_nombre
                            ).length;
                            const sinEntregar = subtareas.filter(s =>
                                (s.estado_informacion === "pendiente" || !s.estado_informacion) && !s.archivo_nombre
                            ).length;
                            if (pendientes === 0) return "Todos los requerimientos han sido recibidos y aprobados satisfactoriamente.";
                            const partes: string[] = [];
                            if (sinEntregar > 0) partes.push(`${sinEntregar} ${sinEntregar === 1 ? "requerimiento sin entregar" : "requerimientos sin entregar"}`);
                            if (enEspera > 0) partes.push(`${enEspera} ${enEspera === 1 ? "archivo enviado en espera de respuesta" : "archivos enviados en espera de respuesta"}`);
                            return `Al momento de la elaboración de este informe, ${partes.join(" y ")}.`;
                        })()}
                    </p>
                )}

                {/* Conclusión generada automáticamente */}
                <div className="pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <p className="text-xs font-semibold text-orange-600 uppercase tracking-wide">
                                Conclusión y Recomendaciones
                            </p>

                        </div>

                    </div>
                    {conclusion.split("\n\n").filter(Boolean).map((parrafo, i) => (
                        <p key={i} className="text-gray-700 leading-relaxed mb-3">{parrafo}</p>
                    ))}
                </div>
            </div>
        </div>
    );
};
