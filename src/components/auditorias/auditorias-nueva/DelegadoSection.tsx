import React, { useEffect, useState } from "react";
import { userService, User } from "../../../services/userService";

interface DelegadoSectionProps {
  selectedDelegadoId: number | null;
  onDelegadoChange: (delegadoId: number) => void;
}

export const DelegadoSection: React.FC<DelegadoSectionProps> = ({
  selectedDelegadoId,
  onDelegadoChange,
}) => {
  const [delegados, setDelegados] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDelegados = async () => {
      try {
        setLoading(true);
        const data = await userService.getDelegados();
        setDelegados(data);
        setError(null);
      } catch (err: any) {
        console.error("Error al cargar delegados:", err);
        setError("Error al cargar la lista de delegados");
      } finally {
        setLoading(false);
      }
    };

    fetchDelegados();
  }, []);

  return (
    <div className="mb-8 pb-8 border-b border-gray-200">
      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
        <svg
          className="w-6 h-6 mr-2 text-orange-500"
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
        Asignar Delegado
      </h2>

      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Delegado Responsable <span className="text-red-500">*</span>
          </label>
          {loading ? (
            <div className="text-gray-500 text-sm">Cargando delegados...</div>
          ) : error ? (
            <div className="text-red-500 text-sm">{error}</div>
          ) : (
            <select
              value={selectedDelegadoId || ""}
              onChange={(e) => onDelegadoChange(Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              required
            >
              <option value="">Seleccione un delegado</option>
              {delegados.map((delegado) => (
                <option key={delegado.id} value={delegado.id}>
                  {delegado.name} - {delegado.email}
                </option>
              ))}
            </select>
          )}
          <p className="mt-2 text-sm text-gray-500">
            El delegado seleccionado recibirá las notificaciones de esta
            auditoría
          </p>
        </div>
      </div>
    </div>
  );
};
