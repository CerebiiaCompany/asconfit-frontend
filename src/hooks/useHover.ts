import { useState, useCallback } from 'react';

interface UseHoverReturn {
    isHovered: boolean;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
}

/**
 * Hook personalizado para manejar el estado hover de elementos
 */
export const useHover = (): UseHoverReturn => {
    const [isHovered, setIsHovered] = useState(false);

    const onMouseEnter = useCallback(() => {
        setIsHovered(true);
    }, []);

    const onMouseLeave = useCallback(() => {
        setIsHovered(false);
    }, []);

    return {
        isHovered,
        onMouseEnter,
        onMouseLeave,
    };
};
