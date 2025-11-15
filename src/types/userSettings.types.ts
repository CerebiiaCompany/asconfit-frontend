export interface UserSettingsProps {
    onBack: () => void;
    onLogout: () => void;
}

export interface Message {
    type: 'success' | 'error';
    text: string;
}

export type TabType = 'profile' | 'password';
