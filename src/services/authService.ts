import { api } from './api';

export interface User {
    id: number;
    name: string;
    email: string;
}

export interface AuthResponse {
    access_token: string;
    token_type: string;
    user: User;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export interface UpdateProfileData {
    name: string;
    email: string;
}

export interface UpdatePasswordData {
    current_password: string;
    new_password: string;
    new_password_confirmation: string;
}

class AuthService {
    private tokenKey = 'auth_token';

    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>('/login', credentials);
        this.setToken(response.access_token);
        return response;
    }

    async register(data: RegisterData): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>('/register', data);
        this.setToken(response.access_token);
        return response;
    }

    async logout(): Promise<void> {
        try {
            await api.post('/logout', {});
        } finally {
            this.removeToken();
        }
    }

    async getCurrentUser(): Promise<User> {
        return api.get<User>('/me');
    }

    async updateProfile(data: UpdateProfileData): Promise<{ message: string; user: User }> {
        return api.put<{ message: string; user: User }>('/profile', data);
    }

    async updatePassword(data: UpdatePasswordData): Promise<{ message: string }> {
        return api.put<{ message: string }>('/password', data);
    }

    setToken(token: string): void {
        localStorage.setItem(this.tokenKey, token);
    }

    getToken(): string | null {
        return localStorage.getItem(this.tokenKey);
    }

    removeToken(): void {
        localStorage.removeItem(this.tokenKey);
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }
}

export const authService = new AuthService();
