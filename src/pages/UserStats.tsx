import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import { api } from "../services/api";

interface AuditoriaStats {
    id: number;
    titulo: string;
    empresa_nombre: string;
    total_tareas: number;
    tareas_completadas: number;
    porcentaje_completado: number;
    tareas_pendientes: number;
    tareas_aprobadas: number;
    tareas_rechazadas: number;
}

interface UserStatsData {
    user: {
        id: number;
        name: string;
        email: string;
        role_nombre: string;
    };
    estadisticas_generales: {
        total_auditorias: number;
        total_tareas: number;
        total_completadas: number;
        total_pendientes: number;
        total_aprobadas: number;
        total_rechazadas: number;
        porcentaje_general: number;
    };
    auditorias: AuditoriaStats[];
}

export const UserStats: React.FC = () => {
    const navigate = useNavigate();
    const { userId } = useParams<{ userId: string }>();
    const { user: currentUser } = useUser(() => navigate("/login"));
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<UserStatsData | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserStats = async () => {
            try {
                setLoading(true);
                const data = await api.get<UserStatsData>(`/users/${userId}/stats`);
                setStats(data);
                setError(null);
            } catch (err: any) {
                console.error("Error fetching user stats:", err);
                setError(err.message || "Error al cargar las estadísticas");
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchUserStats();
        }
    }, [userId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-orange"></div>
            </div>
        );
    }

    if (error || !stats) {
        return (
            <div className="py-6 px-4 sm:px-6 lg:px-8">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                    {error || "No se pudieron cargar las estadísticas"}
                </div>
                <button
                    onClick={() => navigate("/roles")}
                    className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                    Volver
                </button>
            </div>
        );
    }

    const { user, estadisticas_generales, auditorias } = stats;

    return (
        <div className="py-6 px-4 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
                {/* Header */}
                <div className="bg-white overflow-hidden shadow-xl rounded-2xl mb-6">
                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-8 text-white">
                        <button
                            onClick={() => navigate("/roles")}
                            className="mb-4 inline-flex items-center gap-2 text-white hover:text-orange-100 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Volver a Roles
                        </button>
                        <h2 className="text-3xl font-bold">
                            Estadísticas de {user.name}
                        </h2>
                        <p className="mt-2 text-orange-100">
                            {user.email} • {user.role_nombre}
                        </p>
                    </div>
                </div>

                {/* Estadísticas Generales */}
                <div className="bg-white shadow-xl rounded-2xl overflow-hidden mb-6">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-xl font-semibold text-gray-800">Resumen General</h3>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                <div className="text-sm font-medium text-blue-600">Total Auditorías</div>
                                <div className="text-3xl font-bold text-blue-700 mt-2">
                                    {estadisticas_generales.total_auditorias}
                                </div>
                            </div>
                            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                                <div className="text-sm font-medium text-purple-600">Total Tareas</div>
                                <div className="text-3xl font-bold text-purple-700 mt-2">
                                    {estadisticas_generales.total_tareas}
                                </div>
                            </div>
                            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                                <div className="text-sm font-medium text-green-600">Tareas Aprobadas</div>
                                <div className="text-3xl font-bold text-green-700 mt-2">
                                    {estadisticas_generales.total_aprobadas}
                                </div>
                            </div>
                            <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                                <div className="text-sm font-medium text-orange-600">Tareas Pendientes</div>
                                <div className="text-3xl font-bold text-orange-700 mt-2">
                                    {estadisticas_generales.total_pendientes}
                                </div>
                            </div>
                        </div>

                        {/* Barra de progreso general */}
                        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="text-lg font-semibold text-gray-800">Progreso General</h4>
                                <span className="text-3xl font-bold text-orange-600">
                                    {estadisticas_generales.porcentaje_general.toFixed(1)}%
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                                <div
                                    className="bg-gradient-to-r from-orange-500 to-orange-600 h-6 rounded-full transition-all duration-500 flex items-center justify-end pr-3"
                                    style={{ width: `${estadisticas_generales.porcentaje_general}%` }}
                                >
                                    {estadisticas_generales.porcentaje_general > 10 && (
                                        <span className="text-white text-xs font-semibold">
                                            {estadisticas_generales.total_completadas} / {estadisticas_generales.total_tareas}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="mt-3 flex justify-between text-sm text-gray-600">
                                <span>{estadisticas_generales.total_completadas} completadas</span>
                                <span>{estadisticas_generales.total_rechazadas} rechazadas</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Estadísticas por Auditoría */}
                <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-xl font-semibold text-gray-800">Detalle por Auditoría</h3>
                    </div>
                    <div className="p-6">
                        {auditorias.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <p className="text-lg font-medium">Este usuario no tiene auditorías asignadas</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {auditorias.map((auditoria) => (
                                    <div
                                        key={auditoria.id}
                                        className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h4 className="text-lg font-semibold text-gray-800">
                                                    {auditoria.titulo}
                                                </h4>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {auditoria.empresa_nombre}
                                                </p>
                                            </div>
                                            <span className="text-2xl font-bold text-orange-600">
                                                {auditoria.porcentaje_completado.toFixed(1)}%
                                            </span>
                                        </div>

                                        {/* Barra de progreso */}
                                        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden mb-3">
                                            <div
                                                className="bg-gradient-to-r from-orange-500 to-orange-600 h-4 rounded-full transition-all duration-500"
                                                style={{ width: `${auditoria.porcentaje_completado}%` }}
                                            />
                                        </div>

                                        {/* Detalles de las tareas */}
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                            <div className="flex items-center gap-2">
                                                <span className="w-3 h-3 rounded-full bg-gray-400"></span>
                                                <span className="text-gray-600">
                                                    Total: <span className="font-semibold text-gray-800">{auditoria.total_tareas}</span>
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                                                <span className="text-gray-600">
                                                    Aprobadas: <span className="font-semibold text-green-700">{auditoria.tareas_aprobadas}</span>
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="w-3 h-3 rounded-full bg-orange-500"></span>
                                                <span className="text-gray-600">
                                                    Pendientes: <span className="font-semibold text-orange-700">{auditoria.tareas_pendientes}</span>
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="w-3 h-3 rounded-full bg-red-500"></span>
                                                <span className="text-gray-600">
                                                    Rechazadas: <span className="font-semibold text-red-700">{auditoria.tareas_rechazadas}</span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
