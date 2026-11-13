import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { Finding } from "../services/findingService";
import { EditarFindingModal } from "../components/Findings/EditarFindingModal";
import { useFindingsPage } from "../hooks/useFindingsPage";
import { FindingsFilters } from "../components/Findings/FindingsFilters";
import { FindingsStats } from "../components/Findings/FindingsStats";
import { FindingsCharts } from "../components/Findings/FindingsCharts";
import { FindingsTable } from "../components/Findings/FindingsTable";

export const Findings: React.FC = () => {
    const { user } = useAuth();
    const { addToast } = useToast();
    const [editing, setEditing] = useState<Finding | null>(null);

    const {
        loading,
        updateFinding,
        empresas,
        tiposAuditoria,
        filtered,
        stats,
        barData,
        empresaFilter, setEmpresaFilter,
        sevFilter, setSevFilter,
        tipoAuditoriaFilter, setTipoAuditoriaFilter,
    } = useFindingsPage();

    // Misma regla que el backend: puede editar el autor del hallazgo o un admin
    const isAdmin = user?.role?.nombre?.toLowerCase() === "admin";
    const canEdit = (f: Finding) => isAdmin || (!!user && Number(f.user_id) === Number(user.id));

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
                    <FindingsTable findings={filtered} canEdit={canEdit} onEdit={setEditing} />
                </>
            )}

            {editing && (
                <EditarFindingModal
                    finding={editing}
                    onClose={() => setEditing(null)}
                    onSaved={(updated) => {
                        updateFinding(updated);
                        setEditing(null);
                        addToast("Hallazgo actualizado correctamente", "success");
                    }}
                />
            )}
        </div>
    );
};
