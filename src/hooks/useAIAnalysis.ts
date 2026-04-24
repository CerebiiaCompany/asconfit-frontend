import { useState, useMemo } from 'react';
import { useAuditorias } from './useAuditorias';
import { auditoriaService } from '../services/auditoriaService';
import { AnalysisResult } from '../types/aiAnalysis';

export function useAIAnalysis() {
    const { auditorias } = useAuditorias();
    const [selectedCompany, setSelectedCompany] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [analysisData, setAnalysisData] = useState<AnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const availableTypes = useMemo(() => {
        if (!selectedCompany) return [];
        const types = auditorias
            .filter(a => String(a.empresa_id) === selectedCompany)
            .map(a => a.tipo_auditoria)
            .filter((t): t is string => !!t);
        return Array.from(new Set(types));
    }, [selectedCompany, auditorias]);

    const handleCompanyChange = (val: string) => {
        setSelectedCompany(val);
        setSelectedType('');
        setShowResults(false);
        setAnalysisData(null);
        setError(null);
    };

    const executeAnalysis = async () => {
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

    return {
        selectedCompany,
        selectedType,
        setSelectedType,
        handleCompanyChange,
        availableTypes,
        isAnalyzing,
        showResults,
        analysisData,
        error,
        executeAnalysis,
    };
}
