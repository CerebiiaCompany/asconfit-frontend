import React, { useState, useEffect } from 'react';
import './App.css';
import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';
import { Dashboard } from './pages/Dashboard';
import { authService } from './services/authService';

type AuthView = 'login' | 'register' | 'dashboard';

function App() {
  const [currentView, setCurrentView] = useState<AuthView>('login');

  useEffect(() => {
    if (authService.isAuthenticated()) {
      setCurrentView('dashboard');
    }
  }, []);

  const handleLoginSuccess = () => {
    setCurrentView('dashboard');
  };

  const handleRegisterSuccess = () => {
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setCurrentView('login');
  };

  const switchToRegister = () => {
    setCurrentView('register');
  };

  const switchToLogin = () => {
    setCurrentView('login');
  };

  return (
    <div className="App">
      {currentView === 'login' && (
        <Login
          onLoginSuccess={handleLoginSuccess}
          onSwitchToRegister={switchToRegister}
        />
      )}
      {currentView === 'register' && (
        <Register
          onRegisterSuccess={handleRegisterSuccess}
          onSwitchToLogin={switchToLogin}
        />
      )}
      {currentView === 'dashboard' && (
        <Dashboard onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
