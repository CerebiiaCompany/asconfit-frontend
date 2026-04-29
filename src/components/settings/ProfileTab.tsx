import React from "react";
import { Alert } from "../common/Alert";
import { storageUrl } from "../../utils/storageUrl";

interface ProfileTabProps {
  user: any;
  name: string; setName: (v: string) => void;
  email: string; setEmail: (v: string) => void;
  phone: string; setPhone: (v: string) => void;
  documentType: string; setDocumentType: (v: string) => void;
  documentNumber: string; setDocumentNumber: (v: string) => void;
  country: string; setCountry: (v: string) => void;
  city: string; setCity: (v: string) => void;
  department: string; setDepartment: (v: string) => void;
  profileLoading: boolean;
  profileMessage: { type: "success" | "error"; text: string } | null;
  handleProfileUpdate: (e: React.FormEvent) => Promise<boolean>;
  handlePhotoUpload: (file: File) => void;
  handleCVUpload?: (file: File) => void;
}

const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex flex-col gap-0.5">
    <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{label}</span>
    <span className="text-sm font-semibold text-gray-700">{value || "—"}</span>
  </div>
);

const docLabel = (t: string) => ({ CC: "Cédula de Ciudadanía", CE: "Cédula de Extranjería", NIT: "NIT", PP: "Pasaporte" }[t] || t || "—");

export const ProfileTab: React.FC<ProfileTabProps> = ({
  user, name, setName, email, setEmail, phone, setPhone,
  documentType, setDocumentType, documentNumber, setDocumentNumber,
  country, setCountry, city, setCity, department, setDepartment,
  profileLoading, profileMessage, handleProfileUpdate,
  handlePhotoUpload, handleCVUpload,
}) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const cvInputRef = React.useRef<HTMLInputElement>(null);

  const photoUrl = storageUrl(user.profile_photo_url ?? user.profile_photo_path);
  const fullName = (name || user.name || "").trim();
  const roleLabel = user.role?.nombre ? user.role.nombre.charAt(0).toUpperCase() + user.role.nombre.slice(1) : "";

  if (isEditing) {
    return (
      <div className="space-y-6 max-w-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Editar Perfil</h2>
            <p className="text-sm text-gray-400 mt-1">Actualiza tu información personal</p>
          </div>
          <button onClick={() => setIsEditing(false)}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Cancelar
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-300" />
          <form
            onSubmit={async e => { e.preventDefault(); const ok = await handleProfileUpdate(e); if (ok) setIsEditing(false); }}
            className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            {[
              { id: "name", label: "Nombre Completo", value: name, span: true, onChange: (v: string) => setName(v.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "")), type: "text" },
              { id: "phone", label: "Teléfono", value: phone, onChange: (v: string) => setPhone(v.replace(/\D/g, "")), type: "text" },
              { id: "country", label: "País", value: country, onChange: (v: string) => setCountry(v.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "")), type: "text" },
              { id: "city", label: "Ciudad", value: city, onChange: (v: string) => setCity(v.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "")), type: "text" },
              { id: "department", label: "Departamento", value: department, onChange: (v: string) => setDepartment(v.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "")), type: "text" },
              { id: "documentNumber", label: "Número de Documento", value: documentNumber, onChange: (v: string) => setDocumentNumber(v.replace(/\D/g, "")), type: "text" },
            ].map(f => (
              <div key={f.id} className={f.span ? "md:col-span-2" : ""}>
                <label htmlFor={f.id} className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{f.label}</label>
                <input type={f.type} id={f.id} value={f.value}
                  onChange={e => f.onChange(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent focus:bg-white transition-all" />
              </div>
            ))}

            <div>
              <label htmlFor="documentType" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Tipo de Documento</label>
              <select id="documentType" value={documentType} onChange={e => setDocumentType(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent focus:bg-white transition-all">
                <option value="">Seleccionar...</option>
                <option value="CC">CC Cédula de Ciudadanía</option>
                <option value="CE">CE Cédula de Extranjería</option>
                <option value="NIT">NIT</option>
                <option value="PP">Pasaporte</option>
              </select>
            </div>

            <div className="md:col-span-2">
              {profileMessage && <Alert type={profileMessage.type} message={profileMessage.text} />}
              <button type="submit" disabled={profileLoading}
                className="w-full mt-2 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-200 text-white text-sm font-semibold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2">
                {profileLoading ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Mi Perfil</h2>
        <p className="text-sm text-gray-400 mt-1">Tu información personal y de cuenta</p>
      </div>

      {/* Hero card — foto + info principal */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-300 relative">
          <div className="absolute -bottom-10 left-6">
            <div className="w-20 h-20 rounded-2xl border-4 border-white shadow-md bg-gray-100 overflow-hidden flex items-center justify-center">
              {photoUrl ? (
                <img src={photoUrl} alt="Foto de perfil" className="w-full h-full object-cover" />
              ) : (
                <svg className="w-9 h-9 text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              )}
            </div>
          </div>
        </div>

        <div className="pt-14 pb-5 px-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-lg font-bold text-gray-800">{fullName || user.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-gray-400">{user.email}</span>
              {roleLabel && (
                <span className="text-[10px] font-semibold bg-orange-50 text-orange-500 px-2 py-0.5 rounded-full border border-orange-100">
                  {roleLabel}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input type="file" ref={fileInputRef} onChange={e => { const f = e.target.files?.[0]; if (f) handlePhotoUpload(f); }} accept="image/*" className="hidden" />
            <button onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-orange-500 border border-orange-200 rounded-xl hover:bg-orange-50 transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Cambiar foto
            </button>
            <button onClick={() => setIsEditing(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-xl transition-colors shadow-sm">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Editar
            </button>
          </div>
        </div>
      </div>

      {/* Info personal */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50">
          <p className="text-sm font-semibold text-gray-700">Información Personal</p>
        </div>
        <div className="p-6 grid grid-cols-2 sm:grid-cols-3 gap-5">
          <InfoRow label="Teléfono" value={phone} />
          <InfoRow label="Tipo Documento" value={docLabel(documentType)} />
          <InfoRow label="Número Documento" value={documentNumber} />
          <InfoRow label="País" value={country} />
          <InfoRow label="Departamento" value={department} />
          <InfoRow label="Ciudad" value={city} />
        </div>
      </div>

      {/* Hoja de vida */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50">
          <p className="text-sm font-semibold text-gray-700">Hoja de Vida</p>
        </div>
        <div className="p-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700">
                {user.cv_path || user.cv_url ? "CV cargado" : "Sin hoja de vida"}
              </p>
              <p className="text-xs text-gray-400">Formato PDF · máx. 5MB</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input type="file" ref={cvInputRef} onChange={e => { const f = e.target.files?.[0]; if (f && handleCVUpload) handleCVUpload(f); }} accept=".pdf" className="hidden" />
            {(user.cv_path || user.cv_url) && (
              <a href={storageUrl(user.cv_url ?? user.cv_path) ?? "#"} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                Ver CV
              </a>
            )}
            <button onClick={() => cvInputRef.current?.click()}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-xl transition-colors shadow-sm">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              {user.cv_path || user.cv_url ? "Actualizar" : "Subir CV"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
