import React from "react";
import { Finding } from "../../../types/finding.types";

interface FindingTabsProps {
    findings: Finding[];
    activeIndex: number;
    onSelect: (i: number) => void;
    onRemove: (i: number) => void;
    onAdd: () => void;
}

export const FindingTabs: React.FC<FindingTabsProps> = ({
    findings,
    activeIndex,
    onSelect,
    onRemove,
    onAdd,
}) => {
    if (findings.length <= 1) return null;

    return (
        <div className="flex items-center gap-2 px-6 pt-3 overflow-x-auto">
            {findings.map((_, i) => (
                <button
                    key={i}
                    onClick={() => onSelect(i)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                        activeIndex === i
                            ? "bg-orange-500 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                >
                    Hallazgo {i + 1}
                    <span
                        onClick={(e) => { e.stopPropagation(); onRemove(i); }}
                        className="ml-1 hover:text-red-300 cursor-pointer"
                    >
                        ×
                    </span>
                </button>
            ))}
            <button
                onClick={onAdd}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-500 hover:bg-orange-50 hover:text-orange-600 transition-colors whitespace-nowrap"
            >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Agregar
            </button>
        </div>
    );
};
