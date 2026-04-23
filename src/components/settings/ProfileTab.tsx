import React from "react";
import { Alert } from "../common/Alert";
import { storageUrl } from "../../utils/storageUrl";

interface ProfileTabProps {
  user: any;
  name: string;
  setName: (name: string) => void;
  email: string;
  setEmail: (email: string) => void;
  phone: string;
  setPhone: (phone: string) => void;
  documentType: string;
  setDocumentType: (documentType: string) => void;
  documentNumber: string;
  setDocumentNumber: (documentNumber: string) => void;
  country: string;
  setCountry: (country: string) => void;
  city: string;
  setCity: (city: string) => void;
  department: string;
  setDepartment: (department: string) => void;
  profileLoading: boolean;
  profileMessage: { type: "success" | "error"; text: string } | null;
  handleProfileUpdate: (e: React.FormEvent) => Promise<boolean>;
  handlePhotoUpload: (file: File) => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  user,
  name,
  setName,
  email,
  setEmail,
  phone,
  setPhone,
  documentType,
  setDocumentType,
  documentNumber,
  setDocumentNumber,
  country,
  setCountry,
  city,
  setCity,
  department,
  setDepartment,
  profileLoading,
  profileMessage,
  handleProfileUpdate,
  handlePhotoUpload,
}) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const onPhotoClick = () => {
    fileInputRef.current?.click();
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handlePhotoUpload(file);
    }
  };

  const photoUrl = storageUrl(user.profile_photo_url ?? user.profile_photo_path);

  const fullName = (name || user.name || "").trim();

  if (!isEditing) {
    return (
      <div className="p-4 sm:p-8 space-y-6 sm:space-y-8 max-w-5xl">
        <h2 className="text-xl font-bold text-[#3B3B6D] mb-4">Mi Perfil</h2>

        {/* Profile Card / Photo Section */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-10 relative">
          <div className="w-32 h-40 sm:w-44 sm:h-56 bg-white border border-gray-200 rounded-2xl flex items-center justify-center overflow-hidden flex-shrink-0">
            {photoUrl ? (
              <img
                src={photoUrl}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <svg
                className="w-16 h-16 text-orange-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            )}
          </div>

          <div className="flex flex-col space-y-4 flex-grow w-full sm:w-auto sm:pt-2 items-center sm:items-start text-center sm:text-left">
            <div className="flex items-center">
              <input
                type="file"
                ref={fileInputRef}
                onChange={onFileChange}
                accept="image/*"
                className="hidden"
              />
              <button
                onClick={onPhotoClick}
                className="bg-[#F97316] hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl flex items-center font-bold text-sm shadow-md transition-all"
              >
                Subir nueva foto
                <svg
                  className="ml-2 w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
              </button>
            </div>
            <p className="text-sm text-gray-400">Jpg o Png</p>

            <div className="mt-auto">
              <p className="text-xs text-gray-400 font-medium">Usuario</p>
              <p className="text-lg font-bold text-gray-700">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Personal Details Card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm relative">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-8">
            <h3 className="text-xl font-bold text-gray-800">
              Información Personal
            </h3>
            <button
              onClick={() => setIsEditing(true)}
              className="bg-[#F97316] hover:bg-orange-600 text-white px-5 py-2 rounded-lg flex items-center justify-center sm:justify-start text-sm font-bold shadow-sm transition-all sm:w-auto w-full ml-auto"
            >
              Editar
              <svg
                className="ml-2 w-4 h-4"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12">
            <div className="col-span-2">
              <p className="text-xs text-gray-300 font-semibold mb-1">Cargo</p>
              <p className="text-lg font-bold text-[#4B4B4B]">
                {user.role?.nombre?.charAt(0).toUpperCase() +
                  user.role?.nombre?.slice(1)}
              </p>
            </div>

            <div className="col-span-2">
              <p className="text-xs text-gray-300 font-semibold mb-1">
                Nombre Completo
              </p>
              <p className="text-lg font-bold text-[#4B4B4B]">{fullName || "---"}</p>
            </div>

            <div>
              <p className="text-xs text-gray-300 font-semibold mb-1">
                Correo Electrónico
              </p>
              <p className="text-lg font-bold text-[#4B4B4B]">{user.email}</p>
            </div>

            <div>
              <p className="text-xs text-gray-300 font-semibold mb-1">
                Teléfono
              </p>
              <p className="text-lg font-bold text-[#4B4B4B]">
                {phone || "---"}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-300 font-semibold mb-1">
                Tipo de Documento
              </p>
              <p className="text-lg font-bold text-[#4B4B4B]">
                {documentType === "CC"
                  ? "CC Cédula de Ciudadanía"
                  : documentType === "CE"
                    ? "CE Cédula de Extranjería"
                    : documentType === "NIT"
                      ? "NIT"
                      : documentType === "PP"
                        ? "Pasaporte"
                        : documentType || "---"}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-300 font-semibold mb-1">Número</p>
              <p className="text-lg font-bold text-[#4B4B4B]">
                {documentNumber || "---"}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-300 font-semibold mb-1">País</p>
              <p className="text-lg font-bold text-[#4B4B4B]">
                {country || "---"}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-300 font-semibold mb-1">Ciudad</p>
              <p className="text-lg font-bold text-[#4B4B4B]">
                {city || "---"}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-300 font-semibold mb-1">
                Departamento
              </p>
              <p className="text-lg font-bold text-[#4B4B4B]">
                {department || "---"}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Edit Mode (Current Form)
  return (
    <div className="p-8 space-y-8 max-w-5xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-[#3B3B6D]">Editar Perfil</h2>
        <button
          onClick={() => setIsEditing(false)}
          className="text-gray-500 hover:text-gray-700 font-medium flex items-center"
        >
          Cancelar
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-8 shadow-sm">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const success = await handleProfileUpdate(e);
            if (success) {
              setIsEditing(false);
            }
          }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <div className="md:col-span-2">
            <label
              htmlFor="name"
              className="block text-xs font-semibold text-gray-400 uppercase mb-2"
            >
              Nombre Completo
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => {
                const value = e.target.value.replace(
                  /[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g,
                  "",
                );
                setName(value);
              }}
              placeholder="Ej. Juan Pérez"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-150 text-gray-700"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-xs font-semibold text-gray-400 uppercase mb-2"
            >
              Teléfono
            </label>
            <input
              type="text"
              id="phone"
              value={phone}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                setPhone(value);
              }}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-150 text-gray-700"
            />
          </div>

          <div>
            <label
              htmlFor="documentType"
              className="block text-xs font-semibold text-gray-400 uppercase mb-2"
            >
              Tipo de Documento
            </label>
            <select
              id="documentType"
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-150 text-gray-700"
            >
              <option value="">Seleccionar...</option>
              <option value="CC">CC Cédula de Ciudadanía</option>
              <option value="CE">CE Cédula de Extranjería</option>
              <option value="NIT">NIT</option>
              <option value="PP">Pasaporte</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="documentNumber"
              className="block text-xs font-semibold text-gray-400 uppercase mb-2"
            >
              Número de Documento
            </label>
            <input
              type="text"
              id="documentNumber"
              value={documentNumber}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                setDocumentNumber(value);
              }}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-150 text-gray-700"
            />
          </div>

          <div>
            <label
              htmlFor="country"
              className="block text-xs font-semibold text-gray-400 uppercase mb-2"
            >
              País
            </label>
            <input
              type="text"
              id="country"
              value={country}
              onChange={(e) => {
                const value = e.target.value.replace(
                  /[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g,
                  "",
                );
                setCountry(value);
              }}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-150 text-gray-700"
            />
          </div>

          <div>
            <label
              htmlFor="city"
              className="block text-xs font-semibold text-gray-400 uppercase mb-2"
            >
              Ciudad
            </label>
            <input
              type="text"
              id="city"
              value={city}
              onChange={(e) => {
                const value = e.target.value.replace(
                  /[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g,
                  "",
                );
                setCity(value);
              }}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-150 text-gray-700"
            />
          </div>

          <div>
            <label
              htmlFor="department"
              className="block text-xs font-semibold text-gray-400 uppercase mb-2"
            >
              Departamento
            </label>
            <input
              type="text"
              id="department"
              value={department}
              onChange={(e) => {
                const value = e.target.value.replace(
                  /[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g,
                  "",
                );
                setDepartment(value);
              }}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-150 text-gray-700"
            />
          </div>

          <div className="md:col-span-2 mt-6">
            <button
              type="submit"
              disabled={profileLoading}
              className="w-full bg-[#F97316] text-white py-3 px-4 rounded-xl hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-offset-2 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed font-bold shadow-md"
            >
              {profileLoading ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </form>
      </div>

      {profileMessage && (
        <div className="mt-4">
          <Alert type={profileMessage.type} message={profileMessage.text} />
        </div>
      )}
    </div>
  );
};
