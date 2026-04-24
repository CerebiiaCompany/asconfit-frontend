import React, { useState, useRef, useEffect } from 'react';

export interface StyledDropdownProps {
    label: string;
    placeholder: string;
    value: string;
    options: { value: string; label: string }[];
    onChange: (val: string) => void;
    disabled?: boolean;
}

export function StyledDropdown({ label, placeholder, value, options, onChange, disabled }: StyledDropdownProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const displayText = value
        ? options.find(o => o.value === value)?.label ?? value
        : placeholder;

    return (
        <div ref={ref} className="flex flex-col gap-1 relative">
            <label className="text-sm font-medium text-gray-600">{label}</label>
            <button
                type="button"
                disabled={disabled}
                onClick={() => !disabled && setOpen(o => !o)}
                className={`flex items-center justify-between px-4 py-2.5 border rounded-lg text-sm bg-white focus:outline-none transition-all
                    ${disabled
                        ? 'border-gray-100 bg-gray-100 text-gray-400 cursor-not-allowed'
                        : open
                            ? 'border-orange-400 ring-2 ring-orange-400/20 text-gray-700 cursor-pointer'
                            : 'border-gray-200 text-gray-700 hover:border-orange-300 cursor-pointer'
                    }`}
            >
                <span className="truncate">{displayText}</span>
                <svg
                    className={`w-4 h-4 ml-2 text-gray-400 transition-transform shrink-0 ${open ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {open && (
                <div className="absolute top-full left-0 mt-1 z-20 bg-white border border-gray-200 rounded-lg shadow-lg min-w-full py-1">
                    {value && (
                        <button
                            type="button"
                            onClick={() => { onChange(''); setOpen(false); }}
                            className="w-full text-left px-3 py-1.5 text-xs text-orange-500 hover:bg-orange-50 border-b border-gray-100"
                        >
                            Limpiar selección
                        </button>
                    )}
                    {options.map(opt => (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => { onChange(opt.value); setOpen(false); }}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors
                                ${opt.value === value ? 'text-orange-500 font-medium bg-orange-50/50' : 'text-gray-700'}`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
