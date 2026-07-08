import React, { useState } from "react";
import axios from "axios";
import { userService } from "../../services/userService";
import { useToast } from "../../contexts/ToastContext";

interface DelegadoFormProps {
  roleId?: number;
  onClose: () => void;
  onSuccess: () => void;
}

const extractBackendError = (err: unknown): string => {
  if (axios.isAxiosError(err) && err.response) {
    const data = err.response.data as {
      message?: string;
      errors?: Record<string, string[]>;
    };
    if (data?.errors) {
      const firstKey = Object.keys(data.errors)[0];
      if (firstKey && data.errors[firstKey]?.[0]) {
        return data.errors[firstKey][0];
      }
    }
    if (data?.message) {
      return data.message;
    }
  }
  return "No se pudo crear el delegado. Intenta nuevamente.";
};

export const DelegadoForm: React.FC<DelegadoFormProps> = ({
  roleId,
  onClose,
  onSuccess,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addToast } = useToast();

  const validate = (): string | null => {
    if (!name.trim()) return "El nombre es requerido";
    if (!email.trim()) return "El correo es requerido";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) return "El correo no es válido";
    if (password.length < 8)
      return "La contraseña debe tener al menos 8 caracteres";
    if (password !== passwordConfirmation)
      return "Las contraseñas no coinciden";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      addToast(validationError, "error");
      return;
    }

    setLoading(true);
    try {
      await userService.createDelegado({
        name: name.trim(),
        email: email.trim(),
        password,
        password_confirmation: passwordConfirmation,
        ...(roleId ? { role_id: roleId } : {}),
      });
      addToast("Delegado creado correctamente", "success");
      onSuccess();
    } catch (err) {
      const message = extractBackendError(err);
      setError(message);
      addToast(message, "error");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="text-left">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}

      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Nombre completo
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-orange focus:border-transparent"
          placeholder="Ej: Juan Pérez"
          autoComplete="off"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Correo electrónico
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-orange focus:border-transparent"
          placeholder="juan.perez@empresa.com"
          autoComplete="off"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Contraseña
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-orange focus:border-transparent"
          placeholder="Mínimo 8 caracteres"
          autoComplete="new-password"
        />
      </div>

      <div className="mb-2">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Confirmar contraseña
        </label>
        <input
          type="password"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-orange focus:border-transparent"
          placeholder="Repite la contraseña"
          autoComplete="new-password"
        />
      </div>

      <p className="text-xs text-gray-500 mb-2">
        El delegado podrá iniciar sesión de inmediato con este correo y
        contraseña.
      </p>

      <div className="flex justify-end gap-3 mt-6">
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-primary-orange text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:bg-gray-400 disabled:opacity-100"
        >
          {loading ? "Creando..." : "Crear Delegado"}
        </button>
      </div>
    </form>
  );
};
