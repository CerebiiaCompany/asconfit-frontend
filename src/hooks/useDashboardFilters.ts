import { useState, useEffect } from "react";
import { empresaService, Empresa } from "../services/empresaService";
import { userService, User } from "../services/userService";

export interface DashboardFilter {
    empresa_id?: number;
    delegado_id?: number;
    fecha_desde?: string;
    fecha_hasta?: string;
}

export const useDashboardFilters = () => {
    const [filters, setFilters] = useState<DashboardFilter>({});
    const [empresas, setEmpresas] = useState<Empresa[]>([]);
    const [delegados, setDelegados] = useState<User[]>([]);
    const [loadingOptions, setLoadingOptions] = useState(true);

    useEffect(() => {
        Promise.all([empresaService.getAll(), userService.getDelegados()])
            .then(([emps, dels]) => {
                setEmpresas(emps);
                setDelegados(dels);
            })
            .catch(console.error)
            .finally(() => setLoadingOptions(false));
    }, []);

    const updateFilter = <K extends keyof DashboardFilter>(
        key: K,
        value: DashboardFilter[K],
    ) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value === "" || value === 0 ? undefined : value,
        }));
    };

    const clearFilters = () => setFilters({});

    const activeCount = Object.values(filters).filter(
        (v) => v !== undefined && v !== "",
    ).length;

    return {
        filters,
        empresas,
        delegados,
        loadingOptions,
        updateFilter,
        clearFilters,
        activeCount,
    };
};
