import React, { useState, useMemo } from 'react';
import { Sparkles, Brain, AlertTriangle, ChevronDown, Rocket, LayoutGrid } from 'lucide-react';
import { useEmpresas } from '../hooks/useEmpresas';
import { useAuditorias } from '../hooks/useAuditorias';
import { auditoriaService } from '../services/auditoriaService';

interface PredictiveAlert {
    id: number;
    level: 'CRITICA' | 'ALTA' | 'MEDIA';
    title: string;
    description: string;
    area: string;
    probability: string;
}

const AIAnalysis: React.FC = () => {
    const { empresas } = useEmpresas();
    const { auditorias } = useAuditorias();
    const [selectedCompany, setSelectedCompany] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [analysisData, setAnalysisData] = useState<{ resumen: string, alertas: PredictiveAlert[] } | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Obtener los tipos de auditoría disponibles para la empresa seleccionada
    const availableTypes = useMemo(() => {
        if (!selectedCompany) return [];
        const companyAudits = auditorias.filter(a => String(a.empresa_id) === selectedCompany);
        const types = companyAudits
            .map(a => a.tipo_auditoria)
            .filter((t): t is string => !!t);
        return Array.from(new Set(types));
    }, [selectedCompany, auditorias]);

    const handleCompanyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCompany(e.target.value);
        setSelectedType(''); // Resetear el tipo cuando cambia la empresa
        setShowResults(false);
        setAnalysisData(null);
    };

    const handleExecuteAnalysis = async () => {
        if (!selectedCompany || !selectedType) return;
        
        setIsAnalyzing(true);
        setError(null);
        try {
            const data = await auditoriaService.analizarIA(selectedCompany, selectedType);
            setAnalysisData(data);
            setShowResults(true);
        } catch (err: any) {
            console.error('Error al analizar con IA:', err);
            setError(err.response?.data?.error || 'No se pudo completar el análisis en este momento.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const getAlertColor = (level: string) => {
        switch (level) {
            case 'CRITICA': return 'bg-red-50 text-red-700 border-red-100';
            case 'ALTA': return 'bg-amber-50 text-amber-700 border-amber-100';
            case 'MEDIA': return 'bg-orange-50 text-orange-700 border-orange-100';
            default: return 'bg-gray-50 text-gray-700 border-gray-100';
        }
    };

    const getBadgeColor = (level: string) => {
        switch (level) {
            case 'CRITICA': return 'bg-red-100 text-red-600';
            case 'ALTA': return 'bg-amber-100 text-amber-600';
            case 'MEDIA': return 'bg-orange-100 text-orange-600';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto bg-[#F9FAFB] min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <Brain className="w-8 h-8 text-orange-500" />
                        Análisis de Riesgo Predictivo
                    </h1>
                    <p className="text-gray-500 mt-1">
                        IA que analiza el histórico de hallazgos y detecta patrones de riesgo
                    </p>
                </div>
                <button
                    onClick={handleExecuteAnalysis}
                    disabled={isAnalyzing || !selectedCompany || !selectedType}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold transition-all shadow-sm
                        ${isAnalyzing || !selectedCompany || !selectedType
                            ? 'bg-orange-300 cursor-not-allowed text-white' 
                            : 'bg-orange-400 hover:bg-orange-500 text-white transform hover:-translate-y-0.5'}`}
                >
                    <Rocket className={`w-5 h-5 ${isAnalyzing ? 'animate-bounce' : ''}`} />
                    {isAnalyzing ? 'Procesando...' : 'Ejecutar Análisis IA'}
                </button>
            </div>

            {/* Selection Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                <div className="flex items-center gap-2 mb-6 text-gray-700 font-semibold">
                    <div className="bg-orange-100 p-1.5 rounded-md">
                        <LayoutGrid className="w-5 h-5 text-orange-500" />
                    </div>
                    Seleccionar Empresa y Auditorías
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-600">Empresa</label>
                        <div className="relative">
                            <select
                                value={selectedCompany}
                                onChange={handleCompanyChange}
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-4 pr-10 py-2.5 outline-none focus:ring-2 focus:ring-orange-400/20 transition-all text-gray-700 appearance-none cursor-pointer"
                            >
                                <option value="">Seleccionar empresa...</option>
                                {empresas?.map((enterprise: any) => (
                                    <option key={enterprise.id} value={enterprise.id}>
                                        {enterprise.razon_social}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                                <ChevronDown className="w-4 h-4" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-600">Tipo de Auditoría</label>
                        <div className="relative">
                            <select
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                                disabled={!selectedCompany}
                                className={`w-full border rounded-lg pl-4 pr-10 py-2.5 outline-none transition-all text-gray-700 appearance-none
                                    ${!selectedCompany 
                                        ? 'bg-gray-100 border-gray-100 cursor-not-allowed text-gray-400' 
                                        : 'bg-gray-50 border-gray-200 focus:ring-2 focus:ring-orange-400/20 cursor-pointer'}`}
                            >
                                <option value="">{selectedCompany ? 'Seleccionar tipo...' : 'Primero elige una empresa'}</option>
                                {availableTypes.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                                <ChevronDown className="w-4 h-4" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm font-medium">{error}</p>
                </div>
            )}

            {showResults && !isAnalyzing && analysisData && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Summary Section */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                        <div className="flex items-center gap-2 mb-4 text-gray-700 font-semibold">
                            <Sparkles className="w-5 h-5 text-orange-400" />
                            Resumen del Análisis
                        </div>
                        <p className="text-gray-600 leading-relaxed bg-orange-50/30 p-4 rounded-lg border border-orange-100/30">
                            {analysisData.resumen}
                        </p>
                    </div>

                    {/* Alerts Grid */}
                    <div className="mb-4 text-gray-700 font-semibold flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                        Alertas Predictivas
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {analysisData.alertas.map((alert) => (
                            <div 
                                key={alert.id}
                                className={`border rounded-xl p-5 transition-all hover:shadow-md ${getAlertColor(alert.level)}`}
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-2">
                                        <div className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${getBadgeColor(alert.level)}`}>
                                            {alert.level}
                                        </div>
                                    </div>
                                    <div className="text-sm font-bold opacity-60">
                                        {alert.probability} prob.
                                    </div>
                                </div>
                                <h3 className="font-bold text-gray-800 mb-2 leading-tight">
                                    {alert.title}
                                </h3>
                                <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                                    {alert.description}
                                </p>
                                <div className="flex items-center gap-1">
                                    <span className="text-[10px] bg-white/50 px-2 py-1 rounded text-gray-500 font-medium">
                                        {alert.area}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {!showResults && !isAnalyzing && (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                    <Sparkles className="w-16 h-16 mb-4 opacity-20" />
                    <p>Selecciona una empresa y ejecuta el análisis para ver predicciones</p>
                </div>
            )}
        </div>
    );
};

export default AIAnalysis;
