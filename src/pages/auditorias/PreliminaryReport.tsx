import React, { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuditoriaDetalle } from "../../hooks/useAuditoriaDetalle";
import { LoadingState } from "../../components/common/LoadingState";
import { ReportTaskList } from "../../components/auditorias/preliminary-report/ReportTaskList";
import { ReportPdfUpload } from "../../components/auditorias/preliminary-report/ReportPdfUpload";

export const PreliminaryReport: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { auditoria, loading } = useAuditoriaDetalle(id);
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || file.type !== "application/pdf") return;
        setPdfFile(file);
        setPdfUrl(URL.createObjectURL(file));
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (!file || file.type !== "application/pdf") return;
        setPdfFile(file);
        setPdfUrl(URL.createObjectURL(file));
    };

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

            {/* Two-column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left: task list */}
                <ReportTaskList auditoria={auditoria} />

                {/* Right: PDF upload + preview */}
                <ReportPdfUpload
                    pdfFile={pdfFile}
                    pdfUrl={pdfUrl}
                    fileInputRef={fileInputRef}
                    onFileChange={handleFileChange}
                    onDrop={handleDrop}
                    onClear={() => { setPdfFile(null); setPdfUrl(null); }}
                />
            </div>
        </div>
    );
};
