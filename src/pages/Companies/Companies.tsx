import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ShieldOff } from "lucide-react";
import { CompanyHeader } from "../../components/companies/CompanyHeader";
import { CompanyInfo } from "../../components/companies/CompanyInfo";
import { CompanyTabs } from "../../components/companies/CompanyTabs";
import { WorkPapers } from "../../components/companies/WorkPapers";
import { empresaService, Empresa as EmpresaModel } from "../../services/empresaService";
import { documentoService, Carpeta } from "../../services/documentoService";
import { useToast } from "../../contexts/ToastContext";
import { useAuth } from "../../contexts/AuthContext";

export const Companies: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { userRole } = useAuth();

  const searchParams = new URLSearchParams(location.search);
  const idValue = searchParams.get("id");
  const empresaId = idValue ? parseInt(idValue, 10) : null;

  const [empresaState, setEmpresaState] = useState<EmpresaModel | null>(null);
  const [loading, setLoading] = useState(!!empresaId);
  const [activeCarpeta, setActiveCarpeta] = useState<Carpeta | null>(null);
  const [sinAcceso, setSinAcceso] = useState(false);

  const isAdmin = userRole === "admin";

  useEffect(() => {
    if (empresaId) {
      empresaService.getById(empresaId)
        .then(data => setEmpresaState(data))
        .catch(err => {
          console.error(err);
          addToast("Error al cargar la información de la empresa", "error");
        })
        .finally(() => setLoading(false));
    }
  }, [empresaId]);

  const handleTogglePrivate = async () => {
    if (!activeCarpeta) return;
    try {
      const result = await documentoService.toggleCarpetaPrivate(activeCarpeta.id);
      setActiveCarpeta(prev => prev ? { ...prev, is_private: result.is_private } : prev);
      addToast(result.is_private ? "Carpeta marcada como privada" : "Carpeta marcada como pública", "success");
    } catch (error) {
      addToast("Error al cambiar la privacidad de la carpeta", "error");
    }
  };

  return (
    <div className="p-6 max-w-[1200px] mx-auto font-sans min-h-screen">
      <CompanyHeader />

      {loading ? (
        <div className="py-20 text-center text-gray-500 font-bold">
          Cargando datos de la empresa...
        </div>
      ) : empresaState ? (
        <>
          <CompanyInfo initialData={empresaState} />
          <CompanyTabs
            empresaId={empresaState.id!}
            activeCarpetaId={activeCarpeta?.id ?? null}
            setActiveCarpeta={setActiveCarpeta}
            onNoCarpetas={() => setSinAcceso(true)}
            isAdmin={isAdmin}
            activeCarpetaData={activeCarpeta}
          />
          {sinAcceso ? (
            <div className="py-20 text-center bg-[#f0f2f5] rounded-b-xl rounded-tr-xl border border-gray-200 flex flex-col items-center gap-3">
              <ShieldOff className="w-12 h-12 text-gray-300" />
              <p className="text-gray-500 font-semibold">Sin acceso a los documentos</p>
              <p className="text-gray-400 text-sm">No tienes permisos para ver las carpetas de esta empresa.</p>
            </div>
          ) : activeCarpeta ? (
            <WorkPapers
              carpetaId={activeCarpeta.id}
              isPrivate={activeCarpeta.is_private}
              isAdmin={isAdmin}
              onTogglePrivate={handleTogglePrivate}
            />
          ) : (
            <div className="py-20 text-center text-gray-400 font-medium bg-[#f0f2f5] rounded-b-xl rounded-tr-xl border border-gray-200">
              Cargando interfaz de documentos...
            </div>
          )}
        </>
      ) : (
        <div className="py-20 text-center text-gray-400">
          <p className="mb-4">No se ha seleccionado ninguna empresa.</p>
          <button
            onClick={() => navigate("/empresas/ver")}
            className="text-orange-500 font-bold hover:underline"
          >
            Volver a la lista de empresas
          </button>
        </div>
      )}
    </div>
  );
};
