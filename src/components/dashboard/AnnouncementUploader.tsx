import React, { useState, useEffect, useRef } from 'react';
import { Upload } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export const AnnouncementUploader: React.FC = () => {
    const { userRole } = useAuth();
    const { addToast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    const isAdmin = userRole === 'admin';

    useEffect(() => {
        fetch(`${API_URL}/settings/comunicado`)
            .then((r) => r.json())
            .then((data) => { if (data.url) setImageUrl(data.url); })
            .catch(() => { });
    }, []);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validar que la imagen sea más ancha que alta
        const isValidDimensions = await validateImageDimensions(file);
        if (!isValidDimensions) {
            addToast('Por favor suba una imagen más ancha que alta', 'error');
            return;
        }

        const formData = new FormData();
        formData.append('comunicado', file);

        try {
            setUploading(true);
            const token = localStorage.getItem('auth_token');
            const res = await fetch(`${API_URL}/settings/comunicado`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setImageUrl(data.url);
            addToast('Comunicado actualizado correctamente', 'success');
        } catch (err: any) {
            addToast(err.message || 'Error al subir el comunicado', 'error');
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const validateImageDimensions = (file: File): Promise<boolean> => {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                resolve(img.width > img.height);
            };
            img.onerror = () => {
                resolve(false);
            };
            img.src = URL.createObjectURL(file);
        });
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl p-4 flex flex-col items-center justify-center h-full min-h-[350px] border border-gray-100 group relative overflow-hidden">
            {imageUrl ? (
                <div className="w-full flex-1 rounded-xl overflow-hidden">
                    <img
                        src={imageUrl}
                        alt="Comunicado"
                        className="w-full h-full object-cover rounded-xl"
                    />
                </div>
            ) : (
                <div className="bg-gray-100/50 rounded-xl w-full h-full flex items-center justify-center border-2 border-dashed border-gray-200">
                    {isAdmin ? (
                        <span className="text-gray-400 text-sm">Sin comunicado</span>
                    ) : null}
                </div>
            )}

            {isAdmin && (
                <>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="absolute bottom-4 right-4 bg-[#F97316] hover:bg-orange-600 text-white px-5 py-2 rounded-xl flex items-center gap-2 font-bold text-sm shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        {uploading ? 'Subiendo...' : 'Subir Comunicado'}
                        <Upload size={18} />
                    </button>
                </>
            )}
        </div>
    );
};
