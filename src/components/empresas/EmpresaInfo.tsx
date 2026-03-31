import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Empresa as EmpresaModel } from "../../services/empresaService";

interface EmpresaInfoProps {
  initialData?: EmpresaModel | null;
}

export const EmpresaInfo: React.FC<EmpresaInfoProps> = ({ initialData }) => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());

  // Form State
  const [formData, setFormData] = useState<Partial<EmpresaModel>>({
    nit: "",
    razon_social: "",
    representante_legal: "",
    correo_empresarial: "",
  });
  const [isUpdating, setIsUpdating] = useState(false);

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

  // Calendar
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const month = new Intl.DateTimeFormat("es-ES", { month: "long" }).format(currentDate);
  const formattedMonth = month.charAt(0).toUpperCase() + month.slice(1);
  const currentMonthYear = `${formattedMonth} ${currentDate.getFullYear()}`;

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const events: Record<number, string> = {
    10: "Fecha límite para información general",
    19: "Auditoría programada",
  };

  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => (
    <div key={`blank-${i}`}></div>
  ));

  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const eventMsg = events[day];

    if (eventMsg) {
      return (
        <div key={`day-${day}`} className="relative group">
          <div className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center mx-auto cursor-pointer shadow-sm">
            {day}
          </div>
          <div className="absolute top-1/2 right-full mr-2 transform -translate-y-1/2 w-[160px] bg-gray-300/80 text-gray-800 p-1.5 rounded shadow-sm flex gap-1.5 items-center z-10 backdrop-blur-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none">
            <span className="font-bold text-xs bg-gray-400/30 px-1 py-0.5 rounded">
              {day}
            </span>
            <span className="text-[9px] font-semibold leading-tight text-left">
              {eventMsg}
            </span>
            <div className="absolute right-[-4px] top-1/2 transform -translate-y-1/2 w-2 h-2 bg-gray-300/80 rotate-45 backdrop-blur-sm"></div>
          </div>
        </div>
      );
    }
    return (
      <div key={`day-${day}`}>
        {day}
      </div>
    );
  });

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

      {/* Calendar Widget */}
      <div className="flex justify-start lg:justify-end">
        <div className="border border-gray-300 rounded-lg shadow-sm p-4 w-[280px] bg-white relative">
          <div className="flex justify-between items-center mb-6 text-gray-600 px-2">
            <ChevronLeft onClick={handlePrevMonth} className="w-4 h-4 cursor-pointer text-gray-400 hover:text-orange-500 transition-colors" />
            <span className="font-bold text-sm text-gray-700">
              {currentMonthYear}
            </span>
            <ChevronRight onClick={handleNextMonth} className="w-4 h-4 cursor-pointer text-gray-400 hover:text-orange-500 transition-colors" />
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-[9px] font-bold text-gray-400 mb-4 tracking-wider">
            <div>SUN</div>
            <div>MON</div>
            <div>TUE</div>
            <div>WED</div>
            <div>THU</div>
            <div>FRI</div>
            <div>SAT</div>
          </div>
          <div className="grid grid-cols-7 gap-y-3 text-center text-xs text-gray-800 font-bold">
            {blanks}
            {days}
          </div>
        </div>
      </div>
    </div>
  );
};
