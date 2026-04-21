import { useEffect, useMemo, useState } from "react";
import { findingService, Finding } from "../services/findingService";
import { empresaService, Empresa } from "../services/empresaService";

export function useFindingsPage() {
    const [findings, setFindings] = useState<Finding[]>([]);
    const [empresas, setEmpresas] = useState<Empresa[]>([]);
    const [loading, setLoading] = useState(true);
    // "all" = todas seleccionadas por defecto (se inicializa tras cargar)
    const [empresaFilter, setEmpresaFilter] = useState<string[]>([]);
    const [sevFilter, setSevFilter] = useState<string[]>([]);
    const [tipoAuditoriaFilter, setTipoAuditoriaFilter] = useState<string[]>([]);

    useEffect(() => {
        Promise.all([findingService.getAll(), empresaService.getAll()])
            .then(([f, e]) => {
                setFindings(f);
                setEmpresas(e);
                // Por defecto todas las empresas seleccionadas
                setEmpresaFilter(e.map(emp => emp.id?.toString() ?? ""));
            })
            .finally(() => setLoading(false));
    }, []);

    // Tipos de auditoría disponibles según las empresas seleccionadas
    const tiposAuditoria = useMemo(() => {
        if (empresaFilter.length === 0) return [];
        const set = new Set<string>();
        findings.forEach(f => {
            const empId = f.auditoria?.empresa?.id?.toString() ?? "";
            if (empresaFilter.includes(empId) && f.auditoria?.tipo_auditoria) {
                set.add(f.auditoria.tipo_auditoria);
            }
        });
        return Array.from(set).sort();
    }, [findings, empresaFilter]);

    // Cuando cambian los tipos disponibles, limpiar selección de tipos que ya no aplican
    useEffect(() => {
        setTipoAuditoriaFilter(prev => prev.filter(t => tiposAuditoria.includes(t)));
    }, [tiposAuditoria]);

    const filtered = useMemo(() => {
        // Sin empresas seleccionadas → sin resultados
        if (empresaFilter.length === 0) return [];

        return findings.filter(f => {
            const empId = f.auditoria?.empresa?.id?.toString() ?? "";
            if (!empresaFilter.includes(empId)) return false;
            if (sevFilter.length > 0 && !sevFilter.includes(f.severidad)) return false;
            if (tipoAuditoriaFilter.length > 0) {
                const tipo = f.auditoria?.tipo_auditoria ?? "";
                if (!tipoAuditoriaFilter.includes(tipo)) return false;
            }
            return true;
        });
    }, [findings, empresaFilter, sevFilter, tipoAuditoriaFilter]);

    const stats = useMemo(() => ({
        abiertos: filtered.filter(f => !f.fecha_limite || new Date(f.fecha_limite) >= new Date()).length,
        enProceso: filtered.filter(f => f.responsable && f.fecha_limite).length,
        cerrados: filtered.filter(f => f.fecha_limite && new Date(f.fecha_limite) < new Date()).length,
        criticos: filtered.filter(f => f.severidad === "critico").length,
        graves: filtered.filter(f => f.severidad === "grave").length,
        leves: filtered.filter(f => f.severidad === "leve").length,
    }), [filtered]);

    const barData = useMemo(() => {
        const count: Record<string, number> = {};
        filtered.forEach(f => {
            const name = f.actividad?.nombre ?? "Sin actividad";
            count[name] = (count[name] ?? 0) + 1;
        });
        return Object.entries(count)
            .map(([label, value]) => ({ label, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 6);
    }, [filtered]);

    return {
        loading,
        empresas,
        tiposAuditoria,
        filtered,
        stats,
        barData,
        empresaFilter, setEmpresaFilter,
        sevFilter, setSevFilter,
        tipoAuditoriaFilter, setTipoAuditoriaFilter,
    };
}
