import React, { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import { CrearEmpresaHeader } from '../../components/empresas/CrearEmpresaHeader';
import { CrearEmpresaForm } from '../../components/empresas/CrearEmpresaForm';
import { empresaService, Empresa } from '../../services/empresaService';
import { useToast } from "../../contexts/ToastContext";

export const CrearEmpresa: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const idValue = searchParams.get("id");
  const empresaId = idValue ? parseInt(idValue, 10) : null;
  const isEdit = !!empresaId;

  const [initialData, setInitialData] = useState<Empresa | null>(null);
  const [loading, setLoading] = useState(isEdit);
  const { addToast } = useToast();

  useEffect(() => {
    if (empresaId) {
      empresaService.getById(empresaId)
        .then(data => setInitialData(data))
        .catch(err => {
           console.error(err);
           addToast("Error cargando la empresa para editar", "error");
        })
        .finally(() => setLoading(false));
    }
  }, [empresaId]);

  return (
    <div className="p-6 max-w-[1200px] mx-auto font-sans min-h-screen bg-white">
      <CrearEmpresaHeader isEdit={isEdit} />
      
      <hr className="border-gray-200 mb-10" />

      {loading ? (
        <div className="py-20 text-center text-gray-500 font-bold">Cargando datos de la empresa...</div>
      ) : (
        <CrearEmpresaForm isEdit={isEdit} initialData={initialData} />
      )}
    </div>
  );
};
