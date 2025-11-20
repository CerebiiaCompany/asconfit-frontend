import React, { useState, useEffect } from "react";
import { Categoria, Subtarea } from "../../../types/auditoria.types";
import { SubtareaItem } from "./SubtareaItem";
import { plantillaService } from "../../../services/plantillaService";
import { Modal } from "../../Modal";

interface CategoriasSectionProps {
  categorias: Categoria[];
  onAddCategoria: () => void;
  onRemoveCategoria: (id: string) => void;
  onCategoriaChange: (id: string, value: string) => void;
  onAddSubtarea: (categoriaId: string) => void;
  onRemoveSubtarea: (categoriaId: string, subtareaId: string) => void;
  onSubtareaChange: (
    categoriaId: string,
    subtareaId: string,
    field: keyof Subtarea,
    value: string
  ) => void;
  onLoadPlantilla: (categoriaId: string, codigo: string) => void;
}

export const CategoriasSection: React.FC<CategoriasSectionProps> = ({
  categorias,
  onAddCategoria,
  onRemoveCategoria,
  onCategoriaChange,
  onAddSubtarea,
  onRemoveSubtarea,
  onSubtareaChange,
  onLoadPlantilla,
}) => {
  const [plantillasDisponibles, setPlantillasDisponibles] = useState<any[]>([]);
  const [plantillasModificadas, setPlantillasModificadas] = useState<
    Set<string>
  >(new Set());
  const [modal, setModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: "success" | "error" | "warning" | "info";
  }>({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
  });

  useEffect(() => {
    const cargarPlantillas = async () => {
      try {
        const plantillas = await plantillaService.getPlantillas();
        setPlantillasDisponibles(plantillas);
      } catch (error) {
        console.error("Error al cargar plantillas:", error);
      }
    };
    cargarPlantillas();
  }, []);

  const marcarPlantillaModificada = (codigoPlantilla: string) => {
    setPlantillasModificadas((prev) => new Set(prev).add(codigoPlantilla));
  };

  const handleActualizarPlantilla = async (categoria: Categoria) => {
    try {
      const plantilla = plantillasDisponibles.find(
        (p) => p.codigo === categoria.nombre || p.nombre === categoria.nombre
      );

      if (!plantilla) {
        setModal({
          isOpen: true,
          title: "Error",
          message: "No se encontró la plantilla",
          type: "error",
        });
        return;
      }

      const data = {
        nombre: plantilla.nombre,
        codigo: plantilla.codigo,
        requerimientos: categoria.subtareas.map((st) => ({
          descripcion: st.nombre,
        })),
      };

      await plantillaService.updatePlantilla(plantilla.codigo, data);

      // Remover de la lista de modificadas
      setPlantillasModificadas((prev) => {
        const newSet = new Set(prev);
        newSet.delete(categoria.nombre);
        return newSet;
      });

      setModal({
        isOpen: true,
        title: "¡Éxito!",
        message: "La plantilla ha sido actualizada correctamente",
        type: "success",
      });
    } catch (error) {
      console.error("Error al actualizar plantilla:", error);
      setModal({
        isOpen: true,
        title: "Error",
        message:
          "Ocurrió un error al actualizar la plantilla. Por favor intenta de nuevo.",
        type: "error",
      });
    }
  };

  const handleAddSubtarea = (categoriaId: string) => {
    const categoria = categorias.find((c) => c.id === categoriaId);
    if (categoria) {
      const esPlantillaExistente = plantillasDisponibles.some(
        (p) => p.codigo === categoria.nombre || p.nombre === categoria.nombre
      );
      if (esPlantillaExistente) {
        marcarPlantillaModificada(categoria.nombre);
      }
    }
    onAddSubtarea(categoriaId);
  };

  const handleRemoveSubtarea = (categoriaId: string, subtareaId: string) => {
    const categoria = categorias.find((c) => c.id === categoriaId);
    if (categoria) {
      const esPlantillaExistente = plantillasDisponibles.some(
        (p) => p.codigo === categoria.nombre || p.nombre === categoria.nombre
      );
      if (esPlantillaExistente) {
        marcarPlantillaModificada(categoria.nombre);
      }
    }
    onRemoveSubtarea(categoriaId, subtareaId);
  };

  return (
    <>
      <Modal
        isOpen={modal.isOpen}
        onClose={() => setModal({ ...modal, isOpen: false })}
        title={modal.title}
        message={modal.message}
        type={modal.type}
      />

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800">
            Crear categorías requeridas
          </h2>
          <button
            onClick={onAddCategoria}
            className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex-shrink-0"
          >
            <svg
              className="h-4 w-4 sm:h-5 sm:w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          {categorias.map((categoria) => {
            const esPlantillaExistente = plantillasDisponibles.some(
              (p) =>
                p.codigo === categoria.nombre || p.nombre === categoria.nombre
            );
            const tieneModificaciones = plantillasModificadas.has(
              categoria.nombre
            );

            return (
              <div
                key={categoria.id}
                className="bg-[#E8E8E8] p-3 sm:p-4 rounded-lg"
              >
                {/* Header de Categoría */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 flex-1">
                    <label className="text-sm text-gray-600 sm:w-24 flex-shrink-0">
                      Categoría
                    </label>
                    {(() => {
                      // Verificar si la categoría actual es una plantilla existente
                      const esCategoriaPersonalizada =
                        categoria.nombre && !esPlantillaExistente;

                      if (esCategoriaPersonalizada) {
                        // Mostrar input para categoría personalizada
                        return (
                          <div className="flex-1 flex items-center gap-2">
                            <input
                              type="text"
                              value={categoria.nombre}
                              onChange={(e) =>
                                onCategoriaChange(categoria.id, e.target.value)
                              }
                              className="flex-1 sm:max-w-md px-3 sm:px-4 py-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white text-sm sm:text-base font-medium"
                              placeholder="Nombre de la categoría personalizada"
                            />
                            <button
                              onClick={() =>
                                onCategoriaChange(categoria.id, "")
                              }
                              className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 underline"
                              title="Cambiar a plantilla"
                            >
                              Cambiar
                            </button>
                          </div>
                        );
                      }

                      // Mostrar select para plantillas
                      return (
                        <select
                          value={categoria.nombre}
                          onChange={(e) => {
                            const newValue = e.target.value;
                            const previousValue = categoria.nombre;

                            if (newValue === "nueva") {
                              // Permitir escribir nombre personalizado
                              const nombrePersonalizado = prompt(
                                "Ingresa el nombre de la nueva categoría:"
                              );
                              if (
                                nombrePersonalizado &&
                                nombrePersonalizado.trim()
                              ) {
                                onCategoriaChange(
                                  categoria.id,
                                  nombrePersonalizado.trim()
                                );
                              }
                            } else {
                              onCategoriaChange(categoria.id, newValue);
                              // Cargar plantilla automáticamente si se selecciona una categoría existente
                              if (
                                newValue &&
                                newValue !== previousValue &&
                                newValue !== "nueva"
                              ) {
                                onLoadPlantilla(categoria.id, newValue);
                              }
                            }
                          }}
                          className="flex-1 sm:max-w-md px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-[#F3F3F3] text-sm sm:text-base"
                        >
                          <option value="">
                            Selecciona la categoría requerida
                          </option>
                          {plantillasDisponibles.map((plantilla) => (
                            <option key={plantilla.id} value={plantilla.codigo}>
                              {plantilla.nombre}
                            </option>
                          ))}
                          <option
                            value="nueva"
                            className="font-semibold text-orange-600"
                          >
                            + Crear nueva categoría
                          </option>
                        </select>
                      );
                    })()}
                  </div>
                  <button
                    onClick={() => onRemoveCategoria(categoria.id)}
                    className="self-end sm:self-auto p-2 text-white bg-[#9A9A9A] hover:bg-red-500 rounded-full transition-colors flex-shrink-0"
                    title="Eliminar categoría"
                  >
                    <svg
                      className="h-4 w-4 sm:h-5 sm:w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>

                {/* Subtareas */}
                {categoria.nombre && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium text-gray-700">
                        Requerimientos
                      </h3>
                      <div className="flex gap-2">
                        {esPlantillaExistente && tieneModificaciones && (
                          <button
                            onClick={() => handleActualizarPlantilla(categoria)}
                            className="flex items-center gap-2 px-3 py-1.5 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors font-medium"
                          >
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                              />
                            </svg>
                            Actualizar plantilla
                          </button>
                        )}
                        <button
                          onClick={() => handleAddSubtarea(categoria.id)}
                          className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                          Agregar requerimiento
                        </button>
                      </div>
                    </div>

                    {categoria.subtareas.length === 0 ? (
                      <div className="text-center py-8 text-gray-500 text-sm">
                        No hay requerimientos. Haz clic en "Agregar
                        requerimiento" para comenzar.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {categoria.subtareas.map((subtarea) => (
                          <SubtareaItem
                            key={subtarea.id}
                            subtarea={subtarea}
                            onRemove={() =>
                              handleRemoveSubtarea(categoria.id, subtarea.id)
                            }
                            onChange={(field, value) =>
                              onSubtareaChange(
                                categoria.id,
                                subtarea.id,
                                field,
                                value
                              )
                            }
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
