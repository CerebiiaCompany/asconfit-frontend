import React from "react";
import { SEVERIDAD_CONFIG } from "../../../types/finding.types";

interface SeveridadSelectorProps {
    value: "critico" | "grave" | "leve" | "";
    onChange: (sev: "critico" | "grave" | "leve") => void;
}

export const SeveridadSelector: React.FC<SeveridadSelectorProps> = ({ value, onChange }) => (
    <div className="flex gap-2">
        {(["critico", "grave", "leve"] as const).map((sev) => {
            const cfg = SEVERIDAD_CONFIG[sev];
            const selected = value === sev;
            return (
                <button
                    key={sev}
                    type="button"
                    onClick={() => onChange(sev)}
                    className={`flex-1 flex flex-col items-center gap-1.5 py-2.5 rounded-lg border-2 transition-all text-xs font-medium ${
                        selected
                            ? `border-current ${cfg.text} bg-gray-50 ring-2 ${cfg.ring} ring-offset-1`
                            : "border-gray-200 text-gray-500 hover:border-gray-300"
                    }`}
                >
                    <span className={`w-3.5 h-3.5 rounded-full ${cfg.color}`} />
                    {cfg.label}
                </button>
            );
        })}
    </div>
);
