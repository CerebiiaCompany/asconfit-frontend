import React from "react";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const LogoutModal: React.FC<LogoutModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-md p-10 overflow-hidden transform transition-all">
        <div className="flex flex-col items-center text-center">
          {/* Icon Section */}
          <div className="mb-8 relative">
            <img 
              src="/sign-out.png" 
              alt="Cerrar Sesión" 
              className="w-16 h-16 object-contain"
            />
          </div>

          {/* Text Section */}
          <h3 className="text-2xl font-bold text-[#FF9411] mb-6 leading-tight max-w-[280px]">
            ¿Estás seguro de querer Cerrar Sesión?
          </h3>
          
          <p className="text-gray-600 text-base mb-10 leading-relaxed max-w-[320px]">
            Tu sesión actual se cerrará y deberás iniciar sesión nuevamente para continuar.
          </p>

          {/* Buttons Section */}
          <div className="flex gap-4 w-full">
            <button
              onClick={onConfirm}
              className="flex-1 py-4 px-6 rounded-2xl border-2 border-[#FF9411] text-gray-800 font-bold text-lg hover:bg-gray-50 transition-colors"
            >
              Si
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-4 px-6 rounded-2xl bg-[#FF9411] text-white font-bold text-lg hover:opacity-90 transition-opacity shadow-lg shadow-orange-200"
            >
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
