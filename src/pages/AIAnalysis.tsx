import React from 'react';
import { Sparkles, Brain, AlertTriangle, Rocket, LayoutGrid, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { useEmpresas } from '../hooks/useEmpresas';
import { useAIAnalysis } from '../hooks/useAIAnalysis';
import { StyledDropdown } from '../components/AIAnalysis/StyledDropdown';
import { PredictiveAlert, AnalysisResult } from '../types/aiAnalysis';

const SEVERIDAD_COLOR: Record<string, string> = {
    'CRÍTICA': 'bg-red-50 border-red-200 text-red-800',
    'ALTA': 'bg-amber-50 border-amber-200 text-amber-800',
    'MEDIA': 'bg-orange-50 border-orange-200 text-orange-800',
    'BAJA': 'bg-gray-50 border-gray-200 text-gray-700',
};

const SEVERIDAD_BADGE: Record<string, string> = {
    'CRÍTICA': 'bg-red-100 text-red-700',
    'ALTA': 'bg-amber-100 text-amber-700',
    'MEDIA': 'bg-orange-100 text-orange-700',
    'BAJA': 'bg-gray-100 text-gray-600',
};

const GLOBAL_COLOR: Record<string, string> = {
    'CRÍTICO': 'text-red-600 bg-red-50 border-red-200',
    'ALTO': 'text-amber-600 bg-amber-50 border-amber-200',
    'MEDIO': 'text-orange-500 bg-orange-50 border-orange-200',
    'BAJO': 'text-green-600 bg-green-50 border-green-200',
};

const AIAnalysis: React.FC = () => {
    const { empresas } = useEmpresas();
    const {
        selectedCompany, selectedType, setSelectedType,
        handleCompanyChange, availableTypes,
        isAnalyzing, showResults, analysisData, error,
        executeAnalysis,
    } = useAIAnalysis();

    const data = analysisData as AnalysisResult | null;
    const empresaOptions = (empresas ?? []).map((e: any) => ({ value: String(e.id), label: e.razon_social }));
    const typeOptions = availableTypes.map(t => ({ value: t, label: t }));

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto bg-[#F9FAFB] min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <Brain className="w-8 h-8 text-orange-500" />
                        Análisis de Riesgo Predictivo
                    </h1>
                    <p className="text-gray-500 mt-1">IA especializada en normativa colombiana — auditorías, NIIF y Estatuto Tributario</p>
                </div>
                <button
                    onClick={executeAnalysis}
                    disabled={isAnalyzing || !selectedCompany || !selectedType}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold transition-all shadow-sm
                        ${isAnalyzing || !selectedCompany || !selectedType
                            ? 'bg-orange-300 cursor-not-allowed text-white'
                            : 'bg-orange-500 hover:bg-orange-600 text-white transform hover:-translate-y-0.5'}`}
                >
                    <Rocket className={`w-5 h-5 ${isAnalyzing ? 'animate-bounce' : ''}`} />
                    {isAnalyzing ? 'Analizando...' : 'Ejecutar Análisis IA'}
                </button>
            </div>

            {/* Selección */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                <div className="flex items-center gap-2 mb-6 text-gray-700 font-semibold">
                    <div className="bg-orange-100 p-1.5 rounded-md">
                        <LayoutGrid className="w-5 h-5 text-orange-500" />
                    </div>
                    Seleccionar Empresa y Auditorías
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
                    <StyledDropdown label="Empresa" placeholder="Seleccionar empresa..." value={selectedCompany} options={empresaOptions} onChange={handleCompanyChange} />
                    <StyledDropdown label="Tipo de Auditoría" placeholder={selectedCompany ? 'Seleccionar tipo...' : 'Primero elige una empresa'} value={selectedType} options={typeOptions} onChange={setSelectedType} disabled={!selectedCompany} />
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm font-medium">{error}</p>
                </div>
            )}

            {/* Resultados */}
            {showResults && !isAnalyzing && data && (
                <div className="space-y-6">
                    {/* Resumen ejecutivo */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2 text-gray-700 font-semibold">
                                <Sparkles className="w-5 h-5 text-orange-400" />
                                Dictamen Ejecutivo
                            </div>
                            <span className={`text-xs font-bold px-3 py-1 rounded-full border ${GLOBAL_COLOR[data.resumen.calificacion_global] ?? 'text-gray-600 bg-gray-50 border-gray-200'}`}>
                                Riesgo {data.resumen.calificacion_global}
                            </span>
                        </div>
                        <p className="text-gray-600 leading-relaxed bg-orange-50/40 p-4 rounded-lg border border-orange-100/50 mb-4">
                            {data.resumen.sintesis}
                        </p>
                        {data.resumen.areas_exposicion?.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {data.resumen.areas_exposicion.map((area, i) => (
                                    <span key={i} className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-medium">{area}</span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Alertas */}
                    <div>
                        <div className="mb-3 text-gray-700 font-semibold flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-red-400" />
                            Alertas de Riesgo
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {data.alertas.map((alert: PredictiveAlert) => (
                                <div key={alert.id} className={`border rounded-xl p-5 transition-all hover:shadow-md ${SEVERIDAD_COLOR[alert.severidad] ?? 'bg-gray-50 border-gray-200'}`}>
                                    <div className="flex justify-between items-start mb-3">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${SEVERIDAD_BADGE[alert.severidad] ?? 'bg-gray-100 text-gray-600'}`}>
                                            {alert.severidad}
                                        </span>
                                        <span className="text-xs font-semibold opacity-60">{alert.probabilidad} prob.</span>
                                    </div>
                                    <h3 className="font-bold text-gray-800 mb-1 leading-tight">{alert.titulo}</h3>
                                    <p className="text-xs text-gray-600 mb-3 leading-relaxed">{alert.descripcion}</p>
                                    <div className="space-y-1">
                                        <p className="text-[11px] font-semibold text-gray-500">📋 {alert.normativa}</p>
                                        <p className="text-[11px] text-gray-500">⚠️ {alert.impacto}</p>
                                    </div>
                                    <span className="inline-block mt-3 text-[10px] bg-white/60 px-2 py-0.5 rounded text-gray-500 font-medium">{alert.area}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recomendaciones */}
                    {data.recomendaciones && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <div className="flex items-center gap-2 mb-5 text-gray-700 font-semibold">
                                <CheckCircle className="w-5 h-5 text-green-500" />
                                Plan de Acción
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <RecomendacionGroup icon={<AlertTriangle className="w-4 h-4 text-red-500" />} title="Inmediato (0–30 días)" items={data.recomendaciones.inmediato} color="red" />
                                <RecomendacionGroup icon={<Clock className="w-4 h-4 text-amber-500" />} title="Corto plazo (1–3 meses)" items={data.recomendaciones.corto_plazo} color="amber" />
                                <RecomendacionGroup icon={<TrendingUp className="w-4 h-4 text-blue-500" />} title="Mediano plazo (3–12 meses)" items={data.recomendaciones.mediano_plazo} color="blue" />
                            </div>
                        </div>
                    )}
                </div>
            )}

            {!showResults && !isAnalyzing && (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                    <Sparkles className="w-16 h-16 mb-4 opacity-20" />
                    <p>Selecciona una empresa y ejecuta el análisis para ver el dictamen</p>
                </div>
            )}
        </div>
    );
};

const RecomendacionGroup: React.FC<{ icon: React.ReactNode; title: string; items: string[]; color: string }> = ({ icon, title, items, color }) => (
    <div>
        <div className="flex items-center gap-2 mb-3">
            {icon}
            <span className="text-sm font-semibold text-gray-700">{title}</span>
        </div>
        <ul className="space-y-2">
            {items?.map((item, i) => (
                <li key={i} className={`text-xs text-gray-600 bg-${color}-50/50 border border-${color}-100 rounded-lg px-3 py-2 leading-relaxed`}>
                    {item}
                </li>
            ))}
        </ul>
    </div>
);

export default AIAnalysis;
