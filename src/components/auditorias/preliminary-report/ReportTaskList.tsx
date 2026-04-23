import React from "react";
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
    // pendiente — distinguir si ya subió archivo o no
    if (tieneArchivo) {
        return `el archivo "${s.archivo_nombre}" fue enviado${entrega ? ` antes de la fecha límite del ${entrega}` : ""}, sin embargo aún no ha sido aceptado ni rechazado por el auditor y se encuentra en espera de respuesta.`;
    }
    if (entrega) {
        const hoy = new Date();
        const fechaLimite = new Date(s.tiempo_entrega);
        const vencida = fechaLimite < hoy;
        if (vencida) {
            return `se encuentra pendiente y su fecha límite de entrega fue el ${entrega}, por lo que se encuentra vencida.`;
        }
        return `se encuentra pendiente de entrega, con fecha máxima el ${entrega}${solicitud ? `, solicitada desde el ${solicitud}` : ""}.`;
    }
    return `se encuentra pendiente de entrega${solicitud ? `, solicitada desde el ${solicitud}` : ""}.`;
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
                        <p className="font-semibold text-gray-800 mb-1.5 uppercase tracking-wide text-xs text-orange-600">
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
            </div>
        </div>
    );
};
