import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";
import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import { useUser } from "../../hooks/useUser";
import { useAuditorias } from "../../hooks/useAuditorias";
import { AuditoriaFilterBar } from "../../components/auditorias/auditorias/AuditoriaFilterBar";
import { AuditoriaEmptyState } from "../../components/auditorias/auditorias/AuditoriaEmptyState";
import { AuditoriaCardList } from "../../components/auditorias/auditorias/AuditoriaCardList";
import { Pagination } from "../../components/Pagination";

export const Auditorias: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser(() => navigate("/login"));
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { auditorias, loading } = useAuditorias();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("");

  // Filtrar auditorías según búsqueda, fecha de visita y proceso
  const filteredAuditorias = auditorias.filter((auditoria) => {
    // Filtro por texto
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        auditoria.empresa?.toLowerCase().includes(term) ||
        auditoria.nit?.toLowerCase().includes(term) ||
        auditoria.razon_social?.toLowerCase().includes(term) ||
        auditoria.responsable?.toLowerCase().includes(term);
      if (!matchesSearch) return false;
    }

    // Filtro por fecha de visita (fecha_inicial)
    if (fechaDesde && auditoria.fecha_inicial) {
      if (auditoria.fecha_inicial < fechaDesde) return false;
    }
    if (fechaHasta && auditoria.fecha_inicial) {
      if (auditoria.fecha_inicial > fechaHasta) return false;
    }

    // Filtro por proceso / estado
    if (estadoFilter && auditoria.estado !== estadoFilter) return false;

    return true;
  });

  const totalItems = filteredAuditorias.length;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedAuditorias = filteredAuditorias.slice(
    startIndex,
    startIndex + pageSize,
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleNewAuditoria = () => {
    navigate("/auditorias/nueva");
  };

  const handleViewAuditoria = (id: number) => {
    navigate(`/auditorias/${id}`);
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header
        userName={user?.name || "Usuario"}
        onLogout={handleLogout}
        onNavigateToSettings={() => navigate("/perfil")}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <Sidebar
        onLogout={handleLogout}
        userRole={(user?.role?.nombre as any) || "delegado"}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <main className="lg:ml-32 ml-0 pt-20 py-4 px-3 sm:px-6 lg:px-8">
        <div className="sm:px-0">
          {/* Page Title */}
          <h1 className="mt-6 text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">
            Auditorías
          </h1>

          {/* Filter Bar */}
          <AuditoriaFilterBar
            searchTerm={searchTerm}
            onSearchChange={(v) => { setSearchTerm(v); setCurrentPage(1); }}
            onNewAuditoria={handleNewAuditoria}
            fechaDesde={fechaDesde}
            onFechaDesdeChange={(v) => { setFechaDesde(v); setCurrentPage(1); }}
            fechaHasta={fechaHasta}
            onFechaHastaChange={(v) => { setFechaHasta(v); setCurrentPage(1); }}
            estadoFilter={estadoFilter}
            onEstadoFilterChange={(v) => { setEstadoFilter(v); setCurrentPage(1); }}
          />

          {/* Auditorías List */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
          ) : filteredAuditorias.length === 0 ? (
            auditorias.length === 0 ? (
              <AuditoriaEmptyState onNewAuditoria={handleNewAuditoria} />
            ) : (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <p className="text-gray-500">
                  No se encontraron auditorías que coincidan con la búsqueda
                </p>
              </div>
            )
          ) : (
            <>
              <AuditoriaCardList
                auditorias={paginatedAuditorias}
                onViewAuditoria={handleViewAuditoria}
              />
              <Pagination
                totalItems={totalItems}
                pageSize={pageSize}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                onGenerateReport={() => {
                  // TODO: Implementar lógica real de generación de informe
                  console.log("Generar informe de auditorías visibles");
                }}
              />
            </>
          )}
        </div>
      </main>
    </div>
  );
};
