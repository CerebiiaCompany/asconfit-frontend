import React, { useState } from "react";
import { UserSettingsProps, TabType } from "../types/userSettings.types";
import { useUserProfile } from "../hooks/useUserProfile";
import { usePasswordUpdate } from "../hooks/usePasswordUpdate";
import { SettingsHeader, ProfileTab, PasswordTab } from "./settings";

export const UserSettings: React.FC<UserSettingsProps> = ({
  initialUser,
  onBack,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>("profile");

  const {
    user,
    name,
    setName,
    email,
    setEmail,
    profileLoading,
    profileMessage,
    handleProfileUpdate,
  } = useUserProfile(initialUser);

  const {
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    passwordLoading,
    passwordMessage,
    handlePasswordUpdate,
  } = usePasswordUpdate();

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <SettingsHeader onBack={onBack} />

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab("profile")}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm transition duration-150 ${
                activeTab === "profile"
                  ? "border-orange-600 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Perfil
              </div>
            </button>
            <button
              onClick={() => setActiveTab("password")}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm transition duration-150 ${
                activeTab === "password"
                  ? "border-orange-600 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                Contraseña
              </div>
            </button>
          </nav>
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <ProfileTab
            user={user}
            name={name}
            setName={setName}
            email={email}
            setEmail={setEmail}
            profileLoading={profileLoading}
            profileMessage={profileMessage}
            handleProfileUpdate={handleProfileUpdate}
          />
        )}

        {/* Password Tab */}
        {activeTab === "password" && (
          <PasswordTab
            currentPassword={currentPassword}
            setCurrentPassword={setCurrentPassword}
            newPassword={newPassword}
            setNewPassword={setNewPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            passwordLoading={passwordLoading}
            passwordMessage={passwordMessage}
            handlePasswordUpdate={handlePasswordUpdate}
          />
        )}
      </div>
    </div>
  );
};
