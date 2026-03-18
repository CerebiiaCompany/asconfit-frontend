import React from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { useAuth } from "../contexts/AuthContext";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { UserSettings } from "../components/UserSettings";
import { useUser } from "../hooks/useUser";
import { LoadingState } from "../components/common/LoadingState";

export const Perfil: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading: userLoading } = useUser(() => navigate("/login"));
  const { setUser } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
      navigate("/login"); // Navigate even if logout fails
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header
        userName={user?.name || "Usuario"}
        onLogout={handleLogout}
        onNavigateToSettings={() => navigate("/perfil")}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <Sidebar
        onLogout={handleLogout}
        userRole={(user?.role?.nombre as any) || "delegado"}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <div className="lg:ml-32 ml-0 pt-20">
        {userLoading ? (
          <LoadingState message="Cargando perfil..." />
        ) : (
          <UserSettings
            initialUser={user!}
            onBack={() => navigate("/dashboard")}
            onLogout={handleLogout}
          />
        )}
      </div>
    </div>
  );
};
