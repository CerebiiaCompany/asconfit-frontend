import { useState } from 'react';
import { Role } from '../types/role';

export const useRoleForm = () => {
    const [showForm, setShowForm] = useState(false);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);

    const handleCreateNew = () => {
        setSelectedRole(null);
        setShowForm(true);
    };

    const handleEdit = (role: Role) => {
        setSelectedRole(role);
        setShowForm(true);
    };

    const handleFormClose = () => {
        setShowForm(false);
        setSelectedRole(null);
    };

    return {
        showForm,
        selectedRole,
        handleCreateNew,
        handleEdit,
        handleFormClose,
        setShowForm,
    };
};
