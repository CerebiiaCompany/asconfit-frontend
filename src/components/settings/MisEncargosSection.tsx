import React from "react";
import { userService, Encargo } from "../../services/userService";
import { EncargosList } from "../Users/EncargosList";

/** Encargos del usuario actual, en su propio perfil. */
export const MisEncargosSection: React.FC<{ userId: number }> = ({ userId }) => {
    const [encargos, setEncargos] = React.useState<Encargo[] | null>(null);
    const [error, setError] = React.useState(false);

    React.useEffect(() => {
        userService.getUserProfile(userId)
            .then((p) => setEncargos(p.encargos ?? []))
            .catch(() => setError(true));
    }, [userId]);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-50">
                <p className="text-sm font-semibold text-gray-700">Mis encargos</p>
                <p className="text-xs text-gray-400">
                    Empresas a tu cargo y tu papel en cada auditoría (auditor principal o suplente)
                </p>
            </div>
            <div className="p-4">
            {error ? (
                <p className="text-sm text-red-500">No se pudieron cargar los encargos</p>
            ) : encargos === null ? (
                <p className="text-sm text-gray-400">Cargando...</p>
            ) : (
                <EncargosList encargos={encargos} emptyText="Aún no tienes encargos asignados" />
            )}
            </div>
        </div>
    );
};
