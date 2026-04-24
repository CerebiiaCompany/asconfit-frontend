import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Sparkles, Brain, AlertTriangle, Rocket, LayoutGrid } from 'lucide-react';
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

// ── Dropdown genérico estilo hallazgos ─────────────────────────────────────
interface DropdownProps {
    label: string;
    placeholder: string;
    value: string;
    options: { value: string; label: string }[];
    onChange: (val: string) => void;
    disabled?: boolean;
}

function StyledDropdown({ label, placeholder, value, options, onChange, disabled }: DropdownProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const displayText = value
        ? options.find(o => o.value === value)?.label ?? value
        : placeholder;

    return (
        <div ref={ref} className="flex flex-col gap-1 relative">
            <label className="text-sm font-medium text-gray-600">{label}</label>
            <button
                type="button"
                disabled={disabled}
                onClick={() => !disabled && setOpen(o => !o)}
                className={`flex items-center justify-between px-4 py-2.5 border rounded-lg text-sm bg-white focus:outline-none transition-all
                    ${disabled
                        ? 'border-gray-100 bg-gray-100 text-gray-400 cursor-not-allowed'
                        : open
                            ? 'border-orange-400 ring-2 ring-orange-400/20 text-gray-700 cursor-pointer'
                            : 'border-gray-200 text-gray-700 hover:border-orange-300 cursor-pointer'
                    }`}
            >
                <span className="truncate">{displayText}</span>
                <svg
                    className={`w-4 h-4 ml-2 text-gray-400 transition-transform shrink-0 ${open ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {open && (
                <div className="absolute top-full left-0 mt-1 z-20 bg-white border border-gray-200 rounded-lg shadow-lg min-w-full py-1">
                    {value && (
                        <button
                            type="button"
                            onClick={() => { onChange(''); setOpen(false); }}
                            className="w-full text-left px-3 py-1.5 text-xs text-orange-500 hover:bg-orange-50 border-b border-gray-100"
                        >
                            Limpiar selección
                        </button>
                    )}
                    {options.map(opt => (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => { onChange(opt.value); setOpen(false); }}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors
                                ${opt.value === value ? 'text-orange-500 font-medium bg-orange-50/50' : 'text-gray-700'}`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

// ── Página principal ───────────────────────────────────────────────────────
const AIAnalysis: React.FC = () => {
    const { empresas } = useEmpresas();
    const { auditorias } = useAuditorias();
    const [selectedCompany, setSelectedCompany] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [analysisData, setAnalysisData] = useState<{ resumen: string, alertas: PredictiveAlert[] } | null>(null);
    const [error, setError] = useState<string | null>(null);

    const availableTypes = useMemo(() => {
        if (!selectedCompany) return [];
        const companyAudits = auditorias.filter(a => String(a.empresa_id) === selectedCompany);
        const types = companyAudits.map(a => a.tipo_auditoria).filter((t): t is string => !!t);
        return Array.from(new Set(types));
    }, [selectedCompany, auditorias]);

    const handleCompanyChange = (val: string) => {
        setSelectedCompany(val);
        setSelectedType('');
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
                    <StyledDropdown
                        label="Empresa"
                        placeholder="Seleccionar empresa..."
                        value={selectedCompany}
                        options={empresaOptions}
                        onChange={handleCompanyChange}
                    />
                    <StyledDropdown
                        label="Tipo de Auditoría"
                        placeholder={selectedCompany ? 'Seleccionar tipo...' : 'Primero elige una empresa'}
                        value={selectedType}
                        options={typeOptions}
                        onChange={setSelectedType}
                        disabled={!selectedCompany}
                    />
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm font-medium">{error}</p>
                </div>
            )}

            {showResults && !isAnalyzing && analysisData && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                        <div className="flex items-center gap-2 mb-4 text-gray-700 font-semibold">
                            <Sparkles className="w-5 h-5 text-orange-400" />
                            Resumen del Análisis
                        </div>
                        <p className="text-gray-600 leading-relaxed bg-orange-50/30 p-4 rounded-lg border border-orange-100/30">
                            {analysisData.resumen}
                        </p>
                    </div>

                    <div className="mb-4 text-gray-700 font-semibold flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                        Alertas Predictivas
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {analysisData.alertas.map((alert) => (
                            <div key={alert.id} className={`border rounded-xl p-5 transition-all hover:shadow-md ${getAlertColor(alert.level)}`}>
                                <div className="flex justify-between items-start mb-3">
                                    <div className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${getBadgeColor(alert.level)}`}>
                                        {alert.level}
                                    </div>
                                    <div className="text-sm font-bold opacity-60">{alert.probability} prob.</div>
                                </div>
                                <h3 className="font-bold text-gray-800 mb-2 leading-tight">{alert.title}</h3>
                                <p className="text-xs text-gray-600 mb-4 leading-relaxed">{alert.description}</p>
                                <span className="text-[10px] bg-white/50 px-2 py-1 rounded text-gray-500 font-medium">{alert.area}</span>
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
