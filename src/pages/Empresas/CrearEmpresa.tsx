import React from 'react';
import { CrearEmpresaHeader } from '../../components/empresas/CrearEmpresaHeader';
import { CrearEmpresaForm } from '../../components/empresas/CrearEmpresaForm';

export const CrearEmpresa: React.FC = () => {
  return (
    <div className="p-6 max-w-[1200px] mx-auto font-sans min-h-screen bg-white">
      <CrearEmpresaHeader />
      
      <hr className="border-gray-200 mb-10" />

      <CrearEmpresaForm />
    </div>
  );
};
