import { createContext } from 'react';
import type { User, LoginDto } from '@/types/auth';

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginDto) => Promise<void>;
  logout: () => Promise<void>;
}

// On exporte uniquement l'objet Context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);