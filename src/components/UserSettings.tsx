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
    especialidadRevisoriaFiscal, setEspecialidadRevisoriaFiscal,
    especialidadAuditoriaExterna, setEspecialidadAuditoriaExterna,
    especialidadEvaluacionEstructuras, setEspecialidadEvaluacionEstructuras,
    especialidadValoracionEmpresas, setEspecialidadValoracionEmpresas,
    especialidadControlInterno, setEspecialidadControlInterno,
    especialidadAuditoriaFinanciera, setEspecialidadAuditoriaFinanciera,
    especialidadAnalisisRiesgos, setEspecialidadAnalisisRiesgos,
    especialidadOtros, setEspecialidadOtros,
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
    <div className="max-w-4xl mx-auto py-6 px-4">
      {/* Header with tabs */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Mi Perfil</h1>
        <div className="flex gap-2 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${activeTab === "profile"
              ? "border-orange-500 text-orange-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
          >
            Cuenta
          </button>
          <button
            onClick={() => setActiveTab("password")}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${activeTab === "password"
              ? "border-orange-500 text-orange-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
          >
            Cambiar Clave
          </button>
        </div>
      </div>

      {/* Content */}
      <div>
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
            especialidadRevisoriaFiscal={especialidadRevisoriaFiscal}
            setEspecialidadRevisoriaFiscal={setEspecialidadRevisoriaFiscal}
            especialidadAuditoriaExterna={especialidadAuditoriaExterna}
            setEspecialidadAuditoriaExterna={setEspecialidadAuditoriaExterna}
            especialidadEvaluacionEstructuras={especialidadEvaluacionEstructuras}
            setEspecialidadEvaluacionEstructuras={setEspecialidadEvaluacionEstructuras}
            especialidadValoracionEmpresas={especialidadValoracionEmpresas}
            setEspecialidadValoracionEmpresas={setEspecialidadValoracionEmpresas}
            especialidadControlInterno={especialidadControlInterno}
            setEspecialidadControlInterno={setEspecialidadControlInterno}
            especialidadAuditoriaFinanciera={especialidadAuditoriaFinanciera}
            setEspecialidadAuditoriaFinanciera={setEspecialidadAuditoriaFinanciera}
            especialidadAnalisisRiesgos={especialidadAnalisisRiesgos}
            setEspecialidadAnalisisRiesgos={setEspecialidadAnalisisRiesgos}
            especialidadOtros={especialidadOtros}
            setEspecialidadOtros={setEspecialidadOtros}
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
  );
};
