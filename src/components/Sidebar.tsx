import React, { useMemo } from "react";
import { UserRole, getMenuItemsByRole, getMenuItemsByPermissions } from "../config/menuConfig";
import { SidebarHeader } from "./Sidebar/SidebarHeader";
import { SidebarNav } from "./Sidebar/SidebarNav";
import { SidebarFooter } from "./Sidebar/SidebarFooter";

interface SidebarProps {
  onLogout: () => void;
  userRole: UserRole;
  permissions?: string[];
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  onLogout,
  userRole,
  permissions = [],
  isOpen = true,
  onClose,
}) => {
  // Obtener items del menú según los permisos granulares (o por rol si no hay permisos)
  const menuItems = useMemo(() => {
    if (permissions.length > 0) {
      return getMenuItemsByPermissions(permissions);
    }
    return getMenuItemsByRole(userRole);
  }, [userRole, permissions]);

  return (
    <>
      {/* Overlay para móvil */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`w-32 h-screen flex flex-col fixed left-0 top-0 z-40 transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ backgroundColor: "#2D3748" }}
      >
        <div className="flex flex-col h-full">
          <SidebarHeader onClose={onClose} />
          <SidebarNav menuItems={menuItems} onClose={onClose} />
          <SidebarFooter onLogout={onLogout} onClose={onClose} />
        </div>
      </aside>
    </>
  );
};
