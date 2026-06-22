import React, { useState } from "react";
import { UserSettingsProps, TabType } from "../types/userSettings.types";
import { useUserProfile } from "../hooks/useUserProfile";
import { usePasswordUpdate } from "../hooks/usePasswordUpdate";
import { ProfileTab, PasswordTab } from "./settings";

export const UserSettings: React.FC<UserSettingsProps> = ({
  initialUser,
  onBack,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>("profile");

  const {
    user,
    name, setName,
    email, setEmail,
    phone, setPhone,
    documentType, setDocumentType,
    documentNumber, setDocumentNumber,
    country, setCountry,
    city, setCity,
    department, setDepartment,
    profileLoading,
    profileMessage,
    handleProfileUpdate,
    handlePhotoUpload,
    handleCVUpload,
    handleTarjetaProfesionalUpload,
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
    <div className="max-w-[1200px] mx-auto py-10 px-6">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar Menu */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <nav className="space-y-4">
            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full text-left px-5 py-3 rounded-lg font-bold text-sm transition-all duration-200 ${activeTab === "profile"
                ? "bg-[#FFE4CC] text-[#F97316] shadow-sm"
                : "bg-transparent text-gray-400 hover:text-gray-600"
                }`}
            >
              Cuenta
            </button>
            <button
              onClick={() => setActiveTab("password")}
              className={`w-full text-left px-5 py-3 rounded-lg font-bold text-sm transition-all duration-200 ${activeTab === "password"
                ? "bg-[#FFE4CC] text-[#F97316] shadow-sm"
                : "bg-transparent text-gray-400 hover:text-gray-600"
                }`}
            >
              Cambiar Clave
            </button>
          </nav>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          {activeTab === "profile" ? (
            <ProfileTab
              user={user}
              name={name}
              setName={setName}
              email={email}
              setEmail={setEmail}
              phone={phone}
              setPhone={setPhone}
              documentType={documentType}
              setDocumentType={setDocumentType}
              documentNumber={documentNumber}
              setDocumentNumber={setDocumentNumber}
              country={country}
              setCountry={setCountry}
              city={city}
              setCity={setCity}
              department={department}
              setDepartment={setDepartment}
              profileLoading={profileLoading}
              profileMessage={profileMessage}
              handleProfileUpdate={handleProfileUpdate}
              handlePhotoUpload={handlePhotoUpload}
              handleCVUpload={handleCVUpload}
              handleTarjetaProfesionalUpload={handleTarjetaProfesionalUpload}
            />
          ) : (
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
    </div>
  );
};
