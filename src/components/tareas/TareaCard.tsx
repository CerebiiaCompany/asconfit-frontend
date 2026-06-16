import React, { useState, useEffect } from 'react';
import { TareaFlat } from '../../hooks/useTareas';
import { FileUploadButton } from './FileUploadButton';

interface TareaCardProps {
    tarea: TareaFlat;
    onFileUpload: (file: File) => void;
    acceptedFileTypes: string;
    uploading?: boolean;
}

export const TareaCard: React.FC<TareaCardProps> = ({
    tarea,
    onFileUpload,
    acceptedFileTypes,
    uploading = false
}) => {
    const [showNoteModal, setShowNoteModal] = useState(false);
    const [noteText, setNoteText] = useState("");

    // Cargar nota guardada al montar
    useEffect(() => {
        const saved = localStorage.getItem(`nota_subtarea_${tarea.subtareaId}`);
        if (saved) setNoteText(saved);
    }, [tarea.subtareaId]);

    const handleSaveNote = () => {
        localStorage.setItem(`nota_subtarea_${tarea.subtareaId}`, noteText);
        setShowNoteModal(false);
    };

    // Wrapper para manejar el archivo con nombre personalizado
    const handleFileSelect = (file: File, customName?: string) => {
        onFileUpload(file);
    };

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return null;

        try {
            // Manejar formato ISO con zona horaria
            let date: Date;
            if (dateStr.includes("T")) {
                // Formato ISO: 2026-04-28T00:00:00.000000Z
                date = new Date(dateStr);
            } else {
                // Formato simple: 2026-04-28
                date = new Date(dateStr + "T00:00:00");
            }

            if (isNaN(date.getTime())) return dateStr;

            const day = date.getUTCDate();
            const monthNames = [
                "ene", "feb", "mar", "abr", "may", "jun",
                "jul", "ago", "sep", "oct", "nov", "dic"
            ];
            const month = monthNames[date.getUTCMonth()];
            const year = date.getUTCFullYear();

            return `${day} ${month} ${year}`;
        } catch {
            return dateStr;
        }
    };

    // Calcular días hasta el vencimiento
    const getDaysUntilDue = (fechaEntrega: string | null) => {
        if (!fechaEntrega) return null;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dueDate = new Date(fechaEntrega.split('T')[0]);
        dueDate.setHours(0, 0, 0, 0);
        const diffTime = dueDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    // Obtener badge de urgencia
    const getUrgencyBadge = (fechaEntrega: string | null, estadoInformacion: string | null) => {
        // No mostrar badge si ya está aprobado
        if (estadoInformacion === 'aprobado') return null;

        const daysUntilDue = getDaysUntilDue(fechaEntrega);
        if (daysUntilDue === null) return null;

        if (daysUntilDue < 0) {
            return {
                label: 'Vencida',
                color: 'text-red-700',
                bg: 'bg-red-100',
                borderColor: 'border-red-300'
            };
        } else if (daysUntilDue === 0) {
            return {
                label: 'Vence hoy',
                color: 'text-orange-700',
                bg: 'bg-orange-100',
                borderColor: 'border-orange-300'
            };
        } else if (daysUntilDue <= 2) {
            return {
                label: `Vence en ${daysUntilDue} ${daysUntilDue === 1 ? 'día' : 'días'}`,
                color: 'text-yellow-700',
                bg: 'bg-yellow-100',
                borderColor: 'border-yellow-300'
            };
        }
        return null;
    };

    const urgencyBadge = getUrgencyBadge(tarea.fechaEntrega, tarea.estadoInformacion);

    // Lógica para deshabilitar el botón
    // Se deshabilita si está en revisión o ya fue aprobado.
    // También se deshabilita si ya fue recibido para evitar múltiples envíos.
    const isUploadDisabled = ['recibido', 'revision', 'aprobado'].includes(tarea.estadoInformacion || '');

    // Mapeo de estilos para los estados
    const getStatusConfig = (status: string | null) => {
        switch (status?.toLowerCase()) {
            case 'aprobado':
                return { label: 'Aprobado', color: 'text-green-600', bg: 'bg-green-50', borderColor: 'border-green-200' };
            case 'rechazado':
                return { label: 'Rechazado', color: 'text-red-600', bg: 'bg-red-50', borderColor: 'border-red-200' };
            case 'recibido':
                return { label: 'Recibido', color: 'text-blue-600', bg: 'bg-blue-50', borderColor: 'border-blue-200' };
            case 'revision':
                return { label: 'En revisión', color: 'text-yellow-600', bg: 'bg-yellow-50', borderColor: 'border-yellow-200' };
            default:
                return { label: 'Pendiente', color: 'text-orange-600', bg: 'bg-orange-50', borderColor: 'border-orange-200' };
        }
    };

    const statusConfig = getStatusConfig(tarea.estadoInformacion);

    return (
        <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            {/* Información de la categoría */}
            <div className="mb-3 pb-3 border-b border-gray-200 flex justify-between items-center">
                <div className="flex items-center gap-2 text-sm">
                    <svg className="h-4 w-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <span className="font-medium text-blue-600">{tarea.categoriaNombre}</span>
                </div>

                {/* Badge de estado */}
                <div className={`px-2 py-0.5 rounded text-xs font-semibold border ${statusConfig.bg} ${statusConfig.color} ${statusConfig.borderColor}`}>
                    {statusConfig.label}
                </div>
            </div>

            {/* Información de la subtarea */}
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                    <h4 className="font-medium text-gray-800 mb-2">
                        {tarea.subtareaNombre}
                    </h4>
                    <div className="space-y-1">
                        {tarea.formatoArchivo && (
                            <p className="text-sm text-gray-600">
                                <span className="font-medium text-gray-700">Formato requerido:</span>{' '}
                                <span className="text-orange-600 font-semibold">{tarea.formatoArchivo}</span>
                            </p>
                        )}
                        <div className="flex flex-wrap gap-x-6 gap-y-1">
                            {tarea.fechaSolicitud && (
                                <p className="text-sm text-gray-600">
                                    <span className="font-medium text-gray-700">Solicitud:</span> {formatDate(tarea.fechaSolicitud)}
                                </p>
                            )}
                            {tarea.fechaEntrega && (
                                <div className="flex items-center gap-2">
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium text-gray-700">Entrega:</span> {formatDate(tarea.fechaEntrega)}
                                    </p>
                                    {urgencyBadge && (
                                        <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${urgencyBadge.bg} ${urgencyBadge.color} ${urgencyBadge.borderColor}`}>
                                            {urgencyBadge.label}
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                        {tarea.observaciones && (
                            <p className="text-sm text-gray-600">
                                <span className="font-medium text-gray-700">Observaciones:</span> {tarea.observaciones}
                            </p>
                        )}
                    </div>
                </div>

                {/* Botón de subir archivo con lógica de estado */}
                <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2">
                        <FileUploadButton
                            onFileSelect={handleFileSelect}
                            acceptedFileTypes={acceptedFileTypes}
                            hasFile={!!tarea.archivoNombre}
                            uploading={uploading}
                            disabled={isUploadDisabled}
                        />
                        <button
                            onClick={() => setShowNoteModal(true)}
                            className={`p-1.5 rounded-lg border transition-colors ${noteText ? 'border-orange-400 text-orange-500 bg-orange-50' : 'border-gray-300 text-gray-400 hover:border-orange-300 hover:text-orange-400'}`}
                            title={noteText ? "Ver/editar nota" : "Agregar nota"}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                            </svg>
                        </button>
                    </div>

                    {/* Mensaje de ayuda basado en el estado */}
                    {isUploadDisabled && tarea.estadoInformacion === 'aprobado' && (
                        <span className="text-[10px] text-green-600 font-medium">Información aprobada</span>
                    )}
                    {isUploadDisabled && (tarea.estadoInformacion === 'recibido' || tarea.estadoInformacion === 'revision') && (
                        <span className="text-[10px] text-blue-600 font-medium">En espera de revisión</span>
                    )}
                    {tarea.estadoInformacion === 'rechazado' && (
                        <span className="text-[10px] text-red-600 font-medium italic">Por favor, sube el archivo corregido</span>
                    )}
                </div>
            </div>

            {/* Modal de nota */}
            {showNoteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                            <div>
                                <h3 className="text-base font-semibold text-gray-800">Nota de Tarea</h3>
                                <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{tarea.subtareaNombre}</p>
                            </div>
                            <button onClick={() => setShowNoteModal(false)} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-5">
                            <textarea
                                autoFocus
                                value={noteText}
                                onChange={e => setNoteText(e.target.value)}
                                placeholder="Escribe una nota para esta tarea..."
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                                rows={6}
                            />
                            <div className="flex gap-3 mt-4">
                                <button onClick={() => setShowNoteModal(false)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">
                                    Cancelar
                                </button>
                                <button onClick={handleSaveNote} className="flex-1 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-semibold">
                                    Guardar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
