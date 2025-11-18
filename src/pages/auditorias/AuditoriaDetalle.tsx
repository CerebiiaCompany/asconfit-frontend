import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { authService } from '../../services/authService';
import { auditoriaService } from '../../services/auditoriaService';
import { Header } from '../../components/Header';
import { Sidebar } from '../../components/Sidebar';
import { useUser } from '../../hooks/useUser';

export const AuditoriaDetalle: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { user } = useUser(() => navigate('/login'));
    const [auditoria, setAuditoria] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        if (id) {
            fetchAuditoria();
        }
    }, [id]);

    const fetchAuditoria = async () => {
        try {
            setLoading(true);
            const response = await auditoriaService.getAuditoria(id!);
            setAuditoria(response);
        } catch (error) {
            console.error('Error al cargar la auditoría:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenFile = async (subtareaId: number, fileName: string) => {
        try {
            const response = await auditoriaService.downloadFile(subtareaId);

            // Crear un blob URL y abrirlo en nueva pestaña
            const blob = new Blob([response.data], { type: response.headers['content-type'] });
            const url = window.URL.createObjectURL(blob);
            window.open(url, '_blank');

            // Limpiar el URL después de un tiempo
            setTimeout(() => {
                window.URL.revokeObjectURL(url);
            }, 100);
        } catch (error) {
            console.error('Error al abrir archivo:', error);
            alert('Error al abrir el archivo');
        }
    };

    const handleLogout = async () => {
        try {
            await authService.logout();
            navigate('/login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const getEstadoBadge = (estado: string) => {
        const badges: Record<string, string> = {
            pendiente: 'bg-red-100 text-red-800',
            en_progreso: 'bg-yellow-100 text-yellow-800',
            completada: 'bg-green-100 text-green-800'
        };
        const labels: Record<string, string> = {
            pendiente: 'Pendiente',
            en_progreso: 'En Progreso',
            completada: 'Completada'
        };
        return (
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${badges[estado] || 'bg-gray-100 text-gray-800'}`}>
                {labels[estado] || estado}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!auditoria) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-500 mb-4">No se encontró la auditoría</p>
                    <button
                        onClick={() => navigate('/auditorias')}
                        className="text-blue-600 hover:text-blue-800"
                    >
                        Volver a auditorías
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <Header
                userName={user?.name || 'Usuario'}
                onLogout={handleLogout}
                onNavigateToSettings={() => navigate('/perfil')}
                onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            />
            <Sidebar
                onLogout={handleLogout}
                userRole={(user?.role?.nombre as any) || 'delegado'}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />
            <main className="lg:ml-32 ml-0 pt-20 py-6 px-4 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    {/* Header */}
                    <div className="mb-6 flex items-center justify-between">
                        <button
                            onClick={() => navigate('/auditorias')}
                            className="flex items-center text-gray-600 hover:text-gray-900"
                        >
                            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Volver a auditorías
                        </button>
                        {getEstadoBadge(auditoria.estado)}
                    </div>

                    {/* Información de la Auditoría */}
                    <div className="bg-white shadow-xl rounded-2xl overflow-hidden mb-6">
                        <div className="px-6 py-8">
                            <h2 className="text-3xl font-bold text-gray-800 mb-6">
                                Detalle de Auditoría
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Empresa</label>
                                    <p className="text-gray-900">{auditoria.empresa || '-'}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">NIT</label>
                                    <p className="text-gray-900">{auditoria.nit || '-'}</p>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Razón Social</label>
                                    <p className="text-gray-900">{auditoria.razon_social || '-'}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Actividad Económica</label>
                                    <p className="text-gray-900">{auditoria.actividad_economica || '-'}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                                    <p className="text-gray-900">{auditoria.direccion || '-'}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Responsable</label>
                                    <p className="text-gray-900">{auditoria.responsable || '-'}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Contacto</label>
                                    <p className="text-gray-900">{auditoria.contacto || '-'}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">PT</label>
                                    <p className="text-gray-900">{auditoria.pt || '-'}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Inicial</label>
                                    <p className="text-gray-900">{auditoria.fecha_inicial || '-'}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Corte</label>
                                    <p className="text-gray-900">{auditoria.fecha_corte || '-'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Categorías y Subtareas */}
                    {auditoria.categorias && auditoria.categorias.length > 0 && (
                        <div className="space-y-6">
                            <h3 className="text-2xl font-bold text-gray-800">Categorías y Requerimientos</h3>

                            {auditoria.categorias.map((categoria: any) => (
                                <div key={categoria.id} className="bg-white shadow-xl rounded-2xl overflow-hidden">
                                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4">
                                        <h4 className="text-xl font-bold text-white">{categoria.nombre}</h4>
                                    </div>

                                    <div className="px-6 py-4">
                                        {categoria.subtareas && categoria.subtareas.length > 0 ? (
                                            <div className="overflow-hidden">
                                                <table className="w-full divide-y divide-gray-200">
                                                    <thead className="bg-gray-50">
                                                        <tr>
                                                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                                                                Requerimiento
                                                            </th>
                                                            <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                                                                Prioridad
                                                            </th>
                                                            <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                                                                F. Solicitud
                                                            </th>
                                                            <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                                                                T. Entrega
                                                            </th>
                                                            <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                                                                Estado
                                                            </th>
                                                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Archivo
                                                            </th>
                                                            <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                                                                Formato
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white divide-y divide-gray-200">
                                                        {categoria.subtareas.map((subtarea: any) => (
                                                            <tr key={subtarea.id} className="hover:bg-gray-50">
                                                                <td className="px-3 py-3">
                                                                    <div className="text-sm text-gray-900 font-medium break-words">
                                                                        {subtarea.nombre}
                                                                    </div>
                                                                    {subtarea.observaciones && (
                                                                        <div className="text-xs text-gray-500 mt-1 break-words">
                                                                            {subtarea.observaciones}
                                                                        </div>
                                                                    )}
                                                                </td>
                                                                <td className="px-2 py-3 whitespace-nowrap">
                                                                    {subtarea.prioridad ? (
                                                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${subtarea.prioridad === 'alta' ? 'bg-red-100 text-red-800' :
                                                                            subtarea.prioridad === 'media' ? 'bg-yellow-100 text-yellow-800' :
                                                                                'bg-green-100 text-green-800'
                                                                            }`}>
                                                                            {subtarea.prioridad.charAt(0).toUpperCase() + subtarea.prioridad.slice(1)}
                                                                        </span>
                                                                    ) : (
                                                                        <span className="text-sm text-gray-400">-</span>
                                                                    )}
                                                                </td>
                                                                <td className="px-2 py-3 whitespace-nowrap text-xs text-gray-900">
                                                                    {subtarea.fecha_solicitud || '-'}
                                                                </td>
                                                                <td className="px-2 py-3 whitespace-nowrap text-xs text-gray-900">
                                                                    {subtarea.tiempo_entrega || '-'}
                                                                </td>
                                                                <td className="px-2 py-3 whitespace-nowrap">
                                                                    {subtarea.estado_informacion ? (
                                                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${subtarea.estado_informacion === 'aprobado' ? 'bg-green-100 text-green-800' :
                                                                            subtarea.estado_informacion === 'recibido' ? 'bg-blue-100 text-blue-800' :
                                                                                subtarea.estado_informacion === 'revision' ? 'bg-yellow-100 text-yellow-800' :
                                                                                    'bg-gray-100 text-gray-800'
                                                                            }`}>
                                                                            {subtarea.estado_informacion.charAt(0).toUpperCase() + subtarea.estado_informacion.slice(1)}
                                                                        </span>
                                                                    ) : (
                                                                        <span className="text-sm text-gray-400">-</span>
                                                                    )}
                                                                </td>
                                                                <td className="px-3 py-3">
                                                                    {subtarea.archivo_nombre ? (
                                                                        <button
                                                                            onClick={() => handleOpenFile(subtarea.id, subtarea.archivo_nombre)}
                                                                            className="flex items-center gap-1 hover:bg-blue-50 px-2 py-1 rounded transition-colors group"
                                                                            title="Click para abrir en nueva pestaña"
                                                                        >
                                                                            <svg className="h-4 w-4 text-blue-500 group-hover:text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                            </svg>
                                                                            <span className="text-xs text-blue-600 group-hover:text-blue-700 underline truncate" title={subtarea.archivo_nombre}>
                                                                                {subtarea.archivo_nombre.length > 15
                                                                                    ? subtarea.archivo_nombre.substring(0, 15) + '...'
                                                                                    : subtarea.archivo_nombre}
                                                                            </span>
                                                                        </button>
                                                                    ) : (
                                                                        <div className="flex items-center gap-1 text-gray-400">
                                                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                                            </svg>
                                                                            <span className="text-xs">Sin archivo</span>
                                                                        </div>
                                                                    )}
                                                                </td>
                                                                <td className="px-2 py-3 whitespace-nowrap">
                                                                    {subtarea.formato_archivo ? (
                                                                        <span className="px-2 py-1 text-xs font-semibold rounded bg-orange-100 text-orange-800">
                                                                            {subtarea.formato_archivo.toUpperCase()}
                                                                        </span>
                                                                    ) : (
                                                                        <span className="text-sm text-gray-400">-</span>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : (
                                            <p className="text-center text-gray-500 py-8">
                                                No hay requerimientos en esta categoría
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};
