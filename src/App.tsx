import React, { useEffect, useState } from 'react';
import './App.css';
import { api } from './services/api';

interface HealthResponse {
  status: string;
  message: string;
  timestamp: string;
}

function App() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const data = await api.get<HealthResponse>('/health');
        setHealth(data);
        setError(null);
      } catch (err) {
        setError('Error conectando con la API. Asegúrate de que el backend esté corriendo en http://localhost:8000');
      } finally {
        setLoading(false);
      }
    };

    checkHealth();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Asconfit</h1>
        <h2>React + TypeScript + Laravel API</h2>

        {loading && <p>Conectando con la API...</p>}

        {error && (
          <div style={{ color: '#ff6b6b', padding: '20px', background: '#2d2d2d', borderRadius: '8px' }}>
            <p>{error}</p>
            <p style={{ fontSize: '14px' }}>Ejecuta: <code>php artisan serve</code> en el backend</p>
          </div>
        )}

        {health && (
          <div style={{ color: '#51cf66', padding: '20px', background: '#2d2d2d', borderRadius: '8px' }}>
            <p>✓ Estado: {health.status}</p>
            <p>✓ {health.message}</p>
            <p style={{ fontSize: '12px' }}>Timestamp: {health.timestamp}</p>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
