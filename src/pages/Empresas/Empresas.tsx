import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Empresa as EmpresaHeader } from "../../components/empresas/EmpresaHeader";
import { EmpresaInfo } from "../../components/empresas/EmpresaInfo";
import { EmpresaTabs } from "../../components/empresas/EmpresaTabs";
import { PapelesTrabajo } from "../../components/empresas/PapelesTrabajo";
import { empresaService, Empresa as EmpresaModel } from "../../services/empresaService";
import { useToast } from "../../contexts/ToastContext";

export const Empresas: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const searchParams = new URLSearchParams(location.search);
  const idValue = searchParams.get("id");
  const empresaId = idValue ? parseInt(idValue, 10) : null;

  const [empresaState, setEmpresaState] = useState<EmpresaModel | null>(null);
  const [loading, setLoading] = useState(!!empresaId);
  const [activeCarpetaId, setActiveCarpetaId] = useState<number | null>(null);

  useEffect(() => {
    if (empresaId) {
      empresaService.getById(empresaId)
        .then(data => {
          setEmpresaState(data);
        })
        .catch(err => {
          console.error(err);
          addToast("Error al cargar la información de la empresa", "error");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      // Si entra a /empresas sin ID, se considera el Dashboard genérico, 
      // pero podríamos redirigir a la lista si no hay empresa seleccionada.
      // navigate("/empresas/ver");
    }
  }, [empresaId]);

  return (
    <div className="p-6 max-w-[1200px] mx-auto font-sans min-h-screen">
      <EmpresaHeader />

      {loading ? (
        <div className="py-20 text-center text-gray-500 font-bold">
          Cargando datos de la empresa...
        </div>
      ) : empresaState ? (
        <>
          <EmpresaInfo initialData={empresaState} />
          <EmpresaTabs 
            empresaId={empresaState.id!} 
            activeCarpetaId={activeCarpetaId}
            setActiveCarpetaId={setActiveCarpetaId}
          />
          {activeCarpetaId ? (
            <PapelesTrabajo carpetaId={activeCarpetaId} />
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
