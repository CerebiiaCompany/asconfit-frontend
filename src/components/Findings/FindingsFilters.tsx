import React from "react";
import { Empresa } from "../../services/empresaService";
import { CheckboxDropdown } from "./CheckboxDropdown";

interface FindingsFiltersProps {
    empresas: Empresa[];
    tiposAuditoria: string[];
    empresaFilter: string[];
    sevFilter: string[];
    tipoAuditoriaFilter: string[];
    onEmpresaChange: (v: string[]) => void;
    onSevChange: (v: string[]) => void;
    onTipoChange: (v: string[]) => void;
}

export function FindingsFilters({
    empresas,
    tiposAuditoria,
    empresaFilter,
    sevFilter,
    tipoAuditoriaFilter,
    onEmpresaChange,
    onSevChange,
    onTipoChange,
}: FindingsFiltersProps) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-5">
            <div className="flex items-center gap-2 mb-3">
                <span className="w-3 h-3 rounded-full bg-orange-400 inline-block" />
                <span className="text-sm font-medium text-gray-700">Filtrar por Empresa y Auditoría</span>
            </div>
            <div className="flex flex-wrap gap-3">
                <CheckboxDropdown
                    label="Empresa"
                    placeholder="Todas las empresas"
                    options={empresas.map(e => ({ value: e.id?.toString() ?? "", label: e.razon_social }))}
                    selected={empresaFilter}
                    onChange={onEmpresaChange}
                />
                <CheckboxDropdown
                    label="Severidad"
                    placeholder="Todas"
                    options={[
                        { value: "critico", label: "Crítico" },
                        { value: "grave", label: "Grave" },
                        { value: "leve", label: "Leve" },
                    ]}
                    selected={sevFilter}
                    onChange={onSevChange}
                />
                {tiposAuditoria.length > 0 && (
                    <CheckboxDropdown
                        label="Tipo de Auditoría"
                        placeholder="Todos los tipos"
                        options={tiposAuditoria.map(t => ({ value: t, label: t }))}
                        selected={tipoAuditoriaFilter}
                        onChange={onTipoChange}
                    />
                )}
            </div>
        </div>
    );
}
