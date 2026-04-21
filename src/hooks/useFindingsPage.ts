import { useEffect, useMemo, useState } from "react";
import { findingService, Finding } from "../services/findingService";
import { empresaService, Empresa } from "../services/empresaService";

export function useFindingsPage() {
    const [findings, setFindings] = useState<Finding[]>([]);
    const [empresas, setEmpresas] = useState<Empresa[]>([]);
    const [loading, setLoading] = useState(true);
    const [empresaFilter, setEmpresaFilter] = useState<string[]>([]);
    const [sevFilter, setSevFilter] = useState<string[]>([]);
    const [tipoAuditoriaFilter, setTipoAuditoriaFilter] = useState<string[]>([]);

    useEffect(() => {
        Promise.all([findingService.getAll(), empresaService.getAll()])
            .then(([f, e]) => { setFindings(f); setEmpresas(e); })
            .finally(() => setLoading(false));
    }, []);

    const tiposAuditoria = useMemo(() => {
        const set = new Set<string>();
        findings.forEach(f => { if (f.auditoria?.tipo_auditoria) set.add(f.auditoria.tipo_auditoria); });
        return Array.from(set).sort();
    }, [findings]);

    const filtered = useMemo(() => {
        return findings.filter(f => {
            if (empresaFilter.length > 0) {
                const empId = f.auditoria?.empresa?.id?.toString() ?? "";
                if (!empresaFilter.includes(empId)) return false;
            }
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
