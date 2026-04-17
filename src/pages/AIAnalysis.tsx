import React, { useState, useMemo } from 'react';
import { Sparkles, Brain, AlertTriangle, ChevronDown, Rocket, LayoutGrid } from 'lucide-react';
import { useEmpresas } from '../hooks/useEmpresas';
import { useAuditorias } from '../hooks/useAuditorias';

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
    };

    const alerts: PredictiveAlert[] = [
        {
            id: 1,
            level: 'CRITICA',
            title: 'Alta probabilidad de incumplimiento tributario',
            description: 'Se detectan patrones recurrentes de retrasos en declaraciones tributarias. El área tributaria presenta hallazgos en 3 de las últimas 4 auditorías con tendencia creciente.',
            area: 'Tributaria',
            probability: '87%'
        },
        {
            id: 2,
            level: 'CRITICA',
            title: 'Riesgo de fraude en tesorería por falta de controles',
            description: 'La ausencia de segregación de funciones combinada con pagos sin autorización representa un riesgo crítico. Se han identificado 3 hallazgos relacionados en el último año.',
            area: 'Tesorería',
            probability: '82%'
        },
        {
            id: 3,
            level: 'ALTA',
            title: 'Vulnerabilidad en infraestructura tecnológica',
            description: 'El control de accesos deficiente al ERP junto con la falta de backups del servidor principal expone a la organización a pérdida de datos y accesos no autorizados.',
            area: 'TI',
            probability: '75%'
        },
        {
            id: 4,
            level: 'ALTA',
            title: 'Riesgo de pérdida por inventario obsoleto',
            description: 'El inventario sin rotación por más de 12 meses indica posibles pérdidas por obsolescencia. Se recomienda realizar una evaluación de deterioro.',
            area: 'Inventarios',
            probability: '68%'
        },
        {
            id: 5,
            level: 'MEDIA',
            title: 'Deficiencias contractuales recurrentes',
            description: 'La documentación incompleta en contratos podría generar contingencias legales. Se sugiere reforzar el proceso de revisión documental.',
            area: 'Contratos',
            probability: '55%'
        }
    ];

    const handleExecuteAnalysis = () => {
        if (!selectedCompany || !selectedType) return;
        
        setIsAnalyzing(true);
        // Simular tiempo de procesamiento de IA
        setTimeout(() => {
            setIsAnalyzing(false);
            setShowResults(true);
        }, 2000);
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

            {showResults && !isAnalyzing && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Summary Section */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                        <div className="flex items-center gap-2 mb-4 text-gray-700 font-semibold">
                            <Sparkles className="w-5 h-5 text-orange-400" />
                            Resumen del Análisis
                        </div>
                        <p className="text-gray-600 leading-relaxed bg-orange-50/30 p-4 rounded-lg border border-orange-100/30">
                            El análisis de 8 hallazgos históricos revela un patrón preocupante: las áreas de Tesorería y TI concentran el 62% de los hallazgos críticos con tendencia al alza. Se identifican 5 alertas predictivas, siendo las más urgentes el riesgo de incumplimiento tributario (87%) y fraude en tesorería (82%). Se recomienda priorizar la implementación de controles en segregación de funciones y gestión de accesos al ERP.
                        </p>
                    </div>

                    {/* Alerts Grid */}
                    <div className="mb-4 text-gray-700 font-semibold flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                        Alertas Predictivas
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {alerts.map((alert) => (
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
