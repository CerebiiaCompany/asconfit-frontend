import React from "react";

const services = [
  { name: "Revisoría Fiscal", icon: "/Servicios-Asconfit/rf 1.png" },
  { name: "Actualización NIIF", icon: "/Servicios-Asconfit/niif 1.png" },
  { name: "Auditoría Externa", icon: "/Servicios-Asconfit/ae 1.png" },
  {
    name: "Evaluación y Estructura Societaria",
    icon: "/Servicios-Asconfit/ees 1.png",
  },
  { name: "Valoración de Empresas", icon: "/Servicios-Asconfit/ve 1.png" },
  { name: "Control Interno", icon: "/Servicios-Asconfit/ci 1.png" },
  { name: "Análisis de Riesgos", icon: "/Servicios-Asconfit/ar 1.png" },
  {
    name: "Auditoría Financiera y Tributaria",
    icon: "/Servicios-Asconfit/aft 1.png",
  },
  {
    name: "Inteligencia Artificial Aplicada a la Profesión Contable",
    icon: "/Servicios-Asconfit/ia 1.png",
  },
];

export const OurServices: React.FC = () => {
    // Dividimos los 9 servicios: 4 para la primera fila, 5 para la segunda
    const firstRow = services.slice(0, 4);
    const secondRow = services.slice(4);

    return (
        <div className="bg-white rounded-2xl shadow-xl p-6 h-full border border-gray-100 flex flex-col">
            <h3 className="text-xl font-semibold text-gray-800 text-center mb-6">Nuestros Servicios</h3>
            
            <div className="flex flex-col justify-center flex-grow gap-6">
                {/* Primera Fila: 4 elementos centrados, sin romper línea */}
                <div className="flex flex-nowrap items-center justify-center gap-3 sm:gap-4">
                    {firstRow.map((service, index) => (
                        <ServiceItem key={`row-1-${index}`} service={service} />
                    ))}
                </div>

                {/* Segunda Fila: 5 elementos centrados, sin romper línea */}
                <div className="flex flex-nowrap items-center justify-center gap-3 sm:gap-4">
                    {secondRow.map((service, index) => (
                        <ServiceItem key={`row-2-${index}`} service={service} />
                    ))}
                </div>
            </div>
        </div>
    );
};

const ServiceItem: React.FC<{ service: typeof services[0] }> = ({ service }) => (
    <div className="flex flex-col items-center justify-center p-2 w-24 sm:w-28 rounded-xl border border-gray-50 bg-white hover:shadow-lg transition-all duration-300 text-center shadow-sm h-full">
        <div className="w-8 h-8 mb-2 flex items-center justify-center">
            <img 
                src={service.icon} 
                alt={service.name}
                className="max-w-full max-h-full object-contain"
            />
        </div>
        <span className="text-[9px] sm:text-[10px] font-bold text-gray-700 leading-tight">
            {service.name}
        </span>
    </div>
);
