import React, { useState } from "react";
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

const EyeIcon: React.FC<{ open: boolean }> = ({ open }) =>
  open ? (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ) : (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  );

const getStrength = (pwd: string) => {
  if (!pwd) return { score: 0, label: "", color: "" };
  let score = 0;
  if (pwd.length >= 8) score++;
  if (pwd.length >= 12) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  if (score <= 1) return { score, label: "Muy débil", color: "bg-red-500" };
  if (score === 2) return { score, label: "Débil", color: "bg-orange-400" };
  if (score === 3) return { score, label: "Regular", color: "bg-yellow-400" };
  if (score === 4) return { score, label: "Fuerte", color: "bg-green-400" };
  return { score, label: "Muy fuerte", color: "bg-green-600" };
};

const PasswordField: React.FC<{
  id: string; label: string; value: string;
  onChange: (v: string) => void; show: boolean;
  onToggle: () => void; placeholder?: string;
  required?: boolean; minLength?: number;
  hint?: React.ReactNode;
}> = ({ id, label, value, onChange, show, onToggle, placeholder = "••••••••", required, minLength, hint }) => (
  <div className="space-y-1.5">
    <label htmlFor={id} className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</label>
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        id={id} value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        required={required} minLength={minLength}
        className="w-full px-4 py-3 pr-11 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent focus:bg-white transition-all"
      />
      <button type="button" onClick={onToggle}
        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
        <EyeIcon open={show} />
      </button>
    </div>
    {hint}
  </div>
);

export const PasswordTab: React.FC<PasswordTabProps> = ({
  currentPassword, setCurrentPassword,
  newPassword, setNewPassword,
  confirmPassword, setConfirmPassword,
  passwordLoading, passwordMessage, handlePasswordUpdate,
}) => {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const strength = getStrength(newPassword);
  const matches = confirmPassword.length > 0 && newPassword === confirmPassword;
  const mismatch = confirmPassword.length > 0 && newPassword !== confirmPassword;

  return (
    <div className="space-y-6 max-w-lg">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Seguridad</h2>
        <p className="text-sm text-gray-400 mt-1">Actualiza tu contraseña de acceso</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Banner decorativo */}
        <div className="h-1.5 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-300" />

        <form onSubmit={handlePasswordUpdate} className="p-6 space-y-5">
          <PasswordField
            id="currentPassword" label="Contraseña actual"
            value={currentPassword} onChange={setCurrentPassword}
            show={showCurrent} onToggle={() => setShowCurrent(v => !v)}
            required
          />

          <div className="relative flex items-center gap-3 py-1">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-[10px] font-semibold text-gray-300 uppercase tracking-widest">Nueva contraseña</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          <PasswordField
            id="newPassword" label="Nueva contraseña"
            value={newPassword} onChange={setNewPassword}
            show={showNew} onToggle={() => setShowNew(v => !v)}
            required minLength={8}
            hint={
              newPassword.length > 0 ? (
                <div className="space-y-1 mt-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength.score ? strength.color : "bg-gray-100"}`} />
                    ))}
                  </div>
                  <p className={`text-xs font-medium ${strength.score <= 2 ? "text-red-500" : strength.score === 3 ? "text-yellow-500" : "text-green-600"}`}>
                    {strength.label}
                  </p>
                </div>
              ) : (
                <p className="text-xs text-gray-400 mt-1">Mínimo 8 caracteres</p>
              )
            }
          />

          <div className="space-y-1.5">
            <label htmlFor="confirmPassword" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Confirmar contraseña
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                id="confirmPassword" value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="••••••••" required
                className={`w-full px-4 py-3 pr-11 bg-gray-50 border rounded-xl text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:border-transparent focus:bg-white transition-all ${mismatch ? "border-red-300 focus:ring-red-300" :
                    matches ? "border-green-300 focus:ring-green-300" :
                      "border-gray-200 focus:ring-orange-400"
                  }`}
              />
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {matches && (
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                <button type="button" onClick={() => setShowConfirm(v => !v)}
                  className="text-gray-400 hover:text-gray-600 transition-colors">
                  <EyeIcon open={showConfirm} />
                </button>
              </div>
            </div>
            {mismatch && <p className="text-xs text-red-500">Las contraseñas no coinciden</p>}
            {matches && <p className="text-xs text-green-600">Las contraseñas coinciden</p>}
          </div>

          {passwordMessage && <Alert type={passwordMessage.type} message={passwordMessage.text} />}

          <button
            type="submit"
            disabled={passwordLoading || mismatch}
            className="w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-200 text-white text-sm font-semibold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 mt-2"
          >
            {passwordLoading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Actualizando...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Actualizar contraseña
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
