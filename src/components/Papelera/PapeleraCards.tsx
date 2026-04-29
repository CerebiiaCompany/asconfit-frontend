// PapeleraCards is no longer used — PapeleraTable now handles all screen sizes with card layout.
// Kept as empty export to avoid import errors.
import React from 'react';
import { Documento } from '../../services/documentoService';

interface PapeleraCardsProps {
    docs: Documento[];
    loading: boolean;
    selectedIds: number[];
    onSelectAll: (checked: boolean) => void;
    onSelect: (id: number) => void;
}

export const PapeleraCards: React.FC<PapeleraCardsProps> = () => null;
