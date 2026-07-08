import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { auditoriaService } from "../../services/auditoriaService";
import { useToast } from "../../contexts/ToastContext";
import { LoadingState } from "../../components/common/LoadingState";
import { Auditoria, Subtarea } from "../../types/auditoria";

const RISK_LABELS = {
  critical: { label: "Crítico", color: "bg-red-100 text-red-800" },
  high: { label: "Alto", color: "bg-orange-100 text-orange-800" },
  moderate: { label: "Moderado", color: "bg-amber-100 text-amber-800" },
  low: { label: "Bajo", color: "bg-emerald-100 text-emerald-800" },
};

// NPR máximo posible: 10 × 10 × (11 − 1) = 1000. Se usa para dimensionar barras.
const MAX_NPR = 1000;

// NPR = gravedad × probabilidad × (11 − detección).
// Debe coincidir con el cálculo del backend. La detección está en escala
// invertida: 1 = difícil de detectar (peor), 10 = fácil de detectar (mejor).
function computeNpr(gravedad: number, probabilidad: number, detencion: number) {
  if (gravedad < 1 || probabilidad < 1 || detencion < 1) return 0;
  return gravedad * probabilidad * (11 - detencion);
}

// Rangos alineados con getNivelRiesgo() del backend:
// Bajo ≤ 100, Moderado ≤ 225, Alto ≤ 450, Crítico > 450.
function getRiskLabel(npr: number) {
  if (npr > 450) return RISK_LABELS.critical;
  if (npr > 225) return RISK_LABELS.high;
  if (npr > 100) return RISK_LABELS.moderate;
  return RISK_LABELS.low;
}

function getNprColor(npr: number) {
  if (npr > 450) return "bg-red-500";
  if (npr > 225) return "bg-orange-500";
  if (npr > 100) return "bg-amber-500";
  return "bg-emerald-500";
}

// Color para las métricas individuales (1-10). Para la detección la escala se
// invierte, ya que un valor bajo es peor (más difícil de detectar).
function getMetricColor(value: number, inverted = false) {
  const effective = inverted ? 11 - value : value;
  if (effective >= 8) return "bg-red-500";
  if (effective >= 6) return "bg-amber-500";
  return "bg-emerald-500";
}

function normalizeRiskValue(value: number) {
  if (value === 0) {
    return 0;
  }

  if (value < 1) {
    return 1;
  }
  if (value > 10) {
    return 10;
  }
  return value;
}

const SORT_OPTIONS = [
  { value: "default", label: "Orden predeterminado" },
  { value: "gravity", label: "Gravedad" },
  { value: "probability", label: "Probabilidad" },
  { value: "detection", label: "Detención" },
  { value: "risk", label: "NPR (riesgo)" },
];

const PRIORITY_OPTIONS = [
  { value: "all", label: "Todas" },
  { value: "alta", label: "Alta" },
  { value: "media", label: "Media" },
  { value: "baja", label: "Baja" },
];

interface SubtareaRiskState {
  id: number;
  categoriaNombre: string;
  nombre: string;
  prioridad?: string | null;
  gravedad: number;
  probabilidad: number;
  detencion: number;
  hasRisk: boolean;
  npr: number;
  nivel: string;
  originalGravedad: number;
  originalProbabilidad: number;
  originalDetencion: number;
}

