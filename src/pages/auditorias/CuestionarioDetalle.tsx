import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ExcelJS from 'exceljs';
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
    criticidad: 'alto' | 'medio' | 'bajo' | '';
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
            await generarExcel(data);
            addToast('Cuestionario descargado correctamente', 'success');
        } catch {
            addToast('Error al descargar el cuestionario', 'error');
        } finally {
            setDownloading(false);
        }
    };

    const generarExcel = async (data: any) => {
        const workbook = new ExcelJS.Workbook();
        const ws = workbook.addWorksheet('Cuestionario');

        // ── Anchos de columnas (igual que el formato original) ──────────────
        ws.columns = [
            { width: 70 },  // A: Pregunta
            { width: 14 },  // B: Respuesta (Si / No / N/A combinadas)
            { width: 6 },  // C: Sí
            { width: 6 },  // D: No
            { width: 6 },  // E: N/A
            { width: 35 },  // F: Observaciones
            { width: 35 },  // G: Recomendaciones
        ];

        // ── Colores ─────────────────────────────────────────────────────────
        const NARANJA = 'FFFF6600';
        const GRIS_OSC = 'FF404040';
        const VERDE = 'FF70AD47';
        const ROJO = 'FFFF0000';
        const GRIS_CLR = 'FFD9D9D9';
        const BLANCO = 'FFFFFFFF';
        const AZUL_HDR = 'FFFF6600'; // naranja

        const centrado: Partial<ExcelJS.Alignment> = { horizontal: 'center', vertical: 'middle', wrapText: true };
        const izquierda: Partial<ExcelJS.Alignment> = { horizontal: 'left', vertical: 'middle', wrapText: true };

        const fill = (argb: string): ExcelJS.Fill => ({
            type: 'pattern', pattern: 'solid', fgColor: { argb },
        });
        const borde = (): Partial<ExcelJS.Borders> => ({
            top: { style: 'thin', color: { argb: 'FFB0B0B0' } },
            bottom: { style: 'thin', color: { argb: 'FFB0B0B0' } },
            left: { style: 'thin', color: { argb: 'FFB0B0B0' } },
            right: { style: 'thin', color: { argb: 'FFB0B0B0' } },
        });

        // ── Fila 1: Título ───────────────────────────────────────────────────
        ws.mergeCells('A1:G1');
        const r1 = ws.getRow(1);
        r1.height = 30;
        r1.getCell(1).value = data.cuestionario;
        r1.getCell(1).font = { bold: true, size: 14, color: { argb: BLANCO } };
        r1.getCell(1).fill = fill(NARANJA);
        r1.getCell(1).alignment = centrado;

        // ── Fila 2: Opciones Si / No / NA ────────────────────────────────────
        ws.mergeCells('A2:D2');
        ws.getRow(2).height = 18;
        ws.getCell('E2').value = 'Si';
        ws.getCell('F2').value = 'No';
        ws.getCell('G2').value = 'N/A';
        ['E2', 'F2', 'G2'].forEach(addr => {
            ws.getCell(addr).font = { bold: true, color: { argb: BLANCO } };
            ws.getCell(addr).fill = fill(GRIS_OSC);
            ws.getCell(addr).alignment = centrado;
        });

        // ── Fila 3: Nombre cuestionario ──────────────────────────────────────
        ws.mergeCells('A3:G3');
        ws.getRow(3).height = 18;
        ws.getCell('A3').value = data.cuestionario;
        ws.getCell('A3').font = { bold: true, size: 11 };
        ws.getCell('A3').alignment = centrado;

        // ── Fila 4: Fecha ────────────────────────────────────────────────────
        ws.mergeCells('A4:B4');
        ws.getCell('A4').value = `Fecha de Elaboración: ${data.fecha}`;
        ws.getCell('A4').font = { bold: true };
        ws.getRow(4).height = 16;

        // ── Fila 5: Objetivo ─────────────────────────────────────────────────
        ws.mergeCells('A5:G5');
        ws.getRow(5).height = 32;
        ws.getCell('A5').value = `Objetivo: ${data.objetivo}`;
        ws.getCell('A5').alignment = { wrapText: true, vertical: 'middle' };
        ws.getCell('A5').fill = fill('FFFFF2CC');

        // ── Fila 6: Empresa ──────────────────────────────────────────────────
        ws.mergeCells('A6:G6');
        ws.getRow(6).height = 18;
        ws.getCell('A6').value = `${data.empresa || ''} · NIT: ${data.nit || ''}`;
        ws.getCell('A6').font = { bold: true };
        ws.getCell('A6').fill = fill(GRIS_CLR);
        ws.getCell('A6').alignment = centrado;

        // ── Fila 7: Cuestionario de control interno / Entrevistado ───────────
        ws.mergeCells('A7:G7');
        ws.getRow(7).height = 16;
        ws.getCell('A7').value = 'Cuestionario de control interno';
        ws.getCell('A7').font = { bold: true };
        ws.getCell('A7').alignment = centrado;

        // ── Fila 8: vacía de separación ──────────────────────────────────────
        ws.getRow(8).height = 10;

        // ── Encabezados de tabla ─────────────────────────────────────────────
        const hdrRow = ws.getRow(9);
        hdrRow.height = 20;
        const hdrs = ['Pregunta', '', 'Si', 'No', 'N/A', 'Observaciones', 'Recomendaciones'];
        hdrs.forEach((h, i) => {
            const cell = hdrRow.getCell(i + 1);
            cell.value = h;
            cell.font = { bold: true, color: { argb: BLANCO } };
            cell.fill = fill(AZUL_HDR);
            cell.alignment = centrado;
            cell.border = borde();
        });

        // ── Filas de preguntas ───────────────────────────────────────────────
        let rowNum = 10;
        let seccionActual = '';

        for (const fila of data.filas) {
            // Fila de sección
            if (fila.seccion !== seccionActual) {
                seccionActual = fila.seccion;
                ws.mergeCells(`A${rowNum}:G${rowNum}`);
                const secRow = ws.getRow(rowNum);
                secRow.height = 18;
                secRow.getCell(1).value = seccionActual;
                secRow.getCell(1).font = { bold: true, color: { argb: BLANCO } };
                secRow.getCell(1).fill = fill(NARANJA);
                secRow.getCell(1).alignment = { horizontal: 'left', vertical: 'middle' };
                secRow.getCell(1).border = borde();
                rowNum++;
            }

            const esSi = fila.respuesta === 'SI';
            const esNo = fila.respuesta === 'NO';
            const esNA = fila.respuesta === 'NA';

            const pRow = ws.getRow(rowNum);
            pRow.height = 36;

            // A: Pregunta
            pRow.getCell(1).value = fila.pregunta;
            pRow.getCell(1).alignment = { ...izquierda, wrapText: true };
            pRow.getCell(1).border = borde();

            // B: vacía
            pRow.getCell(2).border = borde();

            // C: Sí
            pRow.getCell(3).value = esSi ? '✓' : '';
            pRow.getCell(3).alignment = centrado;
            pRow.getCell(3).font = { bold: true, color: { argb: esSi ? VERDE : 'FF000000' } };
            pRow.getCell(3).border = borde();
            if (esSi) pRow.getCell(3).fill = fill('FFE2EFDA');

            // D: No
            pRow.getCell(4).value = esNo ? '✓' : '';
            pRow.getCell(4).alignment = centrado;
            pRow.getCell(4).font = { bold: true, color: { argb: esNo ? ROJO : 'FF000000' } };
            pRow.getCell(4).border = borde();
            if (esNo) pRow.getCell(4).fill = fill('FFFFC7CE');

            // E: N/A
            pRow.getCell(5).value = esNA ? '✓' : '';
            pRow.getCell(5).alignment = centrado;
            pRow.getCell(5).font = { bold: true, color: { argb: esNA ? '666666' : 'FF000000' } };
            pRow.getCell(5).border = borde();
            if (esNA) pRow.getCell(5).fill = fill(GRIS_CLR);

            // F: Observaciones
            pRow.getCell(6).value = fila.observaciones || '';
            pRow.getCell(6).alignment = { ...izquierda, wrapText: true };
            pRow.getCell(6).border = borde();

            // G: Recomendaciones
            pRow.getCell(7).value = fila.recomendaciones || '';
            pRow.getCell(7).alignment = { ...izquierda, wrapText: true };
            pRow.getCell(7).border = borde();

            // Alternar fondo de filas
            if (rowNum % 2 === 0) {
                [1, 2, 6, 7].forEach(col => {
                    if (!pRow.getCell(col).fill || (pRow.getCell(col).fill as any).fgColor?.argb === BLANCO) {
                        pRow.getCell(col).fill = fill('FFF5F5F5');
                    }
                });
            }

            rowNum++;
        }

        // ── Descargar ────────────────────────────────────────────────────────
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${data.cuestionario} - ${data.empresa || 'Empresa'}.xlsx`;
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
                                Descargar Excel
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
                            <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3">
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
                                                        className={`w-10 h-8 rounded-lg text-xs font-bold border-2 transition-all ${pregunta.respuesta === opcion
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
