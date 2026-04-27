import React from "react";
import { useFindingsPage } from "../hooks/useFindingsPage";
import { FindingsFilters } from "../components/Findings/FindingsFilters";
import { FindingsStats } from "../components/Findings/FindingsStats";
import { FindingsCharts } from "../components/Findings/FindingsCharts";
import { FindingsTable } from "../components/Findings/FindingsTable";

export const Findings: React.FC = () => {
    const {
        loading,
        empresas,
        tiposAuditoria,
        filtered,
        stats,
        barData,
        empresaFilter, setEmpresaFilter,
        sevFilter, setSevFilter,
        tipoAuditoriaFilter, setTipoAuditoriaFilter,
    } = useFindingsPage();

    return (
        <div className="py-4 px-3 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-[32px] font-bold text-slate-800 tracking-tight">Hallazgos</h1>
                    <p className="text-sm text-gray-400 mt-0.5">Gestión y seguimiento de hallazgos de auditoría</p>
                </div>
            </div>

            <FindingsFilters
                empresas={empresas}
                tiposAuditoria={tiposAuditoria}
                empresaFilter={empresaFilter}
                sevFilter={sevFilter}
                tipoAuditoriaFilter={tipoAuditoriaFilter}
                onEmpresaChange={setEmpresaFilter}
                onSevChange={setSevFilter}
                onTipoChange={setTipoAuditoriaFilter}
            />

            {loading ? (
                <div className="py-16 flex flex-col items-center gap-3">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500" />
                    <p className="text-gray-500 text-sm">Cargando hallazgos...</p>
                </div>
            ) : (
                <>
                    <FindingsStats
                        abiertos={stats.abiertos}
                        enProceso={stats.enProceso}
                        cerrados={stats.cerrados}
                    />
                    <FindingsCharts
                        criticos={stats.criticos}
                        graves={stats.graves}
                        leves={stats.leves}
                        barData={barData}
                    />
                    <FindingsTable findings={filtered} />
                </>
            )}
        </div>
    );
};
