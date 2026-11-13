import React from "react";
import { Subtarea } from "../../types/tarea.types";

interface SubtareaCardProps {
  subtarea: Subtarea;
  onFileUpload: (file: File) => void | Promise<unknown>;
}

export const SubtareaCard: React.FC<SubtareaCardProps> = ({
  subtarea,
  onFileUpload,
}) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h4 className="font-medium text-gray-800 mb-2">{subtarea.nombre}</h4>

          {subtarea.observaciones && (
            <p className="text-sm text-gray-600 mt-1">
              Observaciones: {subtarea.observaciones}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="cursor-pointer">
            <input
              type="file"
              multiple
              className="hidden"
              onChange={async (e) => {
                const files = Array.from(e.target.files ?? []);
                e.target.value = "";
                // Uno tras otro, para que el último elegido quede como el más reciente
                for (const file of files) {
                  await onFileUpload(file);
                }
              }}
            />
            <div className="px-4 py-2 bg-orange-500 text-white text-sm font-semibold rounded-lg hover:bg-orange-600 transition-colors text-center">
              Subir archivo
            </div>
          </label>

          {subtarea.archivo_nombre && (
            <div className="text-xs text-green-600 text-center">
              ✓ {(subtarea.archivos_count ?? 1) > 1 ? `${subtarea.archivos_count} archivos subidos` : "Archivo subido"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
