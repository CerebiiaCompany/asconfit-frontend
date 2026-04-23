import React, { useState, useEffect, useRef } from "react";
import { Search, SlidersHorizontal, Lock, Users, Upload, FileText, Trash2, Eye } from "lucide-react";
import { documentoService, Documento } from "../../services/documentoService";
import { useToast } from "../../contexts/ToastContext";
import { DeleteConfirmModal } from "../common/DeleteConfirmModal";

interface WorkPapersProps {
  carpetaId: number;
  isPrivate: boolean;
  isAdmin: boolean;
  onTogglePrivate: () => void;
}

export const WorkPapers: React.FC<WorkPapersProps> = ({ carpetaId, isPrivate, isAdmin, onTogglePrivate }) => {
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [docToDelete, setDocToDelete] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addToast } = useToast();

  useEffect(() => {
    loadDocumentos();
  }, [carpetaId]);

  const loadDocumentos = async () => {
    try {
      setLoading(true);
      const data = await documentoService.getDocumentosByCarpeta(carpetaId);
      setDocumentos(data);
    } catch (error) {
      console.error(error);
      addToast("Error al cargar los documentos de esta carpeta", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const uploadFile = async (file: File) => {
    if (file.size > 15 * 1024 * 1024) {
      addToast("El archivo no puede exceder los 15 MB", "warning");
      return;
    }
    try {
      setLoading(true);
      const newDoc = await documentoService.uploadDocumento(carpetaId, file);
      setDocumentos(prev => [...prev, newDoc]);
      addToast("Documento subido correctamente", "success");
    } catch (error: any) {
      console.error(error);
      addToast(error.response?.data?.message || "Error al subir el archivo", "error");
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    await uploadFile(file);
  };

  const handleDeleteRequest = (docId: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDocToDelete(docId);
  };

  const confirmDelete = async () => {
    if (!docToDelete) return;
    try {
      setLoading(true);
      await documentoService.deleteDocumento(docToDelete);
      setDocumentos(prev => prev.filter(d => d.id !== docToDelete));
      addToast("Documento movido a la papelera", "success");
    } catch (error) {
      console.error(error);
      addToast("Error al mover a la papelera", "error");
    } finally {
      setLoading(false);
      setDocToDelete(null);
    }
  };

  const filteredDocs = documentos.filter(doc =>
    doc.nombre_original.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className={`bg-[#f0f2f5] rounded-b-xl rounded-tr-xl border p-6 relative min-h-[500px] transition-colors ${isDragging ? 'border-orange-400 bg-orange-50' : 'border-gray-200'}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Drag overlay */}
      {isDragging && (
        <div className="absolute inset-0 z-20 rounded-b-xl rounded-tr-xl border-2 border-dashed border-orange-400 bg-orange-50/80 flex flex-col items-center justify-center pointer-events-none">
          <Upload className="w-12 h-12 text-orange-400 mb-3" />
          <p className="text-orange-500 font-bold text-lg">Suelta el archivo aquí</p>
        </div>
      )}

      {/* Search & Actions Bar */}
      <div className="flex justify-between items-center mb-8 gap-4">
        <div className="flex flex-1 gap-2 max-w-[600px]">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar archivo por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 bg-white"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 bg-white text-gray-600 rounded text-sm font-bold hover:bg-gray-50 transition-colors">
            <SlidersHorizontal className="w-4 h-4 text-orange-500" />
            Filtro
          </button>
        </div>

        <div className="flex bg-white border border-gray-200 rounded overflow-hidden shadow-sm">
          <button
            onClick={isAdmin ? onTogglePrivate : undefined}
            title={isAdmin ? (isPrivate ? "Carpeta privada (solo admins) — click para hacer pública" : "Carpeta pública — click para hacer privada") : "Solo los admins pueden cambiar la privacidad"}
            className={`px-4 py-2 flex items-center justify-center transition-colors ${isPrivate ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-white text-gray-400 hover:bg-gray-50'} ${!isAdmin ? 'cursor-default' : ''}`}
          >
            <Lock className="w-4 h-4" />
          </button>
          <button
            onClick={isAdmin ? onTogglePrivate : undefined}
            title={isAdmin ? (isPrivate ? "Carpeta privada (solo admins) — click para hacer pública" : "Carpeta pública — click para hacer privada") : undefined}
            className={`px-4 py-2 flex items-center justify-center border-l border-gray-200 transition-colors ${!isPrivate ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-white text-gray-500 hover:bg-gray-50'} ${!isAdmin ? 'cursor-default' : ''}`}
          >
            <Users className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* States: Loading or Empty or Grid */}
      {loading && documentos.length === 0 ? (
        <div className="text-center py-20 text-gray-500 font-bold">Cargando documentos de la carpeta...</div>
      ) : filteredDocs.length === 0 ? (
        <div className="text-center py-20 text-gray-400 flex flex-col items-center">
          <FileText className="w-12 h-12 mb-3 text-gray-300" />
          <p>La carpeta está vacía.</p>
          <p className="text-sm">Usa el botón de abajo para subir el primer archivo.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {filteredDocs.map((doc) => (
            <a
              key={doc.id}
              href={doc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 flex flex-col h-56 group relative"
            >
              <div className="flex-1 bg-white border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.06)] rounded-sm mb-4 flex items-center justify-center relative hover:bg-gray-50 transition-colors cursor-pointer mx-2 mt-2 group-hover:bg-orange-50 overflow-hidden">
                {['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(doc.extension.toLowerCase()) ? (
                  <img
                    src={doc.url}
                    alt={doc.nombre_original}
                    className="w-full h-full object-cover"
                  />
                ) : doc.extension.toLowerCase() === 'pdf' ? (
                  <iframe
                    src={`${doc.url}#toolbar=0&navpanes=0&scrollbar=0&page=1`}
                    title={doc.nombre_original}
                    className="w-full h-full pointer-events-none"
                    style={{ border: 'none' }}
                  />
                ) : (
                  <span className="text-orange-400 font-bold tracking-widest text-xs uppercase">
                    {doc.extension}
                  </span>
                )}

                {/* Hover Action Blur */}
                <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition-opacity duration-200">
                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white shadow-lg" title="Ver documento">
                    <Eye className="w-5 h-5" />
                  </div>
                  <button
                    onClick={(e) => handleDeleteRequest(doc.id, e)}
                    className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-red-600 transition-colors"
                    title="Mover a papelera"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="flex items-start gap-2 px-1 mb-1">
                <input
                  type="checkbox"
                  onClick={(e) => e.stopPropagation()}
                  className="mt-0.5 rounded border-gray-300 text-orange-500 focus:ring-orange-500 w-3 h-3 cursor-pointer"
                />
                <span className="text-[10px] font-bold text-gray-800 leading-tight line-clamp-2" title={doc.nombre_original}>
                  {doc.nombre_original}
                </span>
              </div>
            </a>
          ))}
        </div>
      )}

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.zip"
      />

      {/* Floating Subir archivo Button */}
      <button
        onClick={handleFileClick}
        disabled={loading}
        className={`absolute bottom-6 right-6 text-white px-5 py-2.5 rounded shadow flex items-center gap-2 text-sm font-bold transition-colors ${loading ? 'bg-orange-300 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600'}`}
      >
        {loading ? 'Subiendo...' : 'Subir archivo'}
        <Upload className="w-4 h-4 ml-1" />
      </button>

      {/* Beautiful Tailwind CSS Modal for Deletion Confirmation */}
      <DeleteConfirmModal
        isOpen={docToDelete !== null}
        onClose={() => setDocToDelete(null)}
        onConfirm={confirmDelete}
        loading={loading}
      />

    </div>
  );
};
