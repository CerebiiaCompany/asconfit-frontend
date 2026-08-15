import React from "react";

export interface HeatMapTask {
  id: number;
  numIndex: number; // Número ordinal (1, 2, 3...)
  nombre: string;
  categoriaNombre?: string;
  gravedad: number; // 1 - 10
  probabilidad: number; // 1 - 10
  detencion: number; // 1 - 10
  npr: number;
  nivel: string;
}

interface MapaCalorRiesgoProps {
  tasks: HeatMapTask[];
  selectedTaskId?: number | null;
  onSelectTask?: (taskId: number) => void;
  isPrintView?: boolean;
}

// Convierte valores de 1 a 10 a una escala de 1 a 5 para la matriz
export function getGridLevel(val: number): number {
  if (!val || val <= 0) return 1;
  return Math.min(5, Math.max(1, Math.ceil(val / 2)));
}

// Niveles del eje Y (Probabilidad) de arriba (5) a abajo (1)
const PROBABILIDAD_LABELS = [
  { level: 5, label: "Constante" },
  { level: 4, label: "Moderado" },
  { level: 3, label: "Ocasional" },
  { level: 2, label: "Posible" },
  { level: 1, label: "Improbable" },
];

// Niveles del eje X (Impacto / Gravedad) de izquierda (1) a derecha (5)
const IMPACTO_LABELS = [
  { level: 1, label: "Insignificante" },
  { level: 2, label: "Menor" },
  { level: 3, label: "Crítica" },
  { level: 4, label: "Mayor" },
  { level: 5, label: "Catastrófico" },
];

// Determina el color de la celda de la matriz 5x5 (y: Probabilidad 1-5, x: Impacto 1-5)
function getCellStyle(probLevel: number, impLevel: number): { bg: string; border: string; text: string } {
  // Verde: Riesgo Bajo
  const isGreen =
    (probLevel === 1 && impLevel <= 3) ||
    (probLevel === 2 && impLevel <= 2) ||
    (probLevel === 3 && impLevel === 1) ||
    (probLevel === 4 && impLevel === 1);

  // Rojo: Riesgo Crítico / Muy Alto
  const isRed =
    (probLevel === 5 && impLevel >= 3) ||
    (probLevel === 4 && impLevel >= 4) ||
    (probLevel === 3 && impLevel >= 4) ||
    (probLevel === 2 && impLevel === 5);

  if (isGreen) {
    return {
      bg: "bg-emerald-500/90",
      border: "border-emerald-600",
      text: "text-white",
    };
  }
  if (isRed) {
    return {
      bg: "bg-red-600/90",
      border: "border-red-700",
      text: "text-white",
    };
  }
  // Amarillo / Naranja: Riesgo Moderado - Alto
  return {
    bg: "bg-amber-400/95",
    border: "border-amber-500",
    text: "text-gray-900",
  };
}

export const MapaCalorRiesgo: React.FC<MapaCalorRiesgoProps> = ({
  tasks,
  selectedTaskId,
  onSelectTask,
  isPrintView = false,
}) => {
  // Agrupa las tareas por celda (probLevel, impLevel)
  const cellTasksMap = React.useMemo(() => {
    const map = new Map<string, HeatMapTask[]>();
    tasks.forEach((t) => {
      const imp = getGridLevel(t.gravedad);
      const prob = getGridLevel(t.probabilidad);
      const key = `${prob}-${imp}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(t);
    });
    return map;
  }, [tasks]);

  return (
    <div className={`w-full select-none ${isPrintView ? "p-1" : "p-4 bg-white rounded-3xl border border-gray-200 shadow-sm"}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            Mapa de Calor de Riesgos (5x5)
          </h3>
          <p className="text-xs text-gray-500">
            Distribución visual de tareas según su Probabilidad (Eje Y) e Impacto (Eje X).
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-emerald-500 border border-emerald-600 inline-block"></span>
            <span className="text-gray-600">Bajo</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-amber-400 border border-amber-500 inline-block"></span>
            <span className="text-gray-600">Moderado/Alto</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-red-600 border border-red-700 inline-block"></span>
            <span className="text-gray-600">Crítico</span>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        {/* Eje Y: Etiqueta Vertical "Probabilidad" */}
        <div className="flex items-center justify-center">
          <div className="bg-gray-900 text-white font-bold text-xs uppercase tracking-widest rounded-xl px-2 py-8 [writing-mode:vertical-lr] rotate-180 flex items-center justify-center shadow-sm">
            Probabilidad
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-1.5">
          {/* Matriz 5x5 + Etiquetas del Eje Y */}
          <div className="grid grid-cols-[110px_1fr] gap-2">
            {PROBABILIDAD_LABELS.map(({ level, label }) => (
              <React.Fragment key={level}>
                {/* Etiqueta del nivel de Probabilidad */}
                <div className="flex items-center justify-end pr-2 text-xs font-semibold text-gray-700 italic">
                  {label}
                </div>

                {/* Fila de 5 celdas de Impacto (1 a 5) */}
                <div className="grid grid-cols-5 gap-1.5">
                  {IMPACTO_LABELS.map(({ level: impLevel }) => {
                    const key = `${level}-${impLevel}`;
                    const cellTasks = cellTasksMap.get(key) || [];
                    const style = getCellStyle(level, impLevel);

                    return (
                      <div
                        key={key}
                        className={`min-h-[58px] p-1.5 rounded-xl border ${style.bg} ${style.border} flex flex-wrap items-center justify-center gap-1.5 transition-all relative group shadow-sm`}
                      >
                        {cellTasks.length === 0 ? (
                          <span className="text-[10px] text-white/30 font-mono select-none">
                            -
                          </span>
                        ) : (
                          cellTasks.map((t) => {
                            const isSelected = selectedTaskId === t.id;
                            return (
                              <button
                                key={t.id}
                                type="button"
                                onClick={() => onSelectTask?.(t.id)}
                                title={`#${t.numIndex} - ${t.nombre} (G:${t.gravedad}, P:${t.probabilidad})`}
                                className={`w-7 h-7 rounded-full bg-gray-900 text-white text-xs font-black flex items-center justify-center shadow-md transition-transform hover:scale-110 border-2 ${isSelected
                                    ? "border-white ring-2 ring-orange-500 scale-110 z-10"
                                    : "border-gray-800"
                                  }`}
                              >
                                {t.numIndex}
                              </button>
                            );
                          })
                        )}
                      </div>
                    );
                  })}
                </div>
              </React.Fragment>
            ))}
          </div>

          {/* Eje X: Etiquetas de Niveles de Impacto */}
          <div className="grid grid-cols-[110px_1fr] gap-2 mt-1">
            <div></div>
            <div className="grid grid-cols-5 gap-1.5 text-center">
              {IMPACTO_LABELS.map(({ level, label }) => (
                <div key={level} className="text-[11px] font-bold text-gray-700 italic truncate px-0.5">
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* Eje X: Etiqueta Horizontal "Impacto / Gravedad" */}
          <div className="grid grid-cols-[110px_1fr] gap-2 mt-1">
            <div></div>
            <div className="bg-gray-900 text-white font-bold text-xs uppercase tracking-widest rounded-xl py-1.5 text-center shadow-sm">
              Impacto / Gravedad
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
