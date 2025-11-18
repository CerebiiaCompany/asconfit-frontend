import React from 'react';
import { useNavigate } from 'react-router-dom';

export const AccessDenied: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: '#f5f5f5',
            padding: '20px',
            textAlign: 'center'
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '40px',
                borderRadius: '8px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                maxWidth: '500px'
            }}>
                <h1 style={{
                    fontSize: '48px',
                    color: '#e74c3c',
                    marginBottom: '20px'
                }}>
                    403
                </h1>
                <h2 style={{
                    fontSize: '24px',
                    color: '#333',
                    marginBottom: '20px'
                }}>
                    Acceso Denegado
                </h2>
                <p style={{
                    fontSize: '16px',
                    color: '#666',
                    marginBottom: '30px'
                }}>
                    No tienes permisos para acceder a esta página.
                </p>
                <button
                    onClick={() => navigate('/dashboard')}
                    style={{
                        backgroundColor: '#3498db',
                        color: 'white',
                        border: 'none',
                        padding: '12px 24px',
                        fontSize: '16px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2980b9'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3498db'}
                >
                    Volver al Inicio
                </button>
            </div>
        </div>
    );
};
