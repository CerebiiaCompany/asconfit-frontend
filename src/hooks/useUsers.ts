import { useState, useEffect } from 'react';
import { User, userService } from '../services/userService';

export const useUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await userService.getAllUsers();
            setUsers(data);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al cargar usuarios';
            console.error('Load users error:', errorMessage);
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const updateUserRole = async (userId: number, roleId: number) => {
        try {
            const updatedUser = await userService.updateUserRole(userId, roleId);
            console.log('Updated user:', updatedUser);
            setUsers(prevUsers => prevUsers.map(u => u.id === userId ? updatedUser : u));
            return updatedUser;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al actualizar rol';
            setError(errorMessage);
            throw err;
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    return { users, setUsers, loading, error, loadUsers, updateUserRole };
};
