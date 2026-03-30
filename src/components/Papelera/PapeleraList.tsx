import React, { useState } from "react";

// Tipo de dato falso para la tabla
interface TrasheableItem {
  id: number;
  nombre: string;
  empresa: string;
  ubicacion: string;
  fecha: string;
}

// Generamos 20 items falsos tal como en la imagen para forzar el scroll
const fakeData: TrasheableItem[] = Array(20)
  .fill(null)
  .map((_, index) => ({
    id: index,
    nombre: "RIT - Registro de identificación tributaria.Pdf",
    empresa: "Cerámica Italia",
    ubicacion: "Documentos Legales",
    fecha: "18/03/2026",
  }));

export const PapeleraList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(fakeData.map((d) => d.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mt-6">
      {/* Sección principal: Buscador y Botones */}
      <div className="flex justify-between items-center mb-6">
        {/* Buscador */}
        <div className="relative w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-[#FF9411] focus:border-[#FF9411] sm:text-sm text-gray-700"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Botones de acción derecha */}
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-6 py-2 border border-[#FF9411] text-gray-700 bg-white rounded-lg hover:bg-orange-50 transition-colors">
            <svg
              className="w-5 h-5 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            <span className="font-medium text-sm">Vaciar papelera</span>
          </button>

          <button className="flex items-center gap-2 px-6 py-2 bg-[#FF9411] text-white rounded-lg hover:opacity-90 transition-opacity shadow-sm">
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
              />
            </svg>
            <span className="font-semibold text-sm drop-shadow-sm">Restaurar Archivos</span>
          </button>
        </div>
      </div>

      {/* Tabla con Scrollbar Personalizado */}
      <div className="overflow-x-auto overflow-y-auto max-h-[500px] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-[#FF9411] [&::-webkit-scrollbar-thumb]:rounded-full pr-2">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="sticky top-0 bg-white z-10">
            <tr>
              <th scope="col" className="px-6 py-4 text-left border-t border-b border-gray-200 w-24">
                <div className="flex items-center gap-1 cursor-pointer">
                  <span className="text-sm font-medium text-gray-600">Select</span>
                  <svg className="w-3 h-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </th>
              <th scope="col" className="px-6 py-4 text-left border-t border-b border-gray-200">
                <div className="flex items-center gap-1 cursor-pointer">
                  <span className="text-sm font-medium text-gray-600">Nombre</span>
                  <svg className="w-3 h-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </th>
              <th scope="col" className="px-6 py-4 text-left border-t border-b border-gray-200">
                <div className="flex items-center gap-1 cursor-pointer">
                  <span className="text-sm font-medium text-gray-600">Empresa</span>
                  <svg className="w-3 h-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </th>
              <th scope="col" className="px-6 py-4 text-left border-t border-b border-gray-200">
                <div className="flex items-center gap-1 cursor-pointer">
                  <span className="text-sm font-medium text-gray-600">Ubicación original</span>
                  <svg className="w-3 h-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </th>
              <th scope="col" className="px-6 py-4 text-left border-t border-b border-gray-200">
                <div className="flex items-center gap-1 cursor-pointer">
                  <span className="text-sm font-medium text-gray-600">Fecha de eliminación</span>
                  <svg className="w-3 h-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {fakeData.map((item) => (
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
                  <span className="text-[15px] font-bold text-gray-900 drop-shadow-sm">
                    {item.nombre}
                  </span>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <span className="text-[15px] text-gray-600 font-medium">
                    {item.empresa}
                  </span>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <span className="text-[15px] text-gray-600 font-medium">
                    {item.ubicacion}
                  </span>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <span className="text-[15px] text-gray-600 font-medium whitespace-nowrap block">
                    {item.fecha}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
