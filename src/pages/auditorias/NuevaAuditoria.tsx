import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../components/Header';
import { Sidebar } from '../../components/Sidebar';
import { AuditoriaHeader } from '../../components/auditorias/AuditoriaHeader';
import { EmpresaSection } from '../../components/auditorias/EmpresaSection';
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

    const handleSubmit = async () => {
        try {
            const auditoriaData = {
                formData,
                categorias,
                searchConcepto
            };

            await auditoriaService.createAuditoria(auditoriaData);
            alert('Auditoría guardada exitosamente');
            navigate('/auditorias');
        } catch (error: any) {
            console.error('Error al guardar auditoría:', error);
            alert(error.response?.data?.message || 'Error al guardar la auditoría');
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
        </div>
    );
};
