import React, { useState } from "react";
import { KeyRound, Eye, EyeOff, Sparkles, Copy, Check, Lock, AlertCircle } from "lucide-react";
import { userService } from "../../services/userService";
import { useToast } from "../../contexts/ToastContext";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
  userName: string;
  userEmail: string;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
  userId,
  userName,
  userEmail,
}) => {
  const { addToast } = useToast();
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    if (loading) return;
    setPassword("");
    setPasswordConfirmation("");
    setError(null);
    setShowPassword(false);
    setShowConfirmation(false);
    setCopied(false);
    onClose();
  };

  const generateRandomPassword = () => {
    const chars = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789!@#$%&*";
    let generated = "";
    for (let i = 0; i < 12; i++) {
      generated += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(generated);
    setPasswordConfirmation(generated);
    setShowPassword(true);
    setShowConfirmation(true);
    setError(null);
  };

  const handleCopyPassword = async () => {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      addToast("Contraseña copiada al portapapeles", "info");
    } catch {
      // Fallback
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (password !== passwordConfirmation) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      setLoading(true);
      const res = await userService.resetUserPassword(userId, password, passwordConfirmation);
      addToast(res.message || "Contraseña actualizada exitosamente", "success");
      handleClose();
    } catch (err: any) {
      console.error("Error al resetear contraseña:", err);
      const msg =
        err.response?.data?.message ||
        (err.response?.data?.errors
          ? Object.values(err.response.data.errors).flat().join(" ")
          : "Error al actualizar la contraseña del usuario.");
      setError(msg);
      addToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  const isLengthValid = password.length >= 8;
  const isMatch = password.length > 0 && password === passwordConfirmation;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden flex flex-col border border-gray-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-600 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Cambiar Contraseña</h3>
              <p className="text-xs text-orange-100">Panel de Administración</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className="text-white/80 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* User Details Banner */}
        <div className="bg-orange-50/70 border-b border-orange-100/80 px-6 py-3 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-orange-900 uppercase tracking-wider">
              Usuario
            </span>
            <span className="text-sm font-bold text-gray-800">{userName}</span>
            <span className="text-xs text-gray-500">{userEmail}</span>
          </div>
          <button
            type="button"
            onClick={generateRandomPassword}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-orange-700 bg-white border border-orange-200 rounded-lg hover:bg-orange-100 hover:border-orange-300 transition-all shadow-sm"
            title="Generar contraseña segura aleatoria"
          >
            <Sparkles className="w-3.5 h-3.5 text-orange-600" />
            Generar segura
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-3.5 py-2.5 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Nueva Contraseña */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Nueva Contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 8 caracteres"
                required
                className="w-full pl-9 pr-16 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              />
              <div className="absolute inset-y-0 right-0 pr-2 flex items-center gap-1">
                {password && (
                  <button
                    type="button"
                    onClick={handleCopyPassword}
                    className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                    title="Copiar contraseña"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Confirmar Nueva Contraseña */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Confirmar Nueva Contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showConfirmation ? "text" : "password"}
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                placeholder="Repite la contraseña"
                required
                className="w-full pl-9 pr-10 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              />
              <button
                type="button"
                onClick={() => setShowConfirmation(!showConfirmation)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showConfirmation ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Validation Checklist */}
          {password && (
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 space-y-1.5 text-xs">
              <div className="flex items-center gap-2">
                <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] ${isLengthValid ? "bg-green-500 text-white" : "bg-gray-300 text-gray-600"}`}>
                  {isLengthValid ? "✓" : "•"}
                </span>
                <span className={isLengthValid ? "text-green-700 font-medium" : "text-gray-500"}>
                  Al menos 8 caracteres
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] ${isMatch ? "bg-green-500 text-white" : "bg-gray-300 text-gray-600"}`}>
                  {isMatch ? "✓" : "•"}
                </span>
                <span className={isMatch ? "text-green-700 font-medium" : "text-gray-500"}>
                  Las contraseñas coinciden
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex gap-3 justify-end">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="px-4 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors text-sm disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !isLengthValid || !isMatch}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-orange text-white font-semibold rounded-xl hover:bg-orange-600 transition-colors text-sm shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Guardar Contraseña</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
