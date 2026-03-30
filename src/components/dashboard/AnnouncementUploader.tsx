import React from 'react';
import { Upload } from 'lucide-react';

export const AnnouncementUploader: React.FC = () => {
    return (
        <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center justify-center h-full min-h-[350px] border border-gray-100">
            <div className="bg-gray-100/50 rounded-xl w-full h-full flex items-center justify-center border-2 border-dashed border-gray-200">
                <button className="bg-[#F97316] hover:bg-orange-600 text-white px-8 py-3 rounded-xl flex items-center gap-3 font-bold text-lg shadow-lg transform transition hover:scale-105 active:scale-95">
                    Subir Comunicado
                    <Upload size={24} />
                </button>
            </div>
        </div>
    );
};
