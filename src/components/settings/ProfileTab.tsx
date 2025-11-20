import React from "react";
import { Alert } from "../common/Alert";

interface ProfileTabProps {
  user: any;
  name: string;
  setName: (name: string) => void;
  email: string;
  setEmail: (email: string) => void;
  profileLoading: boolean;
  profileMessage: { type: "success" | "error"; text: string } | null;
  handleProfileUpdate: (e: React.FormEvent) => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  user,
  name,
  setName,
  email,
  setEmail,
  profileLoading,
  profileMessage,
  handleProfileUpdate,
}) => {
  return (
    <div className="p-6">
      <form onSubmit={handleProfileUpdate} className="space-y-6">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Nombre completo
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent transition duration-150"
            required
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Correo electrónico
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent transition duration-150"
            required
          />
        </div>

        {profileMessage && (
          <Alert type={profileMessage.type} message={profileMessage.text} />
        )}

        <button
          type="submit"
          disabled={profileLoading}
          className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-offset-2 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {profileLoading ? "Guardando..." : "Guardar cambios"}
        </button>
      </form>
    </div>
  );
};
