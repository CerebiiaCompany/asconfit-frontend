import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Empresa as EmpresaModel } from "../../services/empresaService";
import { Calendar, CalendarEvent } from "../common/Calendar";

interface EmpresaInfoProps {
  initialData?: EmpresaModel | null;
}

export const EmpresaInfo: React.FC<EmpresaInfoProps> = ({ initialData }) => {
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState<Partial<EmpresaModel>>({
    nit: "",
    razon_social: "",
    representante_legal: "",
    correo_empresarial: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        nit: initialData.nit || "",
        razon_social: initialData.razon_social || "",
        representante_legal: initialData.representante_legal || "",
        correo_empresarial: initialData.correo_empresarial || initialData.correo_personal || "",
      });
    }
  }, [initialData]);

  const handleUpdate = () => {
    if (initialData?.id) {
       navigate(`/empresas/crear?id=${initialData.id}`);
    }
  };

  // Calendar Events
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    if (initialData?.id) {
      const { empresaService } = require("../../services/empresaService");
      empresaService.getCalendario(initialData.id)
        .then((data: any[]) => {
          const events: CalendarEvent[] = data.map(evt => ({
            date: evt.fecha,
            title: evt.titulo,
            color: 'bg-orange-500' // Color estándar para requerimientos
          }));
          setCalendarEvents(events);
        })
        .catch((err: any) => console.error("Error cargando calendario:", err));
    }
  }, [initialData]);

  return (
    <div className="flex flex-col lg:flex-row justify-between gap-12 mb-8">
      {/* Form Details */}
      <div className="space-y-4 w-full max-w-[550px] pt-4 pl-4 md:pl-8">
        <div className="grid grid-cols-[160px_1fr] items-center">
          <label className="text-gray-400 text-sm">Nit:</label>
          <input
            type="text"
            name="nit"
            value={formData.nit || ""}
            readOnly
            className="bg-gray-100 border border-gray-200 text-gray-800 font-medium rounded px-3 py-1.5 text-sm w-full outline-none"
          />
        </div>
        <div className="grid grid-cols-[160px_1fr] items-center">
          <label className="text-gray-400 text-sm">Razón social:</label>
          <input
            type="text"
            name="razon_social"
            value={formData.razon_social || ""}
            readOnly
            className="bg-gray-100 border border-gray-200 text-gray-800 font-medium rounded px-3 py-1.5 text-sm w-full outline-none"
          />
        </div>
        <div className="grid grid-cols-[160px_1fr] items-center">
          <label className="text-gray-400 text-sm">Representante legal:</label>
          <input
            type="text"
            name="representante_legal"
            value={formData.representante_legal || ""}
            readOnly
            className="bg-gray-100 border border-gray-200 text-gray-800 font-medium rounded px-3 py-1.5 text-sm w-full outline-none"
          />
        </div>
        <div className="grid grid-cols-[160px_1fr] items-center">
          <label className="text-gray-400 text-sm">Correo Corporativo:</label>
          <input
            type="email"
            name="correo_empresarial"
            value={formData.correo_empresarial || ""}
            readOnly
            className="bg-gray-100 border border-gray-200 text-gray-800 font-medium rounded px-3 py-1.5 text-sm w-full outline-none"
          />
        </div>
        <div className="flex justify-end pt-2">
          <button 
            type="button"
            onClick={handleUpdate}
            disabled={!initialData}
            className={`px-6 py-2 border border-orange-400 rounded text-sm font-medium transition-colors bg-white text-gray-700 hover:bg-orange-50`}
          >
            Actualizar Datos
          </button>
        </div>
      </div>

      {/* Reusable Calendar Component */}
      <div className="flex justify-start lg:justify-end">
        <Calendar events={calendarEvents} />
      </div>
    </div>
  );
};
