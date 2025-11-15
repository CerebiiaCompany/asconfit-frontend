import React from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    type?: 'success' | 'error' | 'warning' | 'info';
    confirmText?: string;
    onConfirm?: () => void;
}

export const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    message,
    type = 'info',
    confirmText = 'Aceptar',
    onConfirm
}) => {
    if (!isOpen) return null;

    const handleConfirm = () => {
        if (onConfirm) {
            onConfirm();
        }
        onClose();
    };

    const getIconAndColor = () => {
        switch (type) {
            case 'success':
                return {
                    icon: (
                        <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    ),
                    bgColor: 'bg-green-100',
                    buttonColor: 'bg-green-500 hover:bg-green-600'
                };
            case 'error':
                return {
                    icon: (
                        <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    ),
                    bgColor: 'bg-red-100',
                    buttonColor: 'bg-red-500 hover:bg-red-600'
                };
            case 'warning':
                return {
                    icon: (
                        <svg className="w-12 h-12 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    ),
                    bgColor: 'bg-orange-100',
                    buttonColor: 'bg-orange-500 hover:bg-orange-600'
                };
            default:
                return {
                    icon: (
                        <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    ),
                    bgColor: 'bg-blue-100',
                    buttonColor: 'bg-blue-500 hover:bg-blue-600'
                };
        }
    };

    const { icon, bgColor, buttonColor } = getIconAndColor();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all">
                {/* Icon */}
                <div className="flex justify-center pt-8 pb-4">
                    <div className={`${bgColor} rounded-full p-3`}>
                        {icon}
                    </div>
                </div>

                {/* Content */}
                <div className="px-8 pb-8 text-center">
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">
                        {title}
                    </h3>
                    <p className="text-gray-600 mb-6">
                        {message}
                    </p>

                    {/* Button */}
                    <button
                        onClick={handleConfirm}
                        className={`w-full px-6 py-3 ${buttonColor} text-white font-semibold rounded-lg transition-colors shadow-lg`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};
