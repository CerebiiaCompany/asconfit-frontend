import React, { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const services = [
    { name: "Revisoría Fiscal", icon: "/Servicios-Asconfit/rf 1.png" },
    { name: "Actualización NIIF", icon: "/Servicios-Asconfit/niif 1.png" },
    { name: "Auditoría Externa", icon: "/Servicios-Asconfit/ae 1.png" },
    { name: "Evaluación y Estructura Societaria", icon: "/Servicios-Asconfit/ees 1.png" },
    { name: "Valoración de Empresas", icon: "/Servicios-Asconfit/ve 1.png" },
    { name: "Control Interno", icon: "/Servicios-Asconfit/ci 1.png" },
    { name: "Análisis de Riesgos", icon: "/Servicios-Asconfit/aft 1.png" },
    { name: "Auditoría Financiera y Tributaria", icon: "/Servicios-Asconfit/ar 1.png" },
    { name: "Inteligencia Artificial Aplicada a la Profesión Contable", icon: "/Servicios-Asconfit/ia 1.png" },
];

const N = services.length;
// Clonamos: [...services, ...services, ...services]
// Empezamos en el bloque del medio (offset = N) para poder ir en ambas direcciones
const cloned = [...services, ...services, ...services];
const DURATION = 420;

export const OurServices: React.FC = () => {
    const [trackIdx, setTrackIdx] = useState(N); // índice en el array clonado
    const [animated, setAnimated] = useState(true);
    const [busy, setBusy] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // índice real para los dots
    const current = trackIdx % N;

    const go = useCallback((delta: number) => {
        if (busy) return;
        setBusy(true);
        setAnimated(true);
        setTrackIdx((t) => t + delta);

        setTimeout(() => {
            // Después de la animación, si nos salimos del bloque central, reseteamos sin animación
            setTrackIdx((t) => {
                const real = ((t % N) + N) % N;
                const next = N + real;
                if (t !== next) {
                    setAnimated(false);
                    return next;
                }
                return t;
            });
            setBusy(false);
        }, DURATION + 20);
    }, [busy]);

    const next = useCallback(() => go(1), [go]);
    const prev = useCallback(() => go(-1), [go]);

    useEffect(() => {
        timerRef.current = setTimeout(next, 3200);
        return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    }, [trackIdx, next]);

    const pause = () => { if (timerRef.current) clearTimeout(timerRef.current); };
    const resume = () => { timerRef.current = setTimeout(next, 3200); };

    return (
        <div
            className="bg-white rounded-2xl shadow-xl p-6 h-full border border-gray-100 flex flex-col select-none"
            onMouseEnter={pause}
            onMouseLeave={resume}
        >
            <h3 className="text-xl font-semibold text-gray-800 text-center mb-4">
                Nuestros Servicios
            </h3>

            <div className="flex items-center gap-3 flex-grow min-h-0">
                {/* Flecha izq */}
                <button
                    onClick={prev}
                    className="flex-shrink-0 w-9 h-9 rounded-full bg-orange-50 hover:bg-orange-100 active:scale-90 text-orange-500 flex items-center justify-center transition-all shadow-sm"
                    aria-label="Anterior"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Viewport */}
                <div className="flex-grow overflow-hidden h-full">
                    {/* Track */}
                    <div
                        className="flex h-full"
                        style={{
                            width: `${cloned.length * 100}%`,
                            transform: `translateX(${-(trackIdx / cloned.length) * 100}%)`,
                            transition: animated
                                ? `transform ${DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`
                                : "none",
                        }}
                    >
                        {cloned.map((s, i) => (
                            <div
                                key={i}
                                className="flex flex-col items-center justify-center gap-5"
                                style={{ width: `${100 / cloned.length}%` }}
                            >
                                <div className="w-28 h-28 flex items-center justify-center bg-orange-50 rounded-2xl p-4 shadow-inner">
                                    <img
                                        src={s.icon}
                                        alt={s.name}
                                        className="max-w-full max-h-full object-contain"
                                        draggable={false}
                                    />
                                </div>
                                <span className="text-base font-semibold text-gray-800 text-center leading-snug max-w-[200px]">
                                    {s.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Flecha der */}
                <button
                    onClick={next}
                    className="flex-shrink-0 w-9 h-9 rounded-full bg-orange-50 hover:bg-orange-100 active:scale-90 text-orange-500 flex items-center justify-center transition-all shadow-sm"
                    aria-label="Siguiente"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-1.5 mt-4">
                {services.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => {
                            if (i === current) return;
                            let delta = i - current;
                            if (delta > N / 2) delta -= N;
                            if (delta < -N / 2) delta += N;
                            go(delta);
                        }}
                        className={`rounded-full transition-all duration-300 ${i === current
                            ? "w-6 h-2 bg-orange-500"
                            : "w-2 h-2 bg-gray-200 hover:bg-orange-300"
                            }`}
                        aria-label={`Servicio ${i + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};
