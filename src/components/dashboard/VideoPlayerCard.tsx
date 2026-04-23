import React, { useState, useEffect } from "react";
import { Pencil } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

function getYouTubeEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    let videoId: string | null = null;
    if (u.hostname === "youtu.be") {
      videoId = u.pathname.slice(1);
    } else if (u.hostname.includes("youtube.com")) {
      videoId = u.searchParams.get("v");
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  } catch {
    return null;
  }
}

export const FounderBanner: React.FC = () => {
  const { userRole } = useAuth();
  const { addToast } = useToast();
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [saving, setSaving] = useState(false);

  const isAdmin = userRole === "admin";

  useEffect(() => {
    fetch(`${API_URL}/settings/banner`)
      .then((r) => r.json())
      .then((data) => {
        if (data.url) setVideoUrl(data.url);
      })
      .catch(() => { });
  }, []);

  const handleSave = async () => {
    if (!inputValue.trim()) return;
    try {
      setSaving(true);
      const token = localStorage.getItem("auth_token");
      const res = await fetch(`${API_URL}/settings/banner`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: inputValue.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setVideoUrl(data.url);
      setEditing(false);
      addToast("URL de video actualizada correctamente", "success");
    } catch (err: any) {
      addToast(err.message || "Error al guardar la URL", "error");
    } finally {
      setSaving(false);
    }
  };

  const embedUrl = getYouTubeEmbedUrl(videoUrl);

  return (
    <div className="relative rounded-2xl shadow-lg w-full aspect-video overflow-hidden border border-gray-200 bg-black group">
      {embedUrl ? (
        <iframe
          src={embedUrl}
          title="Video"
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
          No hay video configurado
        </div>
      )}

      {isAdmin && !editing && (
        <button
          onClick={() => { setInputValue(videoUrl); setEditing(true); }}
          className="absolute top-3 right-3 bg-black/50 hover:bg-black/70 text-white px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Pencil className="w-3.5 h-3.5" />
          Cambiar video
        </button>
      )}

      {isAdmin && editing && (
        <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-3 p-4">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className="w-full max-w-md px-3 py-2 rounded-lg text-sm text-black outline-none"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold"
            >
              {saving ? "Guardando..." : "Guardar"}
            </button>
            <button
              onClick={() => setEditing(false)}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
