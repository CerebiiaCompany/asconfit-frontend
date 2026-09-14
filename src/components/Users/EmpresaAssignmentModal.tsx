import React, { useEffect, useState } from "react";
import { userService } from "../../services/userService";
import { empresaService, Empresa } from "../../services/empresaService";
import { SearchInput } from "../SearchInput";
import { useToast } from "../../contexts/ToastContext";

interface EmpresaAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
  userName: string;
}

export const EmpresaAssignmentModal: React.FC<EmpresaAssignmentModalProps> = ({
  isOpen,
  onClose,
  userId,
  userName,
}) => {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!isOpen) return;

    setLoading(true);
    Promise.all([empresaService.getAll(), userService.getUserEmpresas(userId)])
      .then(([todasEmpresas, asignadasIds]) => {
        setEmpresas(todasEmpresas);
        setSelectedIds(new Set(asignadasIds));
      })
      .catch((err) => {
        console.error("Error al cargar empresas asignadas:", err);
        addToast("Error al cargar las empresas asignadas", "error");
      })
      .finally(() => setLoading(false));
  }, [isOpen, userId]);

  if (!isOpen) return null;

  const toggleEmpresa = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const filteredEmpresas = empresas.filter((emp) => {
    const term = searchTerm.toLowerCase();
    return (
      emp.razon_social.toLowerCase().includes(term) ||
      emp.nit.includes(term)
    );
  });

  const handleSave = async () => {
    try {
      setSaving(true);
      await userService.syncUserEmpresas(userId, Array.from(selectedIds));
      addToast("Empresas asignadas correctamente", "success");
      onClose();
    } catch (err) {
      console.error("Error al asignar empresas:", err);
      addToast("Error al asignar las empresas", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] flex flex-col">
        <div className="px-6 pt-6 pb-4 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-800">
            Empresas y encargos de {userName}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Solo las empresas marcadas serán visibles para este usuario y podrá crear auditorías en ellas o ser elegido como auditor/delegado.
          </p>
        </div>

        <div className="px-6 py-4 border-b border-gray-100">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Buscar por razón social o NIT..."
          />
        </div>

        <div className="px-6 py-4 overflow-y-auto flex-1">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-orange"></div>
            </div>
          ) : filteredEmpresas.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-sm">
              No hay empresas que coincidan con la búsqueda.
            </div>
          ) : (
            <ul className="space-y-2">
              {filteredEmpresas.map((empresa) => (
                <li key={empresa.id}>
                  <label className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(empresa.id!)}
                      onChange={() => toggleEmpresa(empresa.id!)}
                      className="w-4 h-4 text-primary-orange rounded focus:ring-primary-orange"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-800">
                        {empresa.razon_social}
                      </span>
                      <span className="text-xs text-gray-500">NIT: {empresa.nit}</span>
                    </div>
                  </label>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={saving}
            className="px-5 py-2.5 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving || loading}
            className="px-5 py-2.5 bg-primary-orange text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {saving ? "Guardando..." : "Guardar asignación"}
          </button>
        </div>
      </div>
    </div>
  );
};
