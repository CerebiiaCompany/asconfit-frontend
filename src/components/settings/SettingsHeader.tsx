import React from "react";

interface SettingsHeaderProps {
  onBack: () => void;
}

export const SettingsHeader: React.FC<SettingsHeaderProps> = ({ onBack }) => {
  return (
    <div className="mb-6">
      <h1 className="mt-4 text-3xl font-bold text-gray-900">
        Configuración de Usuario
      </h1>
    </div>
  );
};
