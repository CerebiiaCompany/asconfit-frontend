import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../components/Header';
import { Sidebar } from '../../components/Sidebar';
import { Modal } from '../../components/Modal';
import { AuditoriaHeader } from '../../components/auditorias/AuditoriaHeader';
import { EmpresaSection } from '../../components/auditorias/EmpresaSection';
import { DelegadoSection } from '../../components/auditorias/DelegadoSection';
import { PTSection } from '../../components/auditorias/PTSection';
import { FechasSection } from '../../components/auditorias/FechasSection';
import { CategoriasSection } from '../../components/auditorias/CategoriasSection';
import { useUser } from '../../hooks/useUser';
import { useAuditoriaForm } from '../../hooks/useAuditoriaForm';
import { authService } from '../../services/authService';
import { auditoriaService } from '../../services/auditoriaService';

export const NuevaAuditoria: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useUser(() => navigate('/login'));
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [searchEmpresa, setSearchEmpresa] = useState('');
    const [searchConcepto, setSearchConcepto] = useState('');
    const [modal, setModal] = useState<{
        isOpen: boolean;
        type: 'success' | 'error';
        title: string;
        message: string;
    }>({
        isOpen: false,
        type: 'success',
        title: '',
        message: ''
    });

    const {
        formData,
        categorias,
        handleInputChange,
        handleAddCategoria,
        handleRemoveCategoria,
        handleCategoriaChange,
        handleAddSubtarea,
        handleRemoveSubtarea,
        handleSubtareaChange,
        handleLoadPlantilla
    } = useAuditoriaForm();

    const validateForm = (): { isValid: boolean; message: string } => {
        // Validar campos de empresa
        const camposEmpresaRequeridos = [
            { campo: 'empresa', nombre: 'Empresa' },
            { campo: 'nit', nombre: 'NIT' },
            { campo: 'razonSocial', nombre: 'Razón Social' },
            { campo: 'direccion', nombre: 'Dirección' },
            { campo: 'responsable', nombre: 'Responsable o Representante Legal' },
            { campo: 'actividadEconomica', nombre: 'Actividad Económica' },
            { campo: 'contacto', nombre: 'Contacto' }
        ];

        for (const { campo, nombre } of camposEmpresaRequeridos) {
            const valor = formData[campo as keyof typeof formData];
            if (!valor || (typeof valor === 'string' && valor.trim() === '')) {
                return {
                    isValid: false,
                    message: `El campo "${nombre}" es obligatorio`
                };
            }
        }

        // Validar que se haya seleccionado un delegado
        if (!formData.delegadoId) {
            return {
                isValid: false,
                message: 'Debe seleccionar un delegado responsable'
            };
        }

        // Validar que haya al menos una categoría
        if (categorias.length === 0 || !categorias[0].nombre) {
            return {
                isValid: false,
                message: 'Debe agregar al menos una categoría'
            };
        }

        // Validar cada categoría y sus subtareas
        for (let i = 0; i < categorias.length; i++) {
            const categoria = categorias[i];

            if (!categoria.nombre || categoria.nombre.trim() === '') {
                return {
                    isValid: false,
                    message: `La categoría ${i + 1} debe tener un nombre`
                };
            }

            // Validar que tenga al menos una subtarea
            if (!categoria.subtareas || categoria.subtareas.length === 0) {
                return {
                    isValid: false,
                    message: `La categoría "${categoria.nombre}" debe tener al menos un requerimiento`
                };
            }

            // Validar cada subtarea
            for (let j = 0; j < categoria.subtareas.length; j++) {
                const subtarea = categoria.subtareas[j];
                const subtareaNum = j + 1;

                if (!subtarea.nombre || subtarea.nombre.trim() === '') {
                    return {
                        isValid: false,
                        message: `El requerimiento ${subtareaNum} de "${categoria.nombre}" debe tener un nombre`
                    };
                }

                if (!subtarea.prioridad) {
                    return {
                        isValid: false,
                        message: `El requerimiento "${subtarea.nombre}" debe tener una prioridad`
                    };
                }

                if (!subtarea.fechaSolicitud) {
                    return {
                        isValid: false,
                        message: `El requerimiento "${subtarea.nombre}" debe tener una fecha de solicitud`
                    };
                }

                if (!subtarea.tiempoEntrega || subtarea.tiempoEntrega.trim() === '') {
                    return {
                        isValid: false,
                        message: `El requerimiento "${subtarea.nombre}" debe tener un tiempo de entrega`
                    };
                }

                if (!subtarea.estadoInformacion) {
                    return {
                        isValid: false,
                        message: `El requerimiento "${subtarea.nombre}" debe tener un estado de información`
                    };
                }

                if (!subtarea.formatoArchivo) {
                    return {
                        isValid: false,
                        message: `El requerimiento "${subtarea.nombre}" debe tener un formato de archivo`
                    };
                }
            }
        }

        return { isValid: true, message: '' };
    };

    const handleSubmit = async () => {
        // Validar formulario
        const validation = validateForm();
        if (!validation.isValid) {
            setModal({
                isOpen: true,
                type: 'error',
                title: 'Campos incompletos',
                message: validation.message
            });
            return;
        }

        try {
            const auditoriaData = {
                formData,
                categorias,
                searchConcepto
            };

            await auditoriaService.createAuditoria(auditoriaData);
            setModal({
                isOpen: true,
                type: 'success',
                title: '¡Éxito!',
                message: 'Auditoría guardada exitosamente'
            });
        } catch (error: any) {
            console.error('Error al guardar auditoría:', error);
            setModal({
                isOpen: true,
                type: 'error',
                title: 'Error',
                message: error.response?.data?.message || 'Error al guardar la auditoría'
            });
        }
    };

    const handleCloseModal = () => {
        setModal({ ...modal, isOpen: false });
        if (modal.type === 'success') {
            navigate('/auditorias');
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

            <main className="lg:ml-32 ml-0 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Breadcrumb */}
                    <div className="mb-4">
                        <div className="flex items-center space-x-2 text-gray-600">
                            <button
                                onClick={() => navigate('/auditorias')}
                                className="text-lg font-medium hover:text-gray-900 transition-colors"
                            >
                                Auditorías
                            </button>
                            <svg className="h-5 w-5 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M9 5l7 7-7 7" />
                            </svg>
                            <span className="text-lg font-medium text-gray-400">Crear auditoría</span>
                        </div>
                    </div>

                    {/* Header */}
                    <AuditoriaHeader
                        searchEmpresa={searchEmpresa}
                        searchConcepto={searchConcepto}
                        onSearchEmpresaChange={setSearchEmpresa}
                        onSearchConceptoChange={setSearchConcepto}
                        onBack={() => navigate('/auditorias')}
                    />

                    {/* Form Content */}
                    <div className="bg-white shadow-xl rounded-2xl p-4 sm:p-6 lg:p-8">
                        <EmpresaSection
                            formData={formData}
                            onInputChange={handleInputChange}
                        />

                        <DelegadoSection
                            selectedDelegadoId={formData.delegadoId}
                            onDelegadoChange={(delegadoId) =>
                                handleInputChange({
                                    target: { name: 'delegadoId', value: delegadoId }
                                } as any)
                            }
                        />

                        <PTSection
                            value={formData.pt}
                            onChange={handleInputChange}
                        />

                        <FechasSection
                            fechaInicial={formData.fechaInicial}
                            fechaCorte={formData.fechaCorte}
                            onInputChange={handleInputChange}
                        />

                        <CategoriasSection
                            categorias={categorias}
                            onAddCategoria={handleAddCategoria}
                            onRemoveCategoria={handleRemoveCategoria}
                            onCategoriaChange={handleCategoriaChange}
                            onAddSubtarea={handleAddSubtarea}
                            onRemoveSubtarea={handleRemoveSubtarea}
                            onSubtareaChange={handleSubtareaChange}
                            onLoadPlantilla={handleLoadPlantilla}
                        />

                        {/* Action Button */}
                        <div className="flex justify-end">
                            <button
                                onClick={handleSubmit}
                                className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-orange-500 text-white text-sm sm:text-base font-semibold rounded-lg hover:bg-orange-600 transition-colors shadow-lg"
                            >
                                Guardar auditoría
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            {/* Modal */}
            <Modal
                isOpen={modal.isOpen}
                onClose={handleCloseModal}
                title={modal.title}
                message={modal.message}
                type={modal.type}
            />
        </div>
    );
};
