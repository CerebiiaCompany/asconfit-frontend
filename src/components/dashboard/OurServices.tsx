import React from 'react';

const services = [
    { name: 'Revisoría Fiscal', icon: '/Servicios-Asconfit/rf 1.png' },
    { name: 'Actualización NIIF', icon: '/Servicios-Asconfit/niif 1.png' },
    { name: 'Auditoría Externa', icon: '/Servicios-Asconfit/ae 1.png' },
    { name: 'Evaluación y Estructura Societaria', icon: '/Servicios-Asconfit/ees 1.png' },
    { name: 'Valoración de Empresas', icon: '/Servicios-Asconfit/ve 1.png' },
    { name: 'Control Interno', icon: '/Servicios-Asconfit/ci 1.png' },
    { name: 'Análisis de Riesgos', icon: '/Servicios-Asconfit/ar 1.png' },
    { name: 'Auditoría Financiera y Tributaria', icon: '/Servicios-Asconfit/aft 1.png' },
    { name: 'Inteligencia Artificial Aplicada a la Profesión Contable', icon: '/Servicios-Asconfit/ia 1.png' },
];

export const OurServices: React.FC = () => {
    return (
        <div className="bg-white rounded-2xl shadow-xl p-6 h-full border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-800 text-center mb-6">Nuestros Servicios</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {services.map((service, index) => (
                    <div 
                        key={index}
                        className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-50 bg-white hover:shadow-md transition-shadow duration-200 text-center"
                    >
                        <div className="w-12 h-12 mb-3 flex items-center justify-center">
                            <img 
                                src={service.icon} 
                                alt={service.name}
                                className="max-w-full max-h-full object-contain"
                            />
                        </div>
                        <span className="text-[10px] sm:text-xs font-medium text-gray-700 leading-tight">
                            {service.name}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};
