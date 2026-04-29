import React from "react";

interface BreadcrumbTareaProps {
  empresa: string;
  onNavigateBack: () => void;
}

export const BreadcrumbTarea: React.FC<BreadcrumbTareaProps> = ({
  empresa,
  onNavigateBack,
}) => {
  return (
    <div className="mb-4">
      <div className="flex items-center space-x-2 text-gray-600">
        <button
          onClick={onNavigateBack}
          className="text-lg font-medium hover:text-gray-900 transition-colors"
        >
          Mis Encargos
        </button>
        <svg
          className="h-5 w-5 text-orange-500"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-lg font-medium text-gray-400">{empresa}</span>
      </div>
    </div>
  );
};