export const MatrizRiesgo: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [auditoria, setAuditoria] = useState<Auditoria | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingAll, setSavingAll] = useState(false);
  const [savingIds, setSavingIds] = useState<number[]>([]);
  const [subtareas, setSubtareas] = useState<SubtareaRiskState[]>([]);

  useEffect(() => {
    const fetchAuditoria = async () => {
      if (!id) return;
      try {
        const data = await auditoriaService.getAuditoria(id);
        setAuditoria(data);

        const flatSubtareas: SubtareaRiskState[] = [];
        data.categorias?.forEach((categoria: any) => {
          categoria.subtareas?.forEach((subtarea: Subtarea) => {
            const gravedad = subtarea.gravedad_riesgo ?? 0;
            const probabilidad = subtarea.probabilidad_riesgo ?? 0;
            const detencion = subtarea.detencion_riesgo ?? 0;
            // Preferimos el NPR calculado por el backend; si no viene, lo
            // reproducimos localmente con la misma fórmula.
            const npr =
              subtarea.npr ?? computeNpr(gravedad, probabilidad, detencion);
            flatSubtareas.push({
              id: subtarea.id,
              categoriaNombre: categoria.nombre,
              nombre: subtarea.nombre,
              prioridad: subtarea.prioridad ?? null,
              gravedad,
              probabilidad,
              detencion,
              hasRisk:
                subtarea.gravedad_riesgo != null ||
                subtarea.probabilidad_riesgo != null ||
                subtarea.detencion_riesgo != null,
              npr,
              nivel: subtarea.nivel_riesgo ?? (npr ? getRiskLabel(npr).label : "Sin datos"),
              originalGravedad: gravedad,
              originalProbabilidad: probabilidad,
              originalDetencion: detencion,
            });
          });
        });

        setSubtareas(flatSubtareas);
      } catch (error) {
        console.error(error);
        addToast("No se pudo cargar la auditoría.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchAuditoria();
  }, [id, addToast]);

  const [sortBy, setSortBy] = useState("default");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const filteredSubtareas = useMemo(() => {
    const filtered = subtareas.filter((task) => {
      if (priorityFilter === "all") return true;
      return task.prioridad === priorityFilter;
    });

    if (sortBy === "gravity") {
      return [...filtered].sort((a, b) => b.gravedad - a.gravedad);
    }
    if (sortBy === "probability") {
      return [...filtered].sort((a, b) => b.probabilidad - a.probabilidad);
    }
    if (sortBy === "detection") {
      return [...filtered].sort((a, b) => b.detencion - a.detencion);
    }
    if (sortBy === "risk") {
      return [...filtered].sort((a, b) => b.npr - a.npr);
    }
    return filtered;
  }, [subtareas, priorityFilter, sortBy]);

  const totalTasks = filteredSubtareas.length;
  const avgGravedad = useMemo(() => {
    if (!totalTasks) return 0;
    return Number(
      (
        filteredSubtareas.reduce((sum, task) => sum + task.gravedad, 0) /
        totalTasks
      ).toFixed(1),
    );
  }, [filteredSubtareas, totalTasks]);

  const avgProbabilidad = useMemo(() => {
    if (!totalTasks) return 0;
    return Number(
      (
        filteredSubtareas.reduce((sum, task) => sum + task.probabilidad, 0) /
        totalTasks
      ).toFixed(1),
    );
  }, [filteredSubtareas, totalTasks]);

  const avgDetencion = useMemo(() => {
    if (!totalTasks) return 0;
    return Number(
      (
        filteredSubtareas.reduce((sum, task) => sum + task.detencion, 0) /
        totalTasks
      ).toFixed(1),
    );
  }, [filteredSubtareas, totalTasks]);

  const nprGlobal = useMemo(() => {
    if (!totalTasks) return 0;
    return Math.round(
      filteredSubtareas.reduce((sum, task) => sum + task.npr, 0) / totalTasks,
    );
  }, [filteredSubtareas, totalTasks]);

  const criticalTasks = useMemo(
    () => filteredSubtareas.filter((task) => task.npr > 450).length,
    [filteredSubtareas],
  );

  const hasTaskChanged = (task: SubtareaRiskState) => {
    return (
      task.gravedad !== task.originalGravedad ||
      task.probabilidad !== task.originalProbabilidad ||
      task.detencion !== task.originalDetencion
    );
  };

  const isTaskSaved = (task: SubtareaRiskState) =>
    task.hasRisk && !hasTaskChanged(task);

  const isValidRiskTask = (task: SubtareaRiskState) =>
    task.gravedad >= 1 &&
    task.gravedad <= 10 &&
    task.probabilidad >= 1 &&
    task.probabilidad <= 10 &&
    task.detencion >= 1 &&
    task.detencion <= 10;

  const updateSubtareaField = (
    subtareaId: number,
    field: keyof SubtareaRiskState,
    value: number,
  ) => {
    setSubtareas((current) =>
      current.map((task) => {
        if (task.id !== subtareaId) return task;
        const updatedTask = { ...task, [field]: value } as SubtareaRiskState;
        const npr = computeNpr(
          updatedTask.gravedad,
          updatedTask.probabilidad,
          updatedTask.detencion,
        );
        return {
          ...updatedTask,
          npr,
          nivel: npr ? getRiskLabel(npr).label : "Sin datos",
        };
      }),
    );
  };

  const handleSaveSubtarea = async (subtareaId: number) => {
    const task = subtareas.find((item) => item.id === subtareaId);
    if (!task) return;
    if (!hasTaskChanged(task)) return;
    if (!isValidRiskTask(task)) {
      addToast("Los valores deben estar entre 1 y 10.", "error");
      return;
    }
    try {
      const response = await auditoriaService.updateSubtareaRiskMatrix(
        subtareaId,
        {
          gravedad_riesgo: task.gravedad,
          probabilidad_riesgo: task.probabilidad,
          detencion_riesgo: task.detencion,
        },
      );

      const updated = response.subtarea;
      // El backend ya resuelve npr y nivel_riesgo; los usamos como fuente de
      // verdad y solo hacemos fallback si no vinieran.
      const npr =
        updated.npr ??
        computeNpr(
          updated.gravedad_riesgo,
          updated.probabilidad_riesgo,
          updated.detencion_riesgo,
        );
      setSubtareas((current) =>
        current.map((item) =>
          item.id === subtareaId
            ? {
                ...item,
                gravedad: updated.gravedad_riesgo,
                probabilidad: updated.probabilidad_riesgo,
                detencion: updated.detencion_riesgo,
                npr,
                nivel: updated.nivel_riesgo ?? getRiskLabel(npr).label,
                hasRisk: true,
                originalGravedad: updated.gravedad_riesgo,
                originalProbabilidad: updated.probabilidad_riesgo,
                originalDetencion: updated.detencion_riesgo,
              }
            : item,
        ),
      );

      addToast("Riesgo guardado para la tarea.", "success");
    } catch (error) {
      console.error(error);
      addToast("Error al guardar el riesgo de la tarea.", "error");
    } finally {
      setSavingIds((current) => current.filter((id) => id !== subtareaId));
    }
  };

  const handleSaveAll = async () => {
    if (!filteredSubtareas.length) return;

    const invalidTask = filteredSubtareas.find(
      (task) => !isValidRiskTask(task),
    );
    if (invalidTask) {
      addToast(
        "Todas las tareas deben tener valores entre 1 y 10 antes de guardar.",
        "error",
      );
      return;
    }

    setSavingAll(true);

    try {
      const responses = await Promise.all(
        filteredSubtareas.map((task) =>
          auditoriaService.updateSubtareaRiskMatrix(task.id, {
            gravedad_riesgo: task.gravedad,
            probabilidad_riesgo: task.probabilidad,
            detencion_riesgo: task.detencion,
          }),
        ),
      );

      // Sincronizamos el estado con los valores resueltos por el backend
      // (npr y nivel_riesgo) y marcamos las tareas como guardadas.
      const updatedById = new Map<number, any>();
      responses.forEach((response) => {
        const updated = response?.subtarea;
        if (updated) {
          updatedById.set(updated.id, updated);
        }
      });

      setSubtareas((current) =>
        current.map((item) => {
          const updated = updatedById.get(item.id);
          if (!updated) return item;
          const npr =
            updated.npr ??
            computeNpr(
              updated.gravedad_riesgo,
              updated.probabilidad_riesgo,
              updated.detencion_riesgo,
            );
          return {
            ...item,
            gravedad: updated.gravedad_riesgo,
            probabilidad: updated.probabilidad_riesgo,
            detencion: updated.detencion_riesgo,
            npr,
            nivel: updated.nivel_riesgo ?? getRiskLabel(npr).label,
            hasRisk: true,
            originalGravedad: updated.gravedad_riesgo,
            originalProbabilidad: updated.probabilidad_riesgo,
            originalDetencion: updated.detencion_riesgo,
          };
        }),
      );

      addToast("Matriz guardada correctamente.", "success");
    } catch (error) {
      console.error(error);
      addToast("Error al guardar las tareas.", "error");
    } finally {
      setSavingAll(false);
      setSavingIds([]);
    }
  };

  if (loading) {
    return <LoadingState message="Cargando matriz de riesgo..." />;
  }

  if (!auditoria) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl border border-gray-200 shadow-lg p-8 text-center max-w-xl">
          <h1 className="text-2xl font-semibold text-gray-900 mb-3">
            Auditoría no encontrada
          </h1>
          <p className="text-gray-500 mb-6">
            No se pudo encontrar la auditoría solicitada.
          </p>
          <button
            onClick={() => navigate("/auditorias")}
            className="inline-flex items-center justify-center rounded-full bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 font-semibold shadow-sm transition"
          >
            Volver a auditorías
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <button
          type="button"
          onClick={() => navigate("/auditorias")}
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-orange-600"
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Volver a auditorías
        </button>

        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium text-orange-600">
              Matriz de riesgo por tarea
            </p>
            <h1 className="text-3xl font-semibold text-gray-900">
              Evaluación de riesgo por tarea
            </h1>
            <p className="mt-2 text-sm text-gray-500 max-w-2xl">
              Aquí ves el nivel de riesgo (NPR) de cada tarea de la auditoría.
              El NPR se calcula como gravedad × probabilidad × (11 − detección).
              En detección, 1 = difícil de detectar (peor) y 10 = fácil de
              detectar (mejor).
            </p>
          </div>
          <button
            onClick={() => navigate(`/auditorias/${auditoria.id}`)}
            className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition"
          >
            Volver a auditoría
          </button>
        </div>

        <div className="grid gap-4 xl:grid-cols-5">
          <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-[0.24em] text-gray-500">
              Tareas evaluadas
            </p>
            <p className="mt-4 text-3xl font-semibold text-gray-900">
              {totalTasks}
            </p>
            <p className="text-sm text-gray-500">en esta vista</p>
          </div>
          <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-[0.24em] text-gray-500">
              Riesgo crítico
            </p>
            <p className="mt-4 text-3xl font-semibold text-red-700">
              {criticalTasks}
            </p>
            <p className="text-sm text-gray-500">tareas con NPR &gt; 450</p>
          </div>
          <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-[0.24em] text-gray-500">
              Gravedad promedio
            </p>
            <p className="mt-4 text-3xl font-semibold text-gray-900">
              {avgGravedad}
            </p>
            <p className="text-sm text-gray-500">sobre 10</p>
          </div>
          <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-[0.24em] text-gray-500">
              Probabilidad promedio
            </p>
            <p className="mt-4 text-3xl font-semibold text-gray-900">
              {avgProbabilidad}
            </p>
            <p className="text-sm text-gray-500">sobre 10</p>
          </div>
          <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-gray-500">
                  NPR promedio
                </p>
                <p className="mt-4 text-3xl font-semibold text-gray-900">
                  {nprGlobal}
                </p>
                <p className="text-sm text-gray-500">
                  {getRiskLabel(nprGlobal).label}
                </p>
              </div>
              <div className="rounded-3xl bg-orange-50 px-3 py-2 text-xs font-semibold text-orange-700">
                {getRiskLabel(nprGlobal).label}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Tareas de auditoría
              </h2>
              <p className="text-sm text-gray-500">
                Filtra y ordena para revisar las tareas con mayor riesgo.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="min-w-[180px]">
                <label className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-500">
                  Ordenar por
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="min-w-[160px]">
                <label className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-500">
                  Prioridad
                </label>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700"
                >
                  {PRIORITY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-3xl border border-gray-200">
            <div className="grid min-w-full gap-0 bg-orange-500 px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-white sm:grid-cols-[3fr_120px_120px_120px_120px_120px]">
              <div>Tarea de auditoría</div>
              <div className="hidden sm:block">Prioridad</div>
              <div className="text-center">
                Gravedad
                <br />
                (1-10)
              </div>
              <div className="text-center">
                Probabilidad
                <br />
                (1-10)
              </div>
              <div
                className="text-center"
                title="Escala invertida: 1 = difícil de detectar (peor), 10 = fácil de detectar (mejor)"
              >
                Detección
                <br />
                (1=peor · 10=mejor)
              </div>
              <div className="text-center">NPR</div>
            </div>
            <div className="divide-y divide-gray-200 bg-white">
              {filteredSubtareas.map((task) => {
                const riskLabel = getRiskLabel(task.npr);
                const isSaving = savingIds.includes(task.id);
                const taskSaved = isTaskSaved(task);
                const hasChanges = hasTaskChanged(task);
                return (
                  <div
                    key={task.id}
                    className="grid min-w-full gap-0 px-5 py-5 text-sm items-center sm:grid-cols-[3fr_120px_120px_120px_120px_120px]"
                  >
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <p className="font-semibold text-gray-900">
                          {task.nombre}
                        </p>
                        <div className="flex items-center gap-2">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              taskSaved
                                ? "bg-emerald-100 text-emerald-700"
                                : hasChanges
                                  ? "bg-orange-100 text-orange-700"
                                  : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {taskSaved
                              ? "Guardado"
                              : hasChanges
                                ? "Con cambios"
                                : "Pendiente"}
                          </span>
                          <button
                            onClick={() => handleSaveSubtarea(task.id)}
                            disabled={
                              isSaving || !hasChanges || !isValidRiskTask(task)
                            }
                            className="rounded-full bg-orange-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-orange-300"
                          >
                            {isSaving ? "Guardando" : "Guardar"}
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">
                        Categoría: {task.categoriaNombre}
                      </p>
                    </div>
                    <div className="hidden sm:flex items-center justify-center">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          task.prioridad === "alta"
                            ? "bg-red-100 text-red-700"
                            : task.prioridad === "media"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {task.prioridad || "N/A"}
                      </span>
                    </div>
                    {[
                      {
                        label: "G",
                        value: task.gravedad,
                        field: "gravedad" as const,
                        inverted: false,
                      },
                      {
                        label: "P",
                        value: task.probabilidad,
                        field: "probabilidad" as const,
                        inverted: false,
                      },
                      {
                        label: "D",
                        value: task.detencion,
                        field: "detencion" as const,
                        inverted: true,
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="flex flex-col items-center gap-2 rounded-3xl bg-slate-50 px-3 py-3 text-center"
                      >
                        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                          {item.label}
                        </span>
                        <input
                          type="number"
                          min={1}
                          max={10}
                          step={1}
                          inputMode="numeric"
                          value={item.value || ""}
                          onChange={(e) =>
                            updateSubtareaField(
                              task.id,
                              item.field,
                              e.target.value === ""
                                ? 0
                                : normalizeRiskValue(Number(e.target.value)),
                            )
                          }
                          onBlur={(e) => {
                            const rawValue =
                              e.target.value === ""
                                ? 0
                                : Number(e.target.value);
                            updateSubtareaField(
                              task.id,
                              item.field,
                              normalizeRiskValue(rawValue),
                            );
                          }}
                          className="w-16 rounded-full border border-gray-200 bg-white px-2 py-2 text-center text-sm font-semibold text-gray-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                        />
                        <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
                          <div
                            className={`${item.value ? getMetricColor(item.value, item.inverted) : "bg-slate-300"} h-2.5 rounded-full transition-all duration-200`}
                            style={{
                              width: `${item.value ? Math.max(0, Math.min(10, item.value)) * 10 : 5}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-semibold text-gray-900">
                          {task.npr || "-"}
                        </span>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${riskLabel.color}`}
                        >
                          {task.npr ? riskLabel.label : "Sin datos"}
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100">
                        <div
                          className={`h-2 rounded-full ${getNprColor(task.npr)}`}
                          style={{
                            width: `${task.npr ? Math.min(100, (task.npr / MAX_NPR) * 100) : 0}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">
                Resumen rápido
              </h3>
              <div className="mt-5 space-y-3 text-sm text-gray-600">
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                  <span>Promedio gravedad</span>
                  <span className="font-semibold text-gray-900">
                    {avgGravedad}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                  <span>Promedio probabilidad</span>
                  <span className="font-semibold text-gray-900">
                    {avgProbabilidad}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                  <span>Promedio detección</span>
                  <span className="font-semibold text-gray-900">
                    {avgDetencion}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                  <span>NPR promedio</span>
                  <span className="font-semibold text-gray-900">
                    {nprGlobal}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={handleSaveAll}
              disabled={savingAll}
              className="w-full rounded-3xl bg-orange-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-orange-300"
            >
              {savingAll ? "Guardando..." : "Guardar Matriz"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
