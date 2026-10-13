import React from "react";
import { Alert } from "../common/Alert";
import { storageUrl } from "../../utils/storageUrl";
import { authService, UserAdjunto } from "../../services/authService";

const ACCEPT = ".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx";

export const AdjuntosSection: React.FC = () => {
  const [adjuntos, setAdjuntos] = React.useState<UserAdjunto[]>([]);
  const [nombre, setNombre] = React.useState("");
  const [file, setFile] = React.useState<File | null>(null);
  const [uploading, setUploading] = React.useState(false);
  const [message, setMessage] = React.useState<{ type: "success" | "error"; text: string } | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    authService.getAdjuntos().then(setAdjuntos).catch(() => {
      setMessage({ type: "error", text: "No se pudieron cargar los archivos adjuntos" });
    });
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !file) {
      setMessage({ type: "error", text: "Indica el nombre del archivo y selecciona un archivo" });
      return;
    }
    setUploading(true);
    setMessage(null);
    try {
      const res = await authService.uploadAdjunto(nombre.trim(), file);
      setAdjuntos(prev => [res.adjunto, ...prev]);
      setNombre("");
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setMessage({ type: "success", text: res.message });
    } catch (err: any) {
      setMessage({ type: "error", text: err?.message || "Error al subir el archivo" });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (adjunto: UserAdjunto) => {
    if (!window.confirm(`¿Eliminar "${adjunto.nombre}"?`)) return;
    try {
      await authService.deleteAdjunto(adjunto.id);
      setAdjuntos(prev => prev.filter(a => a.id !== adjunto.id));
    } catch {
      setMessage({ type: "error", text: "Error al eliminar el archivo" });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-50">
        <p className="text-sm font-semibold text-gray-700">Otros Documentos</p>
        <p className="text-xs text-gray-400">Cédula, temas disciplinarios, anexos, etc. · PDF, imagen, Word o Excel · máx. 20MB</p>
      </div>

      <form onSubmit={handleUpload} className="p-4 flex flex-col sm:flex-row gap-2 border-b border-gray-50">
        <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} maxLength={255}
          placeholder="Nombre del archivo (ej. Cédula)"
          className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent focus:bg-white transition-all" />
        <input type="file" ref={fileInputRef} accept={ACCEPT} className="hidden"
          onChange={e => setFile(e.target.files?.[0] ?? null)} />
        <button type="button" onClick={() => fileInputRef.current?.click()}
          className="sm:max-w-[200px] truncate px-3 py-2 text-xs font-semibold text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          {file ? file.name : "Seleccionar archivo"}
        </button>
        <button type="submit" disabled={uploading}
          className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-orange-500 hover:bg-orange-600 disabled:bg-orange-200 rounded-lg transition-colors shadow-sm">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          {uploading ? "Subiendo..." : "Subir"}
        </button>
      </form>

      {message && <div className="px-4 pt-3"><Alert type={message.type} message={message.text} /></div>}

      <div className="p-4 space-y-2">
        {adjuntos.length === 0 ? (
          <p className="text-sm text-gray-400">No hay documentos adicionales</p>
        ) : adjuntos.map(a => (
          <div key={a.id} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 shrink-0 rounded-lg bg-orange-50 flex items-center justify-center">
                <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-700 truncate">{a.nombre}</p>
                <p className="text-xs text-gray-400 truncate">{a.original_name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <a href={storageUrl(a.url) ?? "#"} target="_blank" rel="noopener noreferrer"
                className="px-3 py-1.5 text-xs font-semibold text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                Ver
              </a>
              <button onClick={() => handleDelete(a)}
                className="px-3 py-1.5 text-xs font-semibold text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
