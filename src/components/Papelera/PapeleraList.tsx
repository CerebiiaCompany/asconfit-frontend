import React, { useState, useEffect } from "react";
import { documentoService, Documento } from "../../services/documentoService";
import { useToast } from "../../contexts/ToastContext";
import { DeleteConfirmModal } from "../common/DeleteConfirmModal";

export const PapeleraList: React.FC = () => {
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const { addToast } = useToast();

  const loadTrashed = async () => {
    try {
      setLoading(true);
      const data = await documentoService.getTrashedDocumentos();
      setDocumentos(data);
    } catch (error) {
      console.error(error);
      addToast("Error al cargar la papelera", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrashed();
  }, []);

  const filteredDocs = documentos.filter(doc =>
    (doc.nombre_original || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (doc.carpeta?.empresa?.razon_social || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (doc.carpeta?.nombre || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredDocs.map((d) => d.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleRestore = async () => {
    if (selectedIds.length === 0) return;
    try {
      setLoading(true);
      await documentoService.restoreDocumentos(selectedIds);
      addToast(`Se restauraron ${selectedIds.length} documento(s) exitosamente.`, "success");
      setDocumentos(prev => prev.filter(d => !selectedIds.includes(d.id)));
      setSelectedIds([]);
    } catch (error) {
      console.error(error);
      addToast("Error al restaurar los documentos", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleForceDelete = async () => {
    if (selectedIds.length === 0) return;
    try {
      setLoading(true);
      await documentoService.forceDeleteDocumentos(selectedIds);
      addToast(`Se destruyeron ${selectedIds.length} documento(s) definitivamente.`, "success");
      setDocumentos(prev => prev.filter(d => !selectedIds.includes(d.id)));
      setSelectedIds([]);
      setShowConfirm(false);
    } catch (error) {
      console.error(error);
      addToast("Error al destruir los documentos", "error");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-8 mt-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        {/* Buscador */}
        <div className="relative w-full sm:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-[#FF9411] focus:border-[#FF9411] sm:text-sm text-gray-700"
            placeholder="Buscar por nombre, empresa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Acciones */}
        <div className="flex gap-2 sm:gap-4">
          <button
            disabled={selectedIds.length === 0 || loading}
            onClick={() => setShowConfirm(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-6 py-2 border border-red-500 text-red-600 bg-white rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span className="font-medium">Destruir ({selectedIds.length})</span>
          </button>

          <button
            disabled={selectedIds.length === 0 || loading}
            onClick={handleRestore}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-6 py-2 bg-[#FF9411] text-white rounded-lg hover:opacity-90 transition-opacity shadow-sm disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
            <span className="font-semibold">Restaurar ({selectedIds.length})</span>
          </button>
        </div>
      </div>

      {/* Tabla desktop */}
      <div className="hidden sm:block overflow-x-auto overflow-y-auto max-h-[500px] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-[#FF9411] [&::-webkit-scrollbar-thumb]:rounded-full pr-2">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="sticky top-0 bg-white z-10">
            <tr>
              <th scope="col" className="px-6 py-4 text-left border-t border-b border-gray-200 w-24">
                <div className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-[#FF9411] border-gray-300 rounded focus:ring-[#FF9411] cursor-pointer"
                    onChange={handleSelectAll}
                    checked={filteredDocs.length > 0 && selectedIds.length === filteredDocs.length}
                  />
                  <span className="ml-2 text-sm font-medium text-gray-600">Todos</span>
                </div>
              </th>
              <th scope="col" className="px-6 py-4 text-left border-t border-b border-gray-200">
                <span className="text-sm font-medium text-gray-600">Nombre</span>
              </th>
              <th scope="col" className="px-6 py-4 text-left border-t border-b border-gray-200">
                <span className="text-sm font-medium text-gray-600">Empresa</span>
              </th>
              <th scope="col" className="px-6 py-4 text-left border-t border-b border-gray-200">
                <span className="text-sm font-medium text-gray-600">Ubicación original</span>
              </th>
              <th scope="col" className="px-6 py-4 text-left border-t border-b border-gray-200">
                <span className="text-sm font-medium text-gray-600">Fecha de eliminación</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {loading && filteredDocs.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-500 font-medium">Cargando papelera...</td>
              </tr>
            )}
            {!loading && filteredDocs.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-500 font-medium">La papelera está vacía.</td>
              </tr>
            )}
            {filteredDocs.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-5 whitespace-nowrap">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-[#FF9411] border-gray-300 rounded focus:ring-[#FF9411] cursor-pointer"
                    checked={selectedIds.includes(item.id)}
                    onChange={() => handleSelect(item.id)}
                  />
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <span className="text-[15px] font-bold text-gray-900 drop-shadow-sm flex items-center gap-3">
                    <span className="text-red-500 font-black text-xs px-2 py-0.5 bg-red-50 rounded-md border border-red-100">
                      {(item.extension || '').toUpperCase()}
                    </span>
                    {item.nombre_original}
                  </span>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <span className="text-[15px] text-gray-600 font-medium">
                    {item.carpeta?.empresa?.razon_social || "N/A"}
                  </span>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <span className="text-[15px] text-gray-600 font-medium bg-gray-100 px-3 py-1 rounded-full text-sm">
                    {item.carpeta?.nombre ? `/${item.carpeta.nombre}` : "N/A"}
                  </span>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <span className="text-[15px] text-gray-500 font-semibold whitespace-nowrap block">
                    {item.deleted_at ? new Date(item.deleted_at).toLocaleString() : ""}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards móvil */}
      <div className="sm:hidden">
        {filteredDocs.length > 0 && (
          <label className="flex items-center gap-2 px-1 py-3 border-b border-gray-100 mb-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 text-[#FF9411] border-gray-300 rounded focus:ring-[#FF9411]"
              onChange={handleSelectAll}
              checked={filteredDocs.length > 0 && selectedIds.length === filteredDocs.length}
            />
            <span className="text-sm font-medium text-gray-600">Seleccionar todos</span>
          </label>
        )}
        {loading && filteredDocs.length === 0 && (
          <p className="py-8 text-center text-gray-500 font-medium">Cargando papelera...</p>
        )}
        {!loading && filteredDocs.length === 0 && (
          <p className="py-8 text-center text-gray-500 font-medium">La papelera está vacía.</p>
        )}
        <div className="flex flex-col gap-3">
          {filteredDocs.map((item) => (
            <label
              key={item.id}
              className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${selectedIds.includes(item.id) ? "border-[#FF9411] bg-orange-50" : "border-gray-100 bg-gray-50"
                }`}
            >
              <input
                type="checkbox"
                className="mt-1 w-4 h-4 text-[#FF9411] border-gray-300 rounded focus:ring-[#FF9411]"
                checked={selectedIds.includes(item.id)}
                onChange={() => handleSelect(item.id)}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-red-500 font-black text-xs px-2 py-0.5 bg-red-50 rounded-md border border-red-100 flex-shrink-0">
                    {(item.extension || '').toUpperCase()}
                  </span>
                  <span className="text-sm font-bold text-gray-900 truncate">{item.nombre_original}</span>
                </div>
                <p className="text-xs text-gray-500">{item.carpeta?.empresa?.razon_social || "N/A"}</p>
                <p className="text-xs text-gray-400 mt-0.5">{item.carpeta?.nombre ? `/${item.carpeta.nombre}` : "N/A"}</p>
                <p className="text-xs text-gray-400 mt-0.5">{item.deleted_at ? new Date(item.deleted_at).toLocaleString() : ""}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      <DeleteConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleForceDelete}
        loading={loading}
        title="Destruir Totalmente"
        message={`Estás a punto de vaciar y destruir definitivamente ${selectedIds.length} archivo(s).\nYa NO podrán recuperarse.\n\n¿Deseas continuar?`}
      />
    </div>
  );
};
