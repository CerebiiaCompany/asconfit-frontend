import { useState } from "react";
import { authService } from "../services/authService";
import { RegisterFormData } from "../types/auth.types";
import { useAuth } from "../contexts/AuthContext";

export const useRegisterForm = (onSuccess: () => void) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { refreshUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== passwordConfirmation) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);

    try {
      const data: RegisterFormData = {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      };
      await authService.register(data);
      // Actualizar el contexto con el usuario registrado
      await refreshUser();
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Error al registrarse");
    } finally {
      setLoading(false);
    }
  };

  return {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    passwordConfirmation,
    setPasswordConfirmation,
    error,
    loading,
    handleSubmit,
  };
};
