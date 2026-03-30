import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ToastProvider } from './contexts/ToastContext';
import { ToastContainer } from './components/Toast/ToastContainer';
import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';
import { RoleBasedRoute } from './components/auth/RoleBasedRoute';
import { Dashboard } from './pages/Dashboard';
import { Empresas } from './pages/Empresas';
import { Auditorias } from './pages/auditorias/Auditorias';
import { NuevaAuditoria } from './pages/auditorias/NuevaAuditoria';
import { AuditoriaDetalle } from './pages/auditorias/AuditoriaDetalle';
import { MisTareas } from './pages/MisTareas';
import { TareaDetalle } from './pages/TareaDetalle';
import { Perfil } from './pages/Perfil';
import { Roles } from './pages/Roles';
import { AppLayout } from './components/AppLayout';

// Componente para proteger rutas privadas
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

// Componente para redirigir usuarios autenticados
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  return !user ? <>{children}</> : <Navigate to="/dashboard" replace />;
};

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <ToastProvider>
          <div className="App">
            <ToastContainer />
            <BrowserRouter>
              <Routes>
                {/* Rutas públicas */}
                <Route path="/login" element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                } />
                <Route path="/register" element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                } />

                {/* Rutas privadas envueltas en AppLayout */}
                <Route element={
                  <PrivateRoute>
                    <AppLayout />
                  </PrivateRoute>
                }>
                  <Route path="/dashboard" element={
                    <RoleBasedRoute>
                      <Dashboard />
                    </RoleBasedRoute>
                  } />
                  <Route path="/empresas" element={
                    <RoleBasedRoute>
                      <Empresas />
                    </RoleBasedRoute>
                  } />
                  <Route path="/auditorias" element={
                    <RoleBasedRoute>
                      <Auditorias />
                    </RoleBasedRoute>
                  } />
                  <Route path="/auditorias/nueva" element={
                    <RoleBasedRoute>
                      <NuevaAuditoria />
                    </RoleBasedRoute>
                  } />
                  <Route path="/auditorias/:id" element={
                    <RoleBasedRoute>
                      <AuditoriaDetalle />
                    </RoleBasedRoute>
                  } />
                  <Route path="/mis-tareas" element={
                    <RoleBasedRoute>
                      <MisTareas />
                    </RoleBasedRoute>
                  } />
                  <Route path="/mis-tareas/:id" element={
                    <RoleBasedRoute>
                      <TareaDetalle />
                    </RoleBasedRoute>
                  } />
                  <Route path="/perfil" element={
                    <RoleBasedRoute>
                      <Perfil />
                    </RoleBasedRoute>
                  } />
                  <Route path="/roles" element={
                    <RoleBasedRoute>
                      <Roles />
                    </RoleBasedRoute>
                  } />
                </Route>

                {/* Ruta por defecto */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </BrowserRouter>
          </div>
        </ToastProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
