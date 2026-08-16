import React from "react";

export interface HeatMapTask {
  id: number;
  numIndex: string | number;
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

// Determina el color de fondo sólido colorido de las celdas de la matriz 5x5
function getCellStyle(probLevel: number, impLevel: number) {
  const isGreen =
    (probLevel === 1 && impLevel <= 3) ||
    (probLevel === 2 && impLevel <= 2) ||
    (probLevel === 3 && impLevel === 1) ||
    (probLevel === 4 && impLevel === 1);

  const isRed =
    (probLevel === 5 && impLevel >= 3) ||
    (probLevel === 4 && impLevel >= 4) ||
    (probLevel === 3 && impLevel >= 4) ||
    (probLevel === 2 && impLevel === 5);

  if (isGreen) {
    return {
      bg: "bg-emerald-500",
      border: "border-emerald-600/80",
      text: "text-white",
      hexBg: "#10b981",
      hexBorder: "#059669",
    };
  }
  if (isRed) {
    return {
      bg: "bg-rose-600",
      border: "border-rose-700/80",
      text: "text-white",
      hexBg: "#e11d48",
      hexBorder: "#be123c",
    };
  }
  return {
    bg: "bg-amber-400",
    border: "border-amber-500/80",
    text: "text-slate-900",
    hexBg: "#fbbf24",
    hexBorder: "#f59e0b",
  };
}

export const MapaCalorRiesgo: React.FC<MapaCalorRiesgoProps> = ({
  tasks,
  selectedTaskId,
  onSelectTask,
}) => {
  // Agrupa las tareas por celda (probLevel, impLevel)
  const cellTasksMap = React.useMemo(() => {
    const map = new Map<string, HeatMapTask[]>();
    tasks
      .filter(t => t.gravedad > 0 && t.probabilidad > 0 && t.detencion > 0)
      .forEach((t) => {
        const imp = getGridLevel(t.gravedad);
        const prob = getGridLevel(t.probabilidad);
        const key = `${prob}-${imp}`;
        if (!map.has(key)) map.set(key, []);
        map.get(key)!.push(t);
      });
    return map;
  }, [tasks]);

  return (
    <div className="w-full select-none bg-white p-2 print:p-0">
      {/* Header del Mapa de Calor */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">
            Mapa de Calor de Riesgos (5×5)
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Evaluación gráfica bidimensional: Probabilidad (Eje Vertical) vs. Impacto / Gravedad (Eje Horizontal).
          </p>
        </div>

        {/* Leyenda de Colores */}
        <div className="flex items-center gap-3 border border-slate-200 rounded-full px-4 py-1.5 text-xs font-bold text-slate-700 bg-white">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 inline-block shadow-xs" style={{ backgroundColor: "#10b981" }}></span>
            <span>Bajo</span>
          </div>
          <span className="text-slate-300">•</span>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full bg-amber-400 inline-block shadow-xs" style={{ backgroundColor: "#fbbf24" }}></span>
            <span>Moderado / Alto</span>
          </div>
          <span className="text-slate-300">•</span>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full bg-rose-600 inline-block shadow-xs" style={{ backgroundColor: "#e11d48" }}></span>
            <span>Crítico</span>
          </div>
        </div>
      </div>

      {/* Grilla 5x5 y Ejes */}
      <div className="flex gap-3 items-stretch">
        {/* Eje Y: Etiqueta Vertical "PROBABILIDAD" */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl px-2 py-8 flex items-center justify-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] [writing-mode:vertical-lr] rotate-180">
            PROBABILIDAD
          </span>
        </div>

        <div className="flex-1 flex flex-col gap-2">
          {/* Matriz 5x5 + Etiquetas del Eje Y */}
          <div className="grid grid-cols-[100px_1fr] gap-2 items-center">
            {PROBABILIDAD_LABELS.map(({ level, label }) => (
              <React.Fragment key={level}>
                {/* Etiqueta del nivel de Probabilidad */}
                <div className="text-right pr-3 text-xs font-bold text-slate-700 italic">
                  {label}
                </div>

                {/* Fila de 5 celdas de Impacto (1 a 5) */}
                <div className="grid grid-cols-5 gap-2">
                  {IMPACTO_LABELS.map(({ level: impLevel }) => {
                    const key = `${level}-${impLevel}`;
                    const cellTasks = cellTasksMap.get(key) || [];
                    const style = getCellStyle(level, impLevel);

                    return (
                      <div
                        key={key}
                        style={{
                          backgroundColor: style.hexBg,
                          borderColor: style.hexBorder,
                          WebkitPrintColorAdjust: "exact",
                          printColorAdjust: "exact",
                        }}
                        className={`h-[64px] p-1.5 rounded-2xl ${style.bg} ${style.border} flex flex-wrap content-center items-center justify-center gap-0.5 relative shadow-xs overflow-hidden`}
                      >
                        {cellTasks.length === 0 ? (
                          <span className={`text-xs select-none font-mono ${style.text} opacity-40`}>
                            -
                          </span>
                        ) : (
                          cellTasks.map((t) => {
                            const isSelected = selectedTaskId === t.id;
                            const compact = cellTasks.length > 3;
                            return (
                              <button
                                key={t.id}
                                type="button"
                                onClick={() => onSelectTask?.(t.id)}
                                title={`#${t.numIndex} — ${t.nombre}`}
                                style={{
                                  backgroundColor: "#ffffff",
                                  borderColor: "#0f172a",
                                  color: "#0f172a",
                                  WebkitPrintColorAdjust: "exact",
                                  printColorAdjust: "exact",
                                }}
                                className={`
                                  ${compact ? "px-1 min-w-[20px] h-[18px] text-[7px]" : "px-1.5 min-w-[26px] h-6 text-[9px]"}
                                  rounded-full bg-white border border-slate-900 text-slate-900
                                  font-black flex items-center justify-center shadow-sm
                                  hover:scale-110 transition-transform
                                  ${isSelected ? "ring-2 ring-orange-500 scale-110" : ""}
                                `}
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
          <div className="grid grid-cols-[100px_1fr] gap-2 mt-1">
            <div></div>
            <div className="grid grid-cols-5 gap-2 text-center">
              {IMPACTO_LABELS.map(({ level, label }) => (
                <div key={level} className="text-[11px] font-bold text-slate-700 italic">
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* Eje X: Etiqueta Horizontal "IMPACTO / GRAVEDAD" */}
          <div className="grid grid-cols-[100px_1fr] gap-2 mt-1">
            <div></div>
            <div className="bg-slate-50 border border-slate-200/80 rounded-full py-2 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">
                IMPACTO / GRAVEDAD
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
