import React, { useState, useEffect, useRef } from "react";
import { Search, SlidersHorizontal, Lock, Users, Upload, FileText, Trash2, Eye, FolderPlus, Folder, ChevronRight, MoreVertical, Pencil } from "lucide-react";
import { documentoService, Documento, Carpeta } from "../../services/documentoService";
import { useToast } from "../../contexts/ToastContext";
import { DeleteConfirmModal } from "../common/DeleteConfirmModal";

interface WorkPapersProps {
  carpetaId: number;
  empresaId: number;
  isPrivate: boolean;
  isAdmin: boolean;
  onTogglePrivate: () => void;
}

export const WorkPapers: React.FC<WorkPapersProps> = ({ carpetaId, empresaId, isPrivate, isAdmin, onTogglePrivate }) => {
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [subcarpetas, setSubcarpetas] = useState<Carpeta[]>([]);
  const [currentCarpetaId, setCurrentCarpetaId] = useState<number>(carpetaId);
  const [breadcrumb, setBreadcrumb] = useState<Carpeta[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [docToDelete, setDocToDelete] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [creatingFolder, setCreatingFolder] = useState(false);
  const [folderMenu, setFolderMenu] = useState<number | null>(null);
  const [renameModal, setRenameModal] = useState<{ id: number; nombre: string } | null>(null);
  const [deleteFolderModal, setDeleteFolderModal] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addToast } = useToast();

  useEffect(() => {
    setCurrentCarpetaId(carpetaId);
    setBreadcrumb([]);
  }, [carpetaId]);

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCarpetaId]);

  // Cerrar menú de carpeta al hacer clic fuera
  useEffect(() => {
    if (!folderMenu) return;
    const close = () => setFolderMenu(null);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [folderMenu]);

  const loadAll = async () => {
    try {
      setLoading(true);
      const [docs, subs] = await Promise.all([
        documentoService.getDocumentosByCarpeta(currentCarpetaId),
        documentoService.getSubcarpetas(currentCarpetaId),
      ]);
      setDocumentos(docs);
      setSubcarpetas(subs);
    } catch (error) {
      addToast("Error al cargar el contenido de la carpeta", "error");
    } finally {
      setLoading(false);
    }
  };

  const navigateToSubcarpeta = (carpeta: Carpeta) => {
    setBreadcrumb(prev => [...prev, carpeta]);
    setCurrentCarpetaId(carpeta.id);
  };

  const navigateToBreadcrumb = (index: number) => {
    if (index === -1) {
      // Volver a la raíz
      setBreadcrumb([]);
      setCurrentCarpetaId(carpetaId);
    } else {
      const target = breadcrumb[index];
      setBreadcrumb(prev => prev.slice(0, index + 1));
      setCurrentCarpetaId(target.id);
    }
  };

  const handleCreateSubcarpeta = async () => {
    if (!newFolderName.trim()) return;
    try {
      setCreatingFolder(true);
      const nueva = await documentoService.createCarpeta(empresaId, newFolderName.trim(), currentCarpetaId);
      setSubcarpetas(prev => [...prev, nueva]);
      addToast("Subcarpeta creada", "success");
      setShowNewFolderModal(false);
      setNewFolderName("");
    } catch {
      addToast("Error al crear la subcarpeta", "error");
    } finally {
      setCreatingFolder(false);
    }
  };

  const handleRenameFolder = async () => {
    if (!renameModal || !renameModal.nombre.trim()) return;
    try {
      const updated = await documentoService.renameCarpeta(renameModal.id, renameModal.nombre.trim());
      setSubcarpetas(prev => prev.map(s => s.id === updated.id ? updated : s));
      addToast("Carpeta renombrada", "success");
      setRenameModal(null);
    } catch {
      addToast("Error al renombrar la carpeta", "error");
    }
  };

  const handleDeleteFolder = async () => {
    if (!deleteFolderModal) return;
    try {
      await documentoService.deleteCarpeta(deleteFolderModal);
      setSubcarpetas(prev => prev.filter(s => s.id !== deleteFolderModal));
      addToast("Carpeta eliminada y documentos movidos a papelera", "success");
      setDeleteFolderModal(null);
    } catch {
      addToast("Error al eliminar la carpeta", "error");
    }
  };

  const handleFileClick = () => fileInputRef.current?.click();

  const uploadFile = async (file: File) => {
    if (file.size > 50 * 1024 * 1024) {
      addToast("El archivo no puede exceder los 50 MB", "warning");
      return;
    }
    try {
      setLoading(true);
      const newDoc = await documentoService.uploadDocumento(currentCarpetaId, file);
      setDocumentos(prev => [...prev, newDoc]);
      addToast("Documento subido correctamente", "success");
    } catch (error: any) {
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

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); };
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
    } catch {
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
      <div className="flex justify-between items-center mb-4 gap-4">
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

        <div className="flex items-center gap-2">
          {/* Botón nueva subcarpeta */}
          <button
            onClick={() => setShowNewFolderModal(true)}
            title="Crear subcarpeta"
            className="flex items-center gap-2 px-3 py-2 border border-gray-300 bg-white text-gray-600 rounded text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <FolderPlus className="w-4 h-4 text-orange-500" />
            <span className="hidden sm:inline">Nueva carpeta</span>
          </button>

          {isAdmin && (
            <div className="flex bg-white border border-gray-200 rounded overflow-hidden shadow-sm">
              <button
                onClick={onTogglePrivate}
                title={isPrivate ? "Carpeta privada — click para hacer pública" : "Carpeta pública — click para hacer privada"}
                className={`px-4 py-2 flex items-center justify-center transition-colors ${isPrivate ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-white text-gray-400 hover:bg-gray-50'}`}
              >
                <Lock className="w-4 h-4" />
              </button>
              <button
                onClick={onTogglePrivate}
                title={isPrivate ? "Carpeta privada — click para hacer pública" : "Carpeta pública — click para hacer privada"}
                className={`px-4 py-2 flex items-center justify-center border-l border-gray-200 transition-colors ${!isPrivate ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
              >
                <Users className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Breadcrumb */}
      {breadcrumb.length > 0 && (
        <div className="flex items-center gap-1 mb-4 text-sm text-gray-500">
          <button onClick={() => navigateToBreadcrumb(-1)} className="hover:text-orange-500 transition-colors font-medium">
            Inicio
          </button>
          {breadcrumb.map((crumb, i) => (
            <React.Fragment key={crumb.id}>
              <ChevronRight className="w-3 h-3" />
              <button
                onClick={() => navigateToBreadcrumb(i)}
                className={`hover:text-orange-500 transition-colors ${i === breadcrumb.length - 1 ? 'text-orange-500 font-semibold' : ''}`}
              >
                {crumb.nombre}
              </button>
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Content */}
      {loading && documentos.length === 0 && subcarpetas.length === 0 ? (
        <div className="text-center py-20 text-gray-500 font-bold">Cargando...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {/* Subcarpetas */}
          {subcarpetas.map((sub) => (
            <div key={sub.id} className="relative group/folder">
              <button
                onClick={() => navigateToSubcarpeta(sub)}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex flex-col items-center justify-center h-40 w-full gap-3 hover:border-orange-300 hover:shadow-md transition-all group"
              >
                <Folder className="w-12 h-12 text-orange-400 group-hover:text-orange-500 transition-colors" />
                <span className="text-xs font-semibold text-gray-700 text-center line-clamp-2">{sub.nombre}</span>
              </button>
              {/* Menú 3 puntos */}
              <div className="absolute top-2 right-2">
                <button
                  onClick={(e) => { e.stopPropagation(); setFolderMenu(folderMenu === sub.id ? null : sub.id); }}
                  className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center opacity-0 group-hover/folder:opacity-100 hover:bg-gray-100 transition-all shadow-sm"
                >
                  <MoreVertical className="w-4 h-4 text-gray-500" />
                </button>
                {folderMenu === sub.id && (
                  <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[140px] py-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); setRenameModal({ id: sub.id, nombre: sub.nombre }); setFolderMenu(null); }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Pencil className="w-4 h-4 text-gray-400" />
                      Renombrar
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setDeleteFolderModal(sub.id); setFolderMenu(null); }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      Eliminar
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Documentos */}
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
                  <img src={doc.url} alt={doc.nombre_original} className="w-full h-full object-cover" />
                ) : doc.extension.toLowerCase() === 'pdf' ? (
                  <iframe
                    src={`${doc.url}#toolbar=0&navpanes=0&scrollbar=0&page=1`}
                    title={doc.nombre_original}
                    className="w-full h-full pointer-events-none"
                    style={{ border: 'none' }}
                  />
                ) : (
                  <span className="text-orange-400 font-bold tracking-widest text-xs uppercase">{doc.extension}</span>
                )}
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
                <input type="checkbox" onClick={(e) => e.stopPropagation()} className="mt-0.5 rounded border-gray-300 text-orange-500 focus:ring-orange-500 w-3 h-3 cursor-pointer" />
                <span className="text-[10px] font-bold text-gray-800 leading-tight line-clamp-2" title={doc.nombre_original}>
                  {doc.nombre_original}
                </span>
              </div>
            </a>
          ))}

          {/* Empty state */}
          {subcarpetas.length === 0 && filteredDocs.length === 0 && (
            <div className="col-span-4 text-center py-20 text-gray-400 flex flex-col items-center">
              <FileText className="w-12 h-12 mb-3 text-gray-300" />
              <p>La carpeta está vacía.</p>
              <p className="text-sm">Sube archivos o crea subcarpetas.</p>
            </div>
          )}
        </div>
      )}

      {/* Hidden File Input — acepta todos los tipos */}
      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="*/*" />

      {/* Floating Subir archivo Button */}
      <button
        onClick={handleFileClick}
        disabled={loading}
        className={`absolute bottom-6 right-6 text-white px-5 py-2.5 rounded shadow flex items-center gap-2 text-sm font-bold transition-colors ${loading ? 'bg-orange-300 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600'}`}
      >
        {loading ? 'Subiendo...' : 'Subir archivo'}
        <Upload className="w-4 h-4 ml-1" />
      </button>

      {/* Modal nueva subcarpeta */}
      {showNewFolderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => { setShowNewFolderModal(false); setNewFolderName(""); }} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-base font-bold text-gray-800 mb-1">Nueva subcarpeta</h2>
            <p className="text-xs text-gray-400 mb-4">Se creará dentro de la carpeta actual</p>
            <input
              autoFocus
              type="text"
              value={newFolderName}
              onChange={e => setNewFolderName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleCreateSubcarpeta(); if (e.key === 'Escape') { setShowNewFolderModal(false); setNewFolderName(""); } }}
              placeholder="Ej: Facturas 2026"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 mb-5"
            />
            <div className="flex gap-3 justify-end">
              <button onClick={() => { setShowNewFolderModal(false); setNewFolderName(""); }} className="px-5 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">
                Cancelar
              </button>
              <button
                onClick={handleCreateSubcarpeta}
                disabled={!newFolderName.trim() || creatingFolder}
                className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold disabled:opacity-50"
              >
                {creatingFolder ? "Creando..." : "Crear"}
              </button>
            </div>
          </div>
        </div>
      )}

      <DeleteConfirmModal
        isOpen={docToDelete !== null}
        onClose={() => setDocToDelete(null)}
        onConfirm={confirmDelete}
        loading={loading}
      />

      {/* Modal renombrar carpeta */}
      {renameModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setRenameModal(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-base font-bold text-gray-800 mb-4">Renombrar carpeta</h2>
            <input
              autoFocus
              type="text"
              value={renameModal.nombre}
              onChange={e => setRenameModal({ ...renameModal, nombre: e.target.value })}
              onKeyDown={e => { if (e.key === 'Enter') handleRenameFolder(); if (e.key === 'Escape') setRenameModal(null); }}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 mb-5"
            />
            <div className="flex gap-3 justify-end">
              <button onClick={() => setRenameModal(null)} className="px-5 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">
                Cancelar
              </button>
              <button
                onClick={handleRenameFolder}
                disabled={!renameModal.nombre.trim()}
                className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold disabled:opacity-50"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal eliminar carpeta */}
      <DeleteConfirmModal
        isOpen={deleteFolderModal !== null}
        onClose={() => setDeleteFolderModal(null)}
        onConfirm={handleDeleteFolder}
        loading={false}
      />
    </div>
  );
};