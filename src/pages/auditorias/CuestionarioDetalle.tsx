import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { cuestionarioService } from '../../services/cuestionarioService';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { LoadingState } from '../../components/common/LoadingState';
import { useToast } from '../../contexts/ToastContext';

type Respuesta = 'si' | 'no' | 'na' | '';

interface Pregunta {
    id: number;
    pregunta: string;
    orden: number;
    respuesta: Respuesta;
    observaciones: string;
    recomendaciones: string;
}

interface Seccion {
    id: number;
    titulo: string;
    orden: number;
    preguntas: Pregunta[];
}

export const CuestionarioDetalle: React.FC = () => {
    const { id: auditoriaId, cuestionarioId } = useParams<{ id: string; cuestionarioId: string }>();
    const navigate = useNavigate();
    const { addToast } = useToast();

    const [cuestionario, setCuestionario] = useState<any>(null);
    const [auditoria, setAuditoria] = useState<any>(null);
    const [secciones, setSecciones] = useState<Seccion[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [downloading, setDownloading] = useState(false);

    const cargar = useCallback(async () => {
        try {
            const data = await cuestionarioService.getCuestionario(
                Number(cuestionarioId),
                auditoriaId!
            );
            setCuestionario(data.cuestionario);
            setAuditoria(data.auditoria);
            // Normalizar respuestas al estado local
            const secsNormalizadas: Seccion[] = data.cuestionario.secciones.map((s: any) => ({
                ...s,
                preguntas: s.preguntas.map((p: any) => ({
                    ...p,
                    respuesta: p.respuesta || '',
                    observaciones: p.observaciones || '',
                    recomendaciones: p.recomendaciones || '',
                })),
            }));
            setSecciones(secsNormalizadas);
        } catch {
            addToast('No se pudo cargar el cuestionario', 'error');
        } finally {
            setLoading(false);
        }
    }, [cuestionarioId, auditoriaId]);

    useEffect(() => { cargar(); }, [cargar]);

    const handleRespuesta = (seccionIdx: number, preguntaIdx: number, valor: Respuesta) => {
        setSecciones(prev => prev.map((s, si) =>
            si !== seccionIdx ? s : {
                ...s,
                preguntas: s.preguntas.map((p, pi) =>
                    pi !== preguntaIdx ? p : { ...p, respuesta: valor }
                )
            }
        ));
    };

    const handleObservacion = (seccionIdx: number, preguntaIdx: number, campo: 'observaciones' | 'recomendaciones', valor: string) => {
        setSecciones(prev => prev.map((s, si) =>
            si !== seccionIdx ? s : {
                ...s,
                preguntas: s.preguntas.map((p, pi) =>
                    pi !== preguntaIdx ? p : { ...p, [campo]: valor }
                )
            }
        ));
    };

    const handleGuardar = async () => {
        try {
            setSaving(true);
            const respuestas = secciones.flatMap(s =>
                s.preguntas.map(p => ({
                    pregunta_id: p.id,
                    respuesta: p.respuesta || null,
                    observaciones: p.observaciones || null,
                    recomendaciones: p.recomendaciones || null,
                }))
            );
            await cuestionarioService.saveRespuestas(Number(cuestionarioId), auditoriaId!, respuestas);
            addToast('Respuestas guardadas correctamente', 'success');
        } catch {
            addToast('Error al guardar las respuestas', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleDescargar = async () => {
        try {
            setDownloading(true);
            // Guardar primero
            const respuestas = secciones.flatMap(s =>
                s.preguntas.map(p => ({
                    pregunta_id: p.id,
                    respuesta: p.respuesta || null,
                    observaciones: p.observaciones || null,
                    recomendaciones: p.recomendaciones || null,
                }))
            );
            await cuestionarioService.saveRespuestas(Number(cuestionarioId), auditoriaId!, respuestas);

            // Obtener datos para exportar
            const data = await cuestionarioService.exportar(Number(cuestionarioId), auditoriaId!);
            generarCSV(data);
            addToast('Cuestionario descargado correctamente', 'success');
        } catch {
            addToast('Error al descargar el cuestionario', 'error');
        } finally {
            setDownloading(false);
        }
    };

    const generarCSV = (data: any) => {
        const BOM = '\uFEFF';
        const filas: string[][] = [];

        // Encabezado
        filas.push([data.cuestionario]);
        filas.push(['Empresa:', data.empresa || '']);
        filas.push(['NIT:', data.nit || '']);
        filas.push(['Fecha:', data.fecha]);
        filas.push(['Objetivo:', data.objetivo || '']);
        filas.push([]);
        filas.push(['Sección', 'Pregunta', 'Si', 'No', 'N/A', 'Observaciones', 'Recomendaciones']);

        let seccionActual = '';
        for (const fila of data.filas) {
            const esSi = fila.respuesta === 'SI' ? '✓' : '';
            const esNo = fila.respuesta === 'NO' ? '✓' : '';
            const esNA = fila.respuesta === 'NA' ? '✓' : '';
            const seccion = fila.seccion !== seccionActual ? fila.seccion : '';
            seccionActual = fila.seccion;
            filas.push([seccion, fila.pregunta, esSi, esNo, esNA, fila.observaciones, fila.recomendaciones]);
        }

        const csv = BOM + filas.map(r =>
            r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(';')
        ).join('\r\n');

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${data.cuestionario} - ${data.empresa || 'Empresa'}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const totalPreguntas = secciones.reduce((acc, s) => acc + s.preguntas.length, 0);
    const respondidas = secciones.reduce((acc, s) => acc + s.preguntas.filter(p => p.respuesta).length, 0);
    const porcentaje = totalPreguntas > 0 ? Math.round((respondidas / totalPreguntas) * 100) : 0;

    if (loading) return <LoadingState message="Cargando cuestionario..." />;

    const breadcrumbItems = [
        { label: 'Auditorías', onClick: () => navigate('/auditorias') },
        { label: `Auditoría ${auditoriaId}`, onClick: () => navigate(`/auditorias/${auditoriaId}`) },
        { label: 'Cuestionarios', onClick: () => navigate(`/auditorias/${auditoriaId}/cuestionarios`) },
        { label: cuestionario?.nombre || '', isActive: true },
    ];

    return (
        <div className="pb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto pt-8">
                <Breadcrumb items={breadcrumbItems} />

                {/* Header */}
                <div className="mb-6 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-xl font-bold text-gray-800">{cuestionario?.nombre}</h1>
                            {auditoria && (
                                <p className="text-sm text-gray-500 mt-1">
                                    {auditoria.empresa} · NIT {auditoria.nit}
                                </p>
                            )}
                            {cuestionario?.objetivo && (
                                <p className="text-xs text-gray-400 mt-1 max-w-xl">{cuestionario.objetivo}</p>
                            )}
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                            <button
                                onClick={handleGuardar}
                                disabled={saving}
                                className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium disabled:opacity-50"
                            >
                                {saving ? (
                                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                ) : (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                                Guardar
                            </button>
                            <button
                                onClick={handleDescargar}
                                disabled={downloading}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium disabled:opacity-50"
                            >
                                {downloading ? (
                                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                ) : (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                )}
                                Descargar CSV
                            </button>
                        </div>
                    </div>

                    {/* Barra de progreso */}
                    <div className="mt-4">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>{respondidas} de {totalPreguntas} preguntas respondidas</span>
                            <span>{porcentaje}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                            <div
                                className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${porcentaje}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Secciones y preguntas */}
                <div className="space-y-6">
                    {secciones.map((seccion, si) => (
                        <div key={seccion.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3">
                                <h2 className="text-white font-semibold text-sm">{seccion.titulo}</h2>
                            </div>

                            <div className="divide-y divide-gray-100">
                                {seccion.preguntas.map((pregunta, pi) => (
                                    <div key={pregunta.id} className="p-4">
                                        {/* Pregunta + botones */}
                                        <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                                            <p className="flex-1 text-sm text-gray-800 leading-relaxed">
                                                <span className="text-gray-400 mr-2 text-xs font-mono">
                                                    {String(pi + 1).padStart(2, '0')}
                                                </span>
                                                {pregunta.pregunta}
                                            </p>
                                            <div className="flex gap-2 flex-shrink-0">
                                                {(['si', 'no', 'na'] as const).map((opcion) => (
                                                    <button
                                                        key={opcion}
                                                        onClick={() => handleRespuesta(si, pi, pregunta.respuesta === opcion ? '' : opcion)}
                                                        className={`w-10 h-8 rounded-lg text-xs font-bold border-2 transition-all ${
                                                            pregunta.respuesta === opcion
                                                                ? opcion === 'si'
                                                                    ? 'bg-green-500 border-green-500 text-white'
                                                                    : opcion === 'no'
                                                                        ? 'bg-red-500 border-red-500 text-white'
                                                                        : 'bg-gray-400 border-gray-400 text-white'
                                                                : 'bg-white border-gray-200 text-gray-500 hover:border-gray-400'
                                                        }`}
                                                    >
                                                        {opcion === 'na' ? 'N/A' : opcion.toUpperCase()}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Observaciones y recomendaciones */}
                                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-xs text-gray-400 mb-1">Observaciones</label>
                                                <textarea
                                                    value={pregunta.observaciones}
                                                    onChange={(e) => handleObservacion(si, pi, 'observaciones', e.target.value)}
                                                    rows={2}
                                                    className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-400 resize-none bg-gray-50"
                                                    placeholder="Observaciones..."
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-400 mb-1">Recomendaciones</label>
                                                <textarea
                                                    value={pregunta.recomendaciones}
                                                    onChange={(e) => handleObservacion(si, pi, 'recomendaciones', e.target.value)}
                                                    rows={2}
                                                    className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-400 resize-none bg-gray-50"
                                                    placeholder="Recomendaciones..."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Botones al final */}
                <div className="mt-8 flex justify-end gap-3">
                    <button
                        onClick={handleGuardar}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium disabled:opacity-50"
                    >
                        {saving ? 'Guardando...' : 'Guardar respuestas'}
                    </button>
                    <button
                        onClick={handleDescargar}
                        disabled={downloading}
                        className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
                    >
                        {downloading ? 'Descargando...' : 'Descargar CSV'}
                    </button>
                </div>
            </div>
        </div>
    );
};
