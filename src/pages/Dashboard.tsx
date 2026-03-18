import React from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import { LoadingSpinner } from "../components/dashboard/LoadingSpinner";
import { HomeView } from "../components/dashboard/HomeView";

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading } = useUser(() => navigate("/login"));

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {loading ? <LoadingSpinner /> : <HomeView user={user} />}
    </div>
  );
};
