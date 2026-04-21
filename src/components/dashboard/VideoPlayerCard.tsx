import React, { useState, useEffect, useRef } from "react";
import { Camera } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";
const BASE_URL = API_URL.replace(/\/api\/?$/, "");

export const FounderBanner: React.FC = () => {
  const { userRole } = useAuth();
  const { addToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [bannerUrl, setBannerUrl] = useState<string>("/Rectangle 30316.png");
  const [uploading, setUploading] = useState(false);

  const isAdmin = userRole === "admin";

  useEffect(() => {
    fetch(`${API_URL}/settings/banner`)
      .then((r) => r.json())
      .then((data) => {
        if (data.url) setBannerUrl(data.url);
      })
      .catch(() => { });
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar que la imagen sea más ancha que alta (landscape)
    const valid = await new Promise<boolean>((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img.width > img.height);
      img.onerror = () => resolve(false);
      img.src = URL.createObjectURL(file);
    });

    if (!valid) {
      addToast("La imagen debe ser más ancha que alta (formato horizontal)", "error");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const formData = new FormData();
    formData.append("banner", file);

    try {
      setUploading(true);
      const token = localStorage.getItem("auth_token");
      const res = await fetch(`${API_URL}/settings/banner`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setBannerUrl(data.url);
      addToast("Banner actualizado correctamente", "success");
    } catch (err: any) {
      addToast(err.message || "Error al subir el banner", "error");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="relative rounded-2xl shadow-lg w-full aspect-video overflow-hidden border border-gray-200 bg-white group">
      <img
        src={bannerUrl}
        alt="Banner Fundador"
        className="w-full h-full object-cover"
      />

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
            className="absolute top-3 right-3 bg-black/50 hover:bg-black/70 text-white px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Camera className="w-3.5 h-3.5" />
            {uploading ? "Subiendo..." : "Cambiar imagen"}
          </button>
        </>
      )}
    </div>
  );
};
