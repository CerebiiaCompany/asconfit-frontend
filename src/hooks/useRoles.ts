import { useState, useEffect } from "react";
import { Role } from "../types/role";
import { roleService } from "../services/roleService";

export const useRoles = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRoles = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await roleService.getAllRoles();
      setRoles(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al cargar roles";
      console.error("Load roles error:", errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const deleteRole = async (id: string) => {
    try {
      await roleService.deleteRole(id);
      // Use callback form to ensure we have the latest state
      setRoles((prevRoles) =>
        prevRoles.filter((r) => String(r.id) !== String(id))
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al eliminar rol";
      setError(errorMessage);
      throw err;
    }
  };

  useEffect(() => {
    loadRoles();
  }, []);

  return { roles, setRoles, loading, error, loadRoles, deleteRole };
};
