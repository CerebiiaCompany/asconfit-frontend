import React from "react";
import { Alert } from "../common/Alert";

interface ProfileTabProps {
  user: any;
  name: string;
  setName: (name: string) => void;
  email: string;
  setEmail: (email: string) => void;
  cargo: string;
  setCargo: (cargo: string) => void;
  firstName: string;
  setFirstName: (firstName: string) => void;
  lastName: string;
  setLastName: (lastName: string) => void;
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
  handleProfileUpdate: (e: React.FormEvent) => void;
  handlePhotoUpload: (file: File) => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  user,
  name, setName,
  email, setEmail,
  cargo, setCargo,
  firstName, setFirstName,
  lastName, setLastName,
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
}) => {
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

  const photoUrl = user.profile_photo_path 
    ? `http://localhost:8000/storage/${user.profile_photo_path}`
    : null;
  return (
    <div className="p-6">
      {/* Header / Photo Section */}
      <div className="flex items-start bg-gray-50 p-6 rounded-xl border border-gray-100 mb-8 relative">
        <div className="flex-shrink-0 w-32 h-40 bg-white border border-gray-200 rounded-xl flex items-center justify-center overflow-hidden">
          {photoUrl ? (
            <img src={photoUrl} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          )}
        </div>
        
        <div className="ml-6 flex-grow">
          <input
            type="file"
            ref={fileInputRef}
            onChange={onFileChange}
            accept="image/png, image/jpeg"
            className="hidden"
          />
          <button
            type="button"
            onClick={onPhotoClick}
            disabled={profileLoading}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center text-sm transition duration-150 font-medium"
          >
            Subir nueva foto
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          </button>
          <p className="mt-2 text-xs text-gray-400">Jpg o Png</p>
          
          <div className="mt-8">
            <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Usuario</p>
            <p className="text-sm font-medium text-gray-700">{email || user.email}</p>
          </div>
        </div>
      </div>

      {/* Personal Information Section */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 relative shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-800">Información Personal</h3>
        </div>

        <form onSubmit={handleProfileUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Cargo - Full Width */}
          <div className="md:col-span-2">
            <label htmlFor="cargo" className="block text-xs font-semibold text-gray-400 uppercase mb-1">Cargo</label>
            <input
              type="text"
              id="cargo"
              value={cargo}
              onChange={(e) => setCargo(e.target.value)}
              placeholder="Ej. Vicepresidente Ejecutivo"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-150 text-gray-700"
            />
          </div>

          {/* Nombres */}
          <div>
            <label htmlFor="firstName" className="block text-xs font-semibold text-gray-400 uppercase mb-1">Nombres</label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-150 text-gray-700"
            />
          </div>

          {/* Apellidos */}
          <div>
            <label htmlFor="lastName" className="block text-xs font-semibold text-gray-400 uppercase mb-1">Apellidos</label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-150 text-gray-700"
            />
          </div>

          {/* Correo Electrónico (Nombres en imagen, pero se refiere a email secundario o el mismo?) */}
          {/* En la imagen dice Correo Electrónico y muestra el email. Pondré el email base readonly */}
          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-gray-400 uppercase mb-1">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              value={email}
              disabled
              className="w-full px-4 py-2 border border-gray-100 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
            />
          </div>

          {/* Telefono */}
          <div>
            <label htmlFor="phone" className="block text-xs font-semibold text-gray-400 uppercase mb-1">Teléfono</label>
            <input
              type="text"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-150 text-gray-700"
            />
          </div>

          {/* Tipo de Documento */}
          <div>
            <label htmlFor="documentType" className="block text-xs font-semibold text-gray-400 uppercase mb-1">Tipo de Documento</label>
            <select
              id="documentType"
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-150 text-gray-700"
            >
              <option value="">Seleccionar...</option>
              <option value="CC">CC Cédula de Ciudadanía</option>
              <option value="CE">CE Cédula de Extranjería</option>
              <option value="NIT">NIT</option>
              <option value="PP">Pasaporte</option>
            </select>
          </div>

          {/* Número */}
          <div>
            <label htmlFor="documentNumber" className="block text-xs font-semibold text-gray-400 uppercase mb-1">Número</label>
            <input
              type="text"
              id="documentNumber"
              value={documentNumber}
              onChange={(e) => setDocumentNumber(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-150 text-gray-700"
            />
          </div>

          {/* País */}
          <div>
            <label htmlFor="country" className="block text-xs font-semibold text-gray-400 uppercase mb-1">País</label>
            <input
              type="text"
              id="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-150 text-gray-700"
            />
          </div>

          {/* Ciudad */}
          <div>
            <label htmlFor="city" className="block text-xs font-semibold text-gray-400 uppercase mb-1">Ciudad</label>
            <input
              type="text"
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-150 text-gray-700"
            />
          </div>

          {/* Departamento */}
          <div className="md:col-span-2">
            <label htmlFor="department" className="block text-xs font-semibold text-gray-400 uppercase mb-1">Departamento</label>
            <input
              type="text"
              id="department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-150 text-gray-700"
            />
          </div>

          <div className="md:col-span-2 mt-4">
            <button
              type="submit"
              disabled={profileLoading}
              className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-offset-2 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-md"
            >
              {profileLoading ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </form>
      </div>

      {profileMessage && (
        <div className="mt-6">
          <Alert type={profileMessage.type} message={profileMessage.text} />
        </div>
      )}
    </div>
  );
};
