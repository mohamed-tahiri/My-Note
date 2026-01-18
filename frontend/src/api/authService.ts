import type { AuthResponse, LoginDto } from '@/types/auth';
import api from './api';
import type { User } from '@/types/user';

/**
 * Identifie l'utilisateur et initialise la session
 */
export const login = async (credentials: LoginDto): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
};

/**
 * Rafraîchit le Access Token en utilisant le Refresh Token
 * NestJS s'attend à recevoir le Refresh Token (souvent via cookie ou header)
 */
export const refreshToken = async (): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/auth/refresh');
    return data;
};

/**
 * Supprime la session côté serveur
 */
export const logout = async (): Promise<void> => {
    await api.post('/auth/logout');
};

/**
 * Récupère le profil de l'utilisateur actuel (Route /me)
 */
export const getCurrentUser = async (): Promise<User> => {
    const { data } = await api.get<User>('/auth/me');
    return data;
};
