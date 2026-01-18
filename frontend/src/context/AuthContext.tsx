import { createContext } from 'react';
import type { LoginDto } from '@/types/auth';
import type { User } from '@/types/user';

export interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    isFetching: boolean;
    login: (credentials: LoginDto) => Promise<User>;
    logout: () => Promise<void>;
    updateUserInfo: (newData: User) => void;
}

// On exporte uniquement l'objet Context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);
