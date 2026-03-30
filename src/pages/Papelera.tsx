import React from 'react';
import { PapeleraList } from '../components/Papelera/PapeleraList';

export const Papelera: React.FC = () => {
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Papelera</h1>
            <PapeleraList />
        </div>
    );
};
