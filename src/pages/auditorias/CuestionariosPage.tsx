import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { cuestionarioService } from '../../services/cuestionarioService';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { LoadingState } from '../../components/common/LoadingState';

export const CuestionariosPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [cuestionarios, setCuestionarios] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        cuestionarioService.getCuestionarios()
            .then(setCuestionarios)
            .finally(() => setLoading(false));
    }, []);

    const breadcrumbItems = [
        { label: 'Auditorías', onClick: () => navigate('/auditorias') },
        { label: `Auditoría ${id}`, onClick: () => navigate(`/auditorias/${id}`) },
        { label: 'Cuestionarios', isActive: true },
    ];

    if (loading) return <LoadingState message="Cargando cuestionarios..." />;

    return (
        <div className="pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto pt-8">
                <Breadcrumb items={breadcrumbItems} />

                <div className="mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Cuestionarios</h1>
                    <p className="text-gray-600 mt-1">Selecciona un cuestionario para diligenciar</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {cuestionarios.map((c) => (
                        <button
                            key={c.id}
                            onClick={() => navigate(`/auditorias/${id}/cuestionarios/${c.id}`)}
                            className="text-left bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:border-blue-300 transition-all group"
                        >
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                                        {c.nombre}
                                    </h3>
                                    {c.objetivo && (
                                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{c.objetivo}</p>
                                    )}
                                </div>
                                <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500 mt-1 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </button>
                    ))}
                </div>

                {cuestionarios.length === 0 && (
                    <div className="text-center py-16 text-gray-400">
                        No hay cuestionarios disponibles
                    </div>
                )}
            </div>
        </div>
    );
};
