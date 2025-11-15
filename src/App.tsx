import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';
import { Dashboard } from './pages/Dashboard';
import { Empresas } from './pages/Empresas';
import { Auditorias } from './pages/auditorias/Auditorias';
import { NuevaAuditoria } from './pages/auditorias/NuevaAuditoria';
import { Perfil } from './pages/Perfil';
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
    <div className="App">
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
              <Dashboard />
            </PrivateRoute>
          } />
          <Route path="/empresas" element={
            <PrivateRoute>
              <Empresas />
            </PrivateRoute>
          } />
          <Route path="/auditorias" element={
            <PrivateRoute>
              <Auditorias />
            </PrivateRoute>
          } />
          <Route path="/auditorias/nueva" element={
            <PrivateRoute>
              <NuevaAuditoria />
            </PrivateRoute>
          } />
          <Route path="/perfil" element={
            <PrivateRoute>
              <Perfil />
            </PrivateRoute>
          } />

          {/* Ruta por defecto */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
