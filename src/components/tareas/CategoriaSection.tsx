import React from "react";
import { Categoria } from "../../types/tarea.types";
import { SubtareaCard } from "./SubtareaCard";

interface CategoriaSectionProps {
  categoria: Categoria;
  onFileUpload: (subtareaId: string, file: File) => void;
}

export const CategoriaSection: React.FC<CategoriaSectionProps> = ({
  categoria,
  onFileUpload,
}) => {
  return (
    <div className="bg-white shadow-xl rounded-2xl p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        {categoria.nombre}
      </h3>

      <div className="space-y-4">
        {categoria.subtareas?.map((subtarea) => (
          <SubtareaCard
            key={subtarea.id}
            subtarea={subtarea}
            onFileUpload={(file) => onFileUpload(subtarea.id, file)}
          />
        ))}
      </div>
    </div>
  );
};
