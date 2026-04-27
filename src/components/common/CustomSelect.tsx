import React, { useState, useRef, useEffect } from 'react';

interface Option {
    value: string | number | "";
    label: string;
}

interface CustomSelectProps {
    value: string | number | "";
    options: Option[];
    onChange: (value: string) => void;
    disabled?: boolean;
    placeholder?: string;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
    value,
    options,
    onChange,
    disabled = false,
    placeholder = 'Seleccionar...',
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [openUpward, setOpenUpward] = useState(false);
    const selectRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find((opt) => opt.value.toString() === value.toString());

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (isOpen && selectRef.current && dropdownRef.current) {
            const selectRect = selectRef.current.getBoundingClientRect();
            const dropdownHeight = dropdownRef.current.offsetHeight;
            const spaceBelow = window.innerHeight - selectRect.bottom;
            const spaceAbove = selectRect.top;

            // Si no hay suficiente espacio abajo pero sí arriba, abrir hacia arriba
            if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
                setOpenUpward(true);
            } else {
                setOpenUpward(false);
            }
        }
    }, [isOpen]);

    const handleSelect = (optionValue: string | number | "") => {
        onChange(optionValue.toString());
        setIsOpen(false);
    };

    return (
        <div ref={selectRef} className="relative">
            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className="appearance-none w-full px-4 py-2.5 pr-10 text-sm font-medium border-2 border-gray-200 rounded-xl bg-white hover:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer text-left"
            >
                <span className={selectedOption ? 'text-gray-900' : 'text-gray-400'}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                    <svg
                        className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </button>

            {isOpen && (
                <div
                    ref={dropdownRef}
                    className={`absolute z-50 w-full bg-white border-2 border-gray-200 rounded-xl shadow-xl max-h-60 overflow-auto left-0 ${openUpward ? 'bottom-full mb-2' : 'top-full mt-2'
                        }`}
                >
                    {options.map((option, index) => (
                        <button
                            key={option.value || index}
                            type="button"
                            onClick={() => handleSelect(option.value)}
                            className={`block w-full px-4 py-3 text-left text-sm font-medium transition-colors ${index === 0 ? 'rounded-t-xl' : ''
                                } ${index === options.length - 1 ? 'rounded-b-xl' : ''
                                } ${option.value.toString() === value.toString()
                                    ? 'bg-orange-50 text-orange-600'
                                    : 'text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
