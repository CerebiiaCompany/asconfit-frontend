import React from "react";

interface EmptyStateProps {
  message: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  message,
  buttonText,
  onButtonClick,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-600">{message}</p>
        {buttonText && onButtonClick && (
          <button
            onClick={onButtonClick}
            className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            {buttonText}
          </button>
        )}
      </div>
    </div>
  );
};
