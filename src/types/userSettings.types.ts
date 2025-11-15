import { User } from '../services/authService';

export interface UserSettingsProps {
    initialUser: User;
    onBack: () => void;
    onLogout: () => void;
}

export interface Message {
    type: 'success' | 'error';
    text: string;
}

export type TabType = 'profile' | 'password';
