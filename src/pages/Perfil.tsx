import React from "react";
import { useNavigate } from "react-router-dom";
import { UserSettings } from "../components/UserSettings";
import { useUser } from "../hooks/useUser";
import { LoadingState } from "../components/common/LoadingState";

export const Perfil: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading: userLoading } = useUser(() => navigate("/login"));

  const handleLogout = () => {
    // Logout logic is now in AppLayout
    navigate("/login");
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
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
  );
};
