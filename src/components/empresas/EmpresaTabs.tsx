import React from "react";
import { Plus } from "lucide-react";

export const EmpresaTabs: React.FC = () => {
  return (
    <div className="flex gap-2 mb-2">
      <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-2.5 rounded text-sm font-bold shadow-sm transition-colors">
        Papeles de trabajo
      </button>
      <button className="bg-white border border-orange-200 text-gray-600 px-8 py-2.5 rounded text-sm font-bold shadow-sm hover:bg-gray-50 transition-colors">
        Auditorías
      </button>
      <button className="bg-white border border-orange-200 text-orange-400 px-4 py-2.5 rounded shadow-sm hover:bg-gray-50 transition-colors flex items-center justify-center">
        <Plus className="w-5 h-5" />
      </button>
    </div>
  );
};
