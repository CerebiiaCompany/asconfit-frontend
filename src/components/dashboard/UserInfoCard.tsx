import React from 'react';
import { User } from '../../services/authService';

interface UserInfoCardProps {
    user: User | null;
}

export const UserInfoCard: React.FC<UserInfoCardProps> = ({ user }) => {
    return (
        <div className="bg-white overflow-hidden shadow-xl rounded-2xl">
            <div className="px-6 py-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                    Información de Usuario
                </h3>
                <div className="space-y-4">
                    <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0">
                            <svg className="h-8 w-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Nombre</p>
                            <p className="text-lg font-semibold text-gray-900">{user?.name}</p>
                        </div>
                    </div>

                    <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0">
                            <svg className="h-8 w-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Email</p>
                            <p className="text-lg font-semibold text-gray-900">{user?.email}</p>
                        </div>
                    </div>

                    <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0">
                            <svg className="h-8 w-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">ID de Usuario</p>
                            <p className="text-lg font-semibold text-gray-900">#{user?.id}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
