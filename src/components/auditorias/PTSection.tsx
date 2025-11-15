import React from 'react';

interface PTSectionProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const PTSection: React.FC<PTSectionProps> = ({ value, onChange }) => {
    return (
        <div className="mb-8 flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
            <label className="text-sm text-gray-600 sm:w-32 flex-shrink-0 sm:pt-2">PT:</label>
            <textarea
                name="pt"
                value={value}
                onChange={onChange}
                rows={3}
                className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical bg-[#F3F3F3] text-sm sm:text-base"
            />
        </div>
    );
};
