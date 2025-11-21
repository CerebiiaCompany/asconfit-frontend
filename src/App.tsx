import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
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
import { authService } from './services/authService';

// Componente para proteger rutas privadas
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return authService.isAuthenticated() ? <>{children}</> : <Navigate to="/login" replace />;
};

// Componente para redirigir usuarios autenticados
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return !authService.isAuthenticated() ? <>{children}</> : <Navigate to="/dashboard" replace />;
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

                {/* Rutas privadas */}
                <Route path="/dashboard" element={
                  <PrivateRoute>
                    <RoleBasedRoute>
                      <Dashboard />
                    </RoleBasedRoute>
                  </PrivateRoute>
                } />
                <Route path="/empresas" element={
                  <PrivateRoute>
                    <RoleBasedRoute>
                      <Empresas />
                    </RoleBasedRoute>
                  </PrivateRoute>
                } />
                <Route path="/auditorias" element={
                  <PrivateRoute>
                    <RoleBasedRoute>
                      <Auditorias />
                    </RoleBasedRoute>
                  </PrivateRoute>
                } />
                <Route path="/auditorias/nueva" element={
                  <PrivateRoute>
                    <RoleBasedRoute>
                      <NuevaAuditoria />
                    </RoleBasedRoute>
                  </PrivateRoute>
                } />
                <Route path="/auditorias/:id" element={
                  <PrivateRoute>
                    <RoleBasedRoute>
                      <AuditoriaDetalle />
                    </RoleBasedRoute>
                  </PrivateRoute>
                } />
                <Route path="/mis-tareas" element={
                  <PrivateRoute>
                    <RoleBasedRoute>
                      <MisTareas />
                    </RoleBasedRoute>
                  </PrivateRoute>
                } />
                <Route path="/mis-tareas/:id" element={
                  <PrivateRoute>
                    <RoleBasedRoute>
                      <TareaDetalle />
                    </RoleBasedRoute>
                  </PrivateRoute>
                } />
                <Route path="/perfil" element={
                  <PrivateRoute>
                    <RoleBasedRoute>
                      <Perfil />
                    </RoleBasedRoute>
                  </PrivateRoute>
                } />
                <Route path="/roles" element={
                  <PrivateRoute>
                    <RoleBasedRoute>
                      <Roles />
                    </RoleBasedRoute>
                  </PrivateRoute>
                } />

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
