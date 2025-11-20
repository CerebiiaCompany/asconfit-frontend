import React from "react";

interface FormActionsProps {
  onSubmit: () => void;
  onCancel?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  submitButtonClass?: string;
}

export const FormActions: React.FC<FormActionsProps> = ({
  onSubmit,
  onCancel,
  submitLabel = "Guardar",
  cancelLabel = "Cancelar",
  isLoading = false,
  submitButtonClass = "bg-orange-500 hover:bg-orange-600",
}) => {
  return (
    <div className="flex justify-end gap-3">
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-gray-200 text-gray-700 text-sm sm:text-base font-semibold rounded-lg hover:bg-gray-300 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {cancelLabel}
        </button>
      )}
      <button
        type="button"
        onClick={onSubmit}
        disabled={isLoading}
        className={`w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 text-white text-sm sm:text-base font-semibold rounded-lg transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${submitButtonClass}`}
      >
        {isLoading ? "Guardando..." : submitLabel}
      </button>
    </div>
  );
};
