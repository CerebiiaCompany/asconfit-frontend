import React, { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { auditoriaService } from "../../services/auditoriaService";
import { useToast } from "../../contexts/ToastContext";
import { LoadingState } from "../../components/common/LoadingState";
import { Auditoria, Subtarea } from "../../types/auditoria";
import { RiesgoItemsPanel } from "../../components/auditorias/matriz/RiesgoItemsPanel";
import { MapaCalorRiesgo, HeatMapTask } from "../../components/auditorias/matriz/MapaCalorRiesgo";
import { PdfMatrizRiesgoModal } from "../../components/auditorias/matriz/PdfMatrizRiesgoModal";

const RISK_LABELS = {
  critical: { label: "Crítico", color: "bg-rose-100 text-rose-800 border-rose-200" },
  high: { label: "Alto", color: "bg-orange-100 text-orange-800 border-orange-200" },
  moderate: { label: "Moderado", color: "bg-amber-100 text-amber-800 border-amber-200" },
  low: { label: "Bajo", color: "bg-emerald-100 text-emerald-800 border-emerald-200" },
};

const MAX_NPR = 1000;

function computeNpr(gravedad: number, probabilidad: number, detencion: number) {
  if (gravedad < 1 || probabilidad < 1 || detencion < 1) return 0;
  return gravedad * probabilidad * (11 - detencion);
}

function getRiskLabel(npr: number) {
  if (npr > 450) return RISK_LABELS.critical;
  if (npr > 225) return RISK_LABELS.high;
  if (npr > 100) return RISK_LABELS.moderate;
  return RISK_LABELS.low;
}

function getMetricColor(value: number, inverted = false) {
  const effective = inverted ? 11 - value : value;
  if (effective >= 8) return "bg-rose-500";
  if (effective >= 6) return "bg-amber-500";
  return "bg-emerald-500";
}

function normalizeRiskValue(value: number) {
  if (value === 0) return 0;
  if (value < 1) return 1;
  if (value > 10) return 10;
  return value;
}

const SORT_OPTIONS = [
  { value: "default", label: "Orden predeterminado" },
  { value: "gravity", label: "Mayor Gravedad" },
  { value: "probability", label: "Mayor Probabilidad" },
  { value: "detection", label: "Dificultad Detección" },
  { value: "risk", label: "Mayor NPR (Riesgo)" },
];

const PRIORITY_OPTIONS = [
  { value: "all", label: "Todas las prioridades" },
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
  const [subRiesgosMap, setSubRiesgosMap] = useState<Map<number, any[]>>(new Map());
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [showHeatMap, setShowHeatMap] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [priorityFilter, setPriorityFilter] = useState("all");

  // Edición inline del nombre
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingNombre, setEditingNombre] = useState("");
  const [savingNombre, setSavingNombre] = useState(false);
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingId !== null) editInputRef.current?.focus();
  }, [editingId]);

  const toggleExpand = useCallback((taskId: number) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      next.has(taskId) ? next.delete(taskId) : next.add(taskId);
      return next;
    });
  }, []);

  const fetchSubRiesgos = useCallback(async (subtareaIds: number[]) => {
    const map = new Map<number, any[]>();
    await Promise.all(
      subtareaIds.map(async (subId) => {
        try {
          const items = await auditoriaService.getRiesgoItems(subId);
          if (items && items.length > 0) {
            map.set(subId, items);
          }
        } catch {
          // ignore error
        }
      })
    );
    setSubRiesgosMap(map);
  }, []);

  const startEditNombre = useCallback((task: SubtareaRiskState) => {
    setEditingId(task.id);
    setEditingNombre(task.nombre);
  }, []);

  const cancelEditNombre = useCallback(() => {
    setEditingId(null);
    setEditingNombre("");
  }, []);

  const saveEditNombre = useCallback(async (taskId: number) => {
    const trimmed = editingNombre.trim();
    if (!trimmed) { cancelEditNombre(); return; }
    setSavingNombre(true);
    try {
      await auditoriaService.updateSubtareaNombre(taskId, trimmed);
      setSubtareas(prev =>
        prev.map(t => t.id === taskId ? { ...t, nombre: trimmed } : t)
      );
      addToast("Nombre de la tarea actualizado.", "success");
      setEditingId(null);
    } catch {
      addToast("Error al actualizar el nombre.", "error");
    } finally {
      setSavingNombre(false);
    }
  }, [editingNombre, cancelEditNombre, addToast]);

  useEffect(() => {
    const fetchAuditoria = async () => {
      if (!id) return;
      try {
        const data = await auditoriaService.getAuditoria(id);
        setAuditoria(data);

        const flatSubtareas: SubtareaRiskState[] = [];
        const taskIds: number[] = [];

        data.categorias?.forEach((categoria: any) => {
          categoria.subtareas?.forEach((subtarea: Subtarea) => {
            taskIds.push(subtarea.id);
            const gravedad = subtarea.gravedad_riesgo ?? 0;
            const probabilidad = subtarea.probabilidad_riesgo ?? 0;
            const detencion = subtarea.detencion_riesgo ?? 0;
            const npr = subtarea.npr ?? computeNpr(gravedad, probabilidad, detencion);
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

        // Cargar sub-riesgos de las tareas
        if (taskIds.length > 0) {
          fetchSubRiesgos(taskIds);
        }
      } catch (error) {
        console.error(error);
        addToast("No se pudo cargar la auditoría.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchAuditoria();
  }, [id, addToast, fetchSubRiesgos]);

  const filteredSubtareas = useMemo(() => {
    let result = subtareas.filter((task) => {
      if (priorityFilter !== "all" && task.prioridad !== priorityFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          task.nombre.toLowerCase().includes(q) ||
          task.categoriaNombre.toLowerCase().includes(q)
        );
      }
      return true;
    });

    if (sortBy === "gravity") {
      result = [...result].sort((a, b) => b.gravedad - a.gravedad);
    } else if (sortBy === "probability") {
      result = [...result].sort((a, b) => b.probabilidad - a.probabilidad);
    } else if (sortBy === "detection") {
      result = [...result].sort((a, b) => a.detencion - b.detencion);
    } else if (sortBy === "risk") {
      result = [...result].sort((a, b) => b.npr - a.npr);
    }

    return result;
  }, [subtareas, priorityFilter, searchQuery, sortBy]);

  const totalTasks = filteredSubtareas.length;
  const avgGravedad = useMemo(() => {
    if (!totalTasks) return 0;
    return Number((filteredSubtareas.reduce((sum, task) => sum + task.gravedad, 0) / totalTasks).toFixed(1));
  }, [filteredSubtareas, totalTasks]);

  const avgProbabilidad = useMemo(() => {
    if (!totalTasks) return 0;
    return Number((filteredSubtareas.reduce((sum, task) => sum + task.probabilidad, 0) / totalTasks).toFixed(1));
  }, [filteredSubtareas, totalTasks]);

  const avgDetencion = useMemo(() => {
    if (!totalTasks) return 0;
    return Number((filteredSubtareas.reduce((sum, task) => sum + task.detencion, 0) / totalTasks).toFixed(1));
  }, [filteredSubtareas, totalTasks]);

  const nprGlobal = useMemo(() => {
    if (!totalTasks) return 0;
    return Math.round(filteredSubtareas.reduce((sum, task) => sum + task.npr, 0) / totalTasks);
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

  const hasAnyUnsavedChanges = useMemo(
    () => subtareas.some(hasTaskChanged),
    [subtareas]
  );

  const isTaskSaved = (task: SubtareaRiskState) =>
    task.hasRisk && !hasTaskChanged(task);

  const isValidRiskTask = (task: SubtareaRiskState) =>
    task.gravedad >= 1 &&
    task.gravedad <= 10 &&
    task.probabilidad >= 1 &&
    task.probabilidad <= 10 &&
    task.detencion >= 1 &&
    task.detencion <= 10;

  // Mapea tanto las tareas principales (1, 2...) como sus SUB-RIESGOS (1.1, 1.2...) para el Mapa de Calor 5x5 y Exportación PDF
  const mappedSubtareasForHeatMap: HeatMapTask[] = useMemo(() => {
    const list: HeatMapTask[] = [];

    filteredSubtareas.forEach((t, tIdx) => {
      const taskNumber = tIdx + 1;
      const subItems = subRiesgosMap.get(t.id) || [];

      // 1. Tarea Principal (ej: #1, #2)
      list.push({
        id: t.id,
        numIndex: taskNumber,
        nombre: t.nombre,
        categoriaNombre: t.categoriaNombre,
        gravedad: t.gravedad,
        probabilidad: t.probabilidad,
        detencion: t.detencion,
        npr: t.npr,
        nivel: t.nivel,
      });

      // 2. Sub-Riesgos Específicos Jerárquicos (ej: #1.1, #1.2)
      subItems.forEach((subItem, sIdx) => {
        const g = subItem.gravedad_riesgo ?? subItem.g ?? 0;
        const p = subItem.probabilidad_riesgo ?? subItem.p ?? 0;
        const d = subItem.detencion_riesgo ?? subItem.d ?? 0;
        const npr = subItem.npr ?? computeNpr(g, p, d);
        const nivel = subItem.nivel_riesgo ?? (npr ? getRiskLabel(npr).label : "Sin datos");

        list.push({
          id: -(subItem.id + 100000), // ID virtual único
          numIndex: `${taskNumber}.${sIdx + 1}`,
          nombre: `Sub-riesgo: ${subItem.nombre}`,
          categoriaNombre: `${t.categoriaNombre} • ${t.nombre}`,
          gravedad: g,
          probabilidad: p,
          detencion: d,
          npr,
          nivel,
        });
      });
    });

    return list;
  }, [filteredSubtareas, subRiesgosMap]);

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

  const stepFieldValue = (subtareaId: number, field: "gravedad" | "probabilidad" | "detencion", delta: number) => {
    const task = subtareas.find(t => t.id === subtareaId);
    if (!task) return;
    const currentVal = task[field] || 1;
    const newVal = Math.min(10, Math.max(1, currentVal + delta));
    updateSubtareaField(subtareaId, field, newVal);
  };

  const handleSaveSubtarea = async (subtareaId: number) => {
    const task = subtareas.find((item) => item.id === subtareaId);
    if (!task) return;
    if (!hasTaskChanged(task)) return;
    if (!isValidRiskTask(task)) {
      addToast("Los valores deben estar entre 1 y 10.", "error");
      return;
    }
    setSavingIds((current) => [...current, subtareaId]);
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

      addToast("Riesgo guardado.", "success");
    } catch (error) {
      console.error(error);
      addToast("Error al guardar el riesgo.", "error");
    } finally {
      setSavingIds((current) => current.filter((id) => id !== subtareaId));
    }
  };

  const handleSaveAll = async () => {
    const tasksToSave = subtareas.filter((task) => hasTaskChanged(task));

    if (tasksToSave.length === 0) {
      addToast("No hay cambios pendientes por guardar.", "info");
      return;
    }

    const invalidTask = tasksToSave.find((task) => !isValidRiskTask(task));
    if (invalidTask) {
      addToast(
        "Las tareas modificadas deben tener valores válidos entre 1 y 10 antes de guardar.",
        "error",
      );
      return;
    }

    setSavingAll(true);

    try {
      const responses = await Promise.all(
        tasksToSave.map((task) =>
          auditoriaService.updateSubtareaRiskMatrix(task.id, {
            gravedad_riesgo: task.gravedad,
            probabilidad_riesgo: task.probabilidad,
            detencion_riesgo: task.detencion,
          }),
        ),
      );

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
      addToast("Error al guardar la matriz.", "error");
    } finally {
      setSavingAll(false);
    }
  };

  const nombreEmpresa =
    auditoria?.empresa?.razon_social ||
    auditoria?.empresa?.nombre ||
    auditoria?.razon_social ||
    "Auditoría";

  if (loading) {
    return <LoadingState message="Cargando matriz de riesgo..." />;
  }

  if (!auditoria) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl border border-gray-200 shadow-xl p-8 text-center max-w-xl">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Auditoría no encontrada
          </h1>
          <p className="text-gray-500 mb-6">
            No se pudo encontrar la auditoría solicitada.
          </p>
          <button
            onClick={() => navigate("/auditorias")}
            className="inline-flex items-center justify-center rounded-full bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 font-semibold shadow-md transition"
          >
            Volver a auditorías
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 bg-slate-50/50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Navegación Superior */}
        <button
          type="button"
          onClick={() => navigate("/auditorias")}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-orange-600 transition-colors uppercase tracking-wider"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
          Volver a auditorías
        </button>

        {/* Tarjeta de Encabezado Principal (Hero Banner) */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-orange-600 border border-orange-200/80 text-[10px] font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
              {nombreEmpresa}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Matriz de Evaluación de Riesgos (NPR)
            </h1>
            <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
              El NPR (Número de Prioridad de Riesgo) se calcula como: <strong className="text-slate-700">Gravedad × Probabilidad × (11 − Detección)</strong>.
              Valora la gravedad del impacto, la frecuencia estimada y la capacidad de detección oportuna.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 relative z-10">
            <button
              type="button"
              onClick={() => setIsPdfModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-md shadow-orange-500/20 transition-all transform active:scale-95"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Exportar PDF
            </button>
            <button
              onClick={handleSaveAll}
              disabled={savingAll}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold shadow-md transition-all active:scale-95"
            >
              {savingAll ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
                  Guardando...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Guardar Todo
                </>
              )}
            </button>
            <button
              onClick={() => navigate(`/auditorias/${auditoria.id}`)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold shadow-sm transition"
            >
              Ver Auditoría
            </button>
          </div>
        </div>

        {/* Dashboard de Tarjetas KPI */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Tareas Evaluadas</p>
            <p className="mt-2 text-2xl font-black text-slate-900">{totalTasks}</p>
            <p className="text-[11px] text-slate-400 font-medium">en vista actual</p>
          </div>
          <div className="bg-white rounded-2xl border border-rose-200/80 p-4 shadow-sm bg-gradient-to-b from-rose-50/30 to-white">
            <p className="text-[10px] font-bold uppercase tracking-wider text-rose-600">Riesgo Crítico</p>
            <p className="mt-2 text-2xl font-black text-rose-700">{criticalTasks}</p>
            <p className="text-[11px] text-rose-500 font-medium">tareas con NPR &gt; 450</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Prom. Gravedad</p>
            <p className="mt-2 text-2xl font-black text-slate-900">{avgGravedad} <span className="text-xs font-normal text-slate-400">/10</span></p>
            <div className="h-1.5 w-full bg-slate-100 rounded-full mt-1.5 overflow-hidden">
              <div className={`h-full ${getMetricColor(avgGravedad)}`} style={{ width: `${avgGravedad * 10}%` }}></div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Prom. Probabilidad</p>
            <p className="mt-2 text-2xl font-black text-slate-900">{avgProbabilidad} <span className="text-xs font-normal text-slate-400">/10</span></p>
            <div className="h-1.5 w-full bg-slate-100 rounded-full mt-1.5 overflow-hidden">
              <div className={`h-full ${getMetricColor(avgProbabilidad)}`} style={{ width: `${avgProbabilidad * 10}%` }}></div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-orange-200/80 p-4 shadow-sm bg-gradient-to-b from-orange-50/30 to-white">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-orange-600">NPR Global</p>
                <p className="mt-2 text-2xl font-black text-orange-950">{nprGlobal}</p>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${getRiskLabel(nprGlobal).color}`}>
                {getRiskLabel(nprGlobal).label}
              </span>
            </div>
          </div>
        </div>

        {/* Componente Mapa de Calor 5x5 (Incluye Tareas #1, #2 y Sub-Riesgos #1.1, #1.2) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              Mapa de Calor de Riesgos (5×5)
            </h2>
            <button
              type="button"
              onClick={() => setShowHeatMap((prev) => !prev)}
              className="text-xs font-bold text-orange-600 hover:text-orange-700 transition"
            >
              {showHeatMap ? "Ocultar Mapa" : "Mostrar Mapa"}
            </button>
          </div>

          {showHeatMap && (
            <MapaCalorRiesgo
              tasks={mappedSubtareasForHeatMap}
              onSelectTask={(taskId) => {
                const targetId = taskId < 0 ? subtareas.find(s => (subRiesgosMap.get(s.id) || []).some(item => -(item.id + 100000) === taskId))?.id || taskId : taskId;
                const elem = document.getElementById(`task-row-${targetId}`);
                elem?.scrollIntoView({ behavior: "smooth", block: "center" });
              }}
            />
          )}
        </div>

        {/* Sección de Tareas y Filtros */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-sm space-y-5">
          {/* Barra de Búsqueda y Filtros */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-slate-100 pb-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Tareas de Auditoría y Sub-Riesgos
              </h2>
              <p className="text-xs text-slate-500">
                Ajusta Gravedad (G), Probabilidad (P) y Detección (D) para recalcular el riesgo automáticamente.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Caja de Búsqueda */}
              <div className="relative min-w-[200px]">
                <input
                  type="text"
                  placeholder="Buscar tarea..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-full border border-gray-300 bg-slate-50 focus:bg-white outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition"
                />
                <svg className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* Filtro Prioridad */}
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="rounded-full border border-gray-300 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 outline-none focus:border-orange-500"
              >
                {PRIORITY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              {/* Ordenar Por */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-full border border-gray-300 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 outline-none focus:border-orange-500"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Encabezado de Columnas */}
          <div className="hidden sm:grid sm:grid-cols-[2.5fr_100px_110px_110px_110px_110px] gap-2 bg-slate-100/80 px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-wider text-slate-500 items-center">
            <div>Tarea de Auditoría</div>
            <div className="text-center">Prioridad</div>
            <div className="text-center" title="Impacto del riesgo (1-10)">Gravedad (G)</div>
            <div className="text-center" title="Frecuencia (1-10)">Probab. (P)</div>
            <div className="text-center" title="Facilidad de detección (1=peor, 10=mejor)">Detec. (D)</div>
            <div className="text-center">NPR / Nivel</div>
          </div>

          {/* Lista de Filas de Tareas */}
          <div className="space-y-3">
            {filteredSubtareas.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-gray-300 text-slate-400 text-xs">
                No se encontraron tareas coincidiendo con los filtros.
              </div>
            ) : (
              filteredSubtareas.map((task, idx) => {
                const isSaving = savingIds.includes(task.id);
                const taskSaved = isTaskSaved(task);
                const hasChanges = hasTaskChanged(task);
                const subItemsCount = (subRiesgosMap.get(task.id) || []).length;

                return (
                  <div
                    key={task.id}
                    id={`task-row-${task.id}`}
                    className={`rounded-2xl border ${hasChanges ? "border-orange-300 bg-orange-50/20" : "border-slate-200/80 bg-white"} p-4 transition-all shadow-sm hover:shadow-md space-y-3`}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-[2.5fr_100px_110px_110px_110px_110px] gap-3 items-center">
                      {/* Columna 1: Nombre de Tarea e Información */}
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] font-black shrink-0">
                            {idx + 1}
                          </span>

                          {editingId === task.id ? (
                            <span className="flex items-center gap-2 flex-1">
                              <input
                                ref={editInputRef}
                                type="text"
                                value={editingNombre}
                                onChange={e => setEditingNombre(e.target.value)}
                                onKeyDown={e => {
                                  if (e.key === "Enter") { e.preventDefault(); saveEditNombre(task.id); }
                                  if (e.key === "Escape") cancelEditNombre();
                                }}
                                disabled={savingNombre}
                                className="flex-1 rounded-lg border border-orange-400 bg-white px-2 py-1 text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-orange-300"
                              />
                              <button
                                type="button"
                                onClick={() => saveEditNombre(task.id)}
                                disabled={savingNombre || !editingNombre.trim()}
                                className="rounded-full bg-orange-500 text-white p-1 transition hover:bg-orange-600 disabled:opacity-40"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                              </button>
                              <button
                                type="button"
                                onClick={cancelEditNombre}
                                className="rounded-full bg-gray-200 text-gray-600 p-1 transition hover:bg-gray-300"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                              </button>
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5 group font-bold text-slate-900 text-sm">
                              <span>{task.nombre}</span>
                              <button
                                type="button"
                                onClick={() => startEditNombre(task)}
                                className="opacity-0 group-hover:opacity-100 rounded p-1 text-gray-400 hover:text-orange-600 hover:bg-orange-50 transition-all"
                                title="Editar nombre"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-2.828 1.172H7v-2a4 4 0 011.172-2.828z" /></svg>
                              </button>
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span className="text-[11px] font-medium text-slate-500">
                            Cat: <span className="font-semibold text-slate-700">{task.categoriaNombre}</span>
                          </span>
                          <span className="text-slate-300">•</span>
                          <button
                            type="button"
                            onClick={() => toggleExpand(task.id)}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-600 hover:text-orange-700 transition"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={expandedItems.has(task.id) ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                            </svg>
                            {expandedItems.has(task.id) ? "Ocultar Sub-riesgos" : `Sub-riesgos (${subItemsCount})`}
                          </button>
                        </div>
                      </div>

                      {/* Columna 2: Prioridad y Estado */}
                      <div className="flex flex-col items-center gap-1.5">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${task.prioridad === "alta" ? "bg-red-100 text-red-700" :
                            task.prioridad === "media" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
                          }`}>
                          {task.prioridad || "Normal"}
                        </span>
                        {hasChanges ? (
                          <button
                            type="button"
                            onClick={() => handleSaveSubtarea(task.id)}
                            disabled={isSaving}
                            className="px-2.5 py-1 rounded-full bg-orange-600 hover:bg-orange-700 text-white text-[10px] font-bold transition shadow-xs"
                          >
                            {isSaving ? "Guardando" : "Guardar"}
                          </button>
                        ) : taskSaved ? (
                          <span className="text-[10px] font-bold text-emerald-600">✓ Guardado</span>
                        ) : null}
                      </div>

                      {/* Columnas de Métricas: Gravedad (G), Probabilidad (P), Detección (D) */}
                      {[
                        { field: "gravedad" as const, label: "G", val: task.gravedad, inverted: false },
                        { field: "probabilidad" as const, label: "P", val: task.probabilidad, inverted: false },
                        { field: "detencion" as const, label: "D", val: task.detencion, inverted: true },
                      ].map(({ field, label, val, inverted }) => (
                        <div key={label} className="bg-slate-50/80 p-2 rounded-xl border border-slate-200/60 flex flex-col items-center gap-1.5">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</span>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => stepFieldValue(task.id, field, -1)}
                              className="w-5 h-5 rounded-full bg-white border border-gray-300 text-gray-600 hover:bg-gray-100 text-xs font-bold flex items-center justify-center shadow-xs"
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min={1}
                              max={10}
                              value={val || ""}
                              onChange={(e) => updateSubtareaField(task.id, field, e.target.value === "" ? 0 : normalizeRiskValue(Number(e.target.value)))}
                              className="w-8 text-center text-xs font-extrabold text-slate-900 bg-transparent outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => stepFieldValue(task.id, field, 1)}
                              className="w-5 h-5 rounded-full bg-white border border-gray-300 text-gray-600 hover:bg-gray-100 text-xs font-bold flex items-center justify-center shadow-xs"
                            >
                              +
                            </button>
                          </div>
                          <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${getMetricColor(val, inverted)}`}
                              style={{ width: `${Math.max(0, Math.min(10, val)) * 10}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}

                      {/* Columna NPR */}
                      <div className="bg-white border border-slate-200/80 p-2.5 rounded-2xl flex flex-col items-center justify-center text-center shadow-xs">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">NPR</span>
                        <span className="text-base font-black text-slate-900 mt-0.5">{task.npr || "-"}</span>
                        <span className={`mt-0.5 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${task.npr > 450 ? "bg-rose-100 text-rose-800 border border-rose-200" :
                            task.npr > 225 ? "bg-orange-100 text-orange-800 border border-orange-200" :
                              task.npr > 100 ? "bg-amber-100 text-amber-800 border border-amber-200" : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                          }`}>
                          {task.nivel}
                        </span>
                      </div>
                    </div>

                    {/* Sub-ítems de riesgo expandibles */}
                    {expandedItems.has(task.id) && (
                      <div className="pt-3 border-t border-slate-100">
                        <RiesgoItemsPanel
                          subtareaId={task.id}
                          onItemsUpdated={() => fetchSubRiesgos(subtareas.map(s => s.id))}
                        />
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Notificación flotante si hay cambios sin guardar */}
      {hasAnyUnsavedChanges && (
        <div className="fixed bottom-6 right-6 z-40 bg-slate-900 text-white px-5 py-3 rounded-full shadow-2xl border border-slate-700 flex items-center gap-4 animate-bounce">
          <span className="text-xs font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping"></span>
            Tienes cambios no guardados en la matriz
          </span>
          <button
            type="button"
            onClick={handleSaveAll}
            disabled={savingAll}
            className="px-4 py-1.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition shadow-sm"
          >
            {savingAll ? "Guardando..." : "Guardar Ahora"}
          </button>
        </div>
      )}

      {auditoria && (
        <PdfMatrizRiesgoModal
          isOpen={isPdfModalOpen}
          onClose={() => setIsPdfModalOpen(false)}
          auditoria={auditoria}
          subtareas={mappedSubtareasForHeatMap}
          stats={{
            totalTasks,
            criticalTasks,
            avgGravedad,
            avgProbabilidad,
            avgDetencion,
            nprGlobal,
            nprLabel: getRiskLabel(nprGlobal),
          }}
        />
      )}
    </div>
  );
};
