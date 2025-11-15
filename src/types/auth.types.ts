export interface RegisterFormProps {
    onRegisterSuccess: () => void;
}

export interface RegisterFormData {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}
