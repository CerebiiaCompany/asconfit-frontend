import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuditoriaDetalle } from "../../hooks/useAuditoriaDetalle";
import { LoadingState } from "../../components/common/LoadingState";
import { ReportTaskList } from "../../components/auditorias/preliminary-report/ReportTaskList";
import { ReportStats } from "../../components/auditorias/preliminary-report/ReportStats";
import { ReportPdfSection } from "../../components/auditorias/preliminary-report/ReportPdfSection";
import { findingService, Finding } from "../../services/findingService";

export const PreliminaryReport: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { auditoria, loading } = useAuditoriaDetalle(id);
    const [findings, setFindings] = useState<Finding[]>([]);

    useEffect(() => {
        if (!auditoria?.id) return;
        findingService.getByAuditoria(auditoria.id).then(setFindings).catch(() => { });
    }, [auditoria?.id]);

    if (loading) return <LoadingState message="Cargando auditoría..." />;
    if (!auditoria) return (
        <div className="flex items-center justify-center min-h-[calc(100vh-5rem)]">
            <p className="text-gray-500">No se encontró la auditoría</p>
        </div>
    );

    const empresaNombre = auditoria.empresa?.razon_social || auditoria.razon_social || `Auditoría #${auditoria.id}`;

    return (
        <div className="py-4 px-3 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <button
                    onClick={() => navigate("/auditorias")}
                    className="flex items-center text-gray-600 hover:text-gray-900 text-sm"
                >
                    <svg className="h-5 w-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Volver a auditorías
                </button>
                <div className="text-right">
                    <h1 className="text-xl font-semibold text-gray-800">Informe Preliminar</h1>
                    <p className="text-sm text-gray-400">{empresaNombre}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ReportTaskList auditoria={auditoria} findings={findings} />
                <ReportPdfSection auditoriaId={id!} />
            </div>

            <div className="mt-6">
                <ReportStats auditoria={auditoria} findings={findings} />
            </div>
        </div>
    );
};
