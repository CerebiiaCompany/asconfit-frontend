import React from "react";
import { Empresa } from "../../components/empresas/EmpresaHeader";
import { EmpresaInfo } from "../../components/empresas/EmpresaInfo";
import { EmpresaTabs } from "../../components/empresas/EmpresaTabs";
import { PapelesTrabajo } from "../../components/empresas/PapelesTrabajo";

export const Empresas: React.FC = () => {
  return (
    <div className="p-6 max-w-[1200px] mx-auto font-sans min-h-screen">
      <Empresa />

      <EmpresaInfo />

      <EmpresaTabs />

      <PapelesTrabajo />
    </div>
  );
};
