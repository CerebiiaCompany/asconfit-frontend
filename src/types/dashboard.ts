export type DashboardView = 'inicio' | 'auditorias' | 'empresas' | 'perfil' | 'settings';

export interface DashboardProps {
    onLogout: () => void;
}
