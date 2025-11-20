import React from "react";
import { Alert } from "../common/Alert";

interface PasswordTabProps {
  currentPassword: string;
  setCurrentPassword: (password: string) => void;
  newPassword: string;
  setNewPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (password: string) => void;
  passwordLoading: boolean;
  passwordMessage: { type: "success" | "error"; text: string } | null;
  handlePasswordUpdate: (e: React.FormEvent) => void;
}

export const PasswordTab: React.FC<PasswordTabProps> = ({
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  passwordLoading,
  passwordMessage,
  handlePasswordUpdate,
}) => {
  return (
    <div className="p-6">
      <form onSubmit={handlePasswordUpdate} className="space-y-6">
        <div>
          <label
            htmlFor="currentPassword"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Contraseña actual
          </label>
          <input
            type="password"
            id="currentPassword"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent transition duration-150"
            required
          />
        </div>

        <div>
          <label
            htmlFor="newPassword"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Nueva contraseña
          </label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent transition duration-150"
            required
            minLength={8}
          />
          <p className="mt-1 text-sm text-gray-500">Mínimo 8 caracteres</p>
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Confirmar nueva contraseña
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent transition duration-150"
            required
          />
        </div>

        {passwordMessage && (
          <Alert type={passwordMessage.type} message={passwordMessage.text} />
        )}

        <button
          type="submit"
          disabled={passwordLoading}
          className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-offset-2 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {passwordLoading ? "Actualizando..." : "Actualizar contraseña"}
        </button>
      </form>
    </div>
  );
};
