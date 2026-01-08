import { useState, useEffect, type ReactNode } from 'react';
import { AuthContext } from './AuthContext';
import { login as loginService, logout as logoutService, getCurrentUser } from '@/api/authService';
import type { LoginDto } from '@/types/auth';
import type { User } from '@/types/user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = sessionStorage.getItem('access_token');
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch {
        sessionStorage.removeItem('access_token');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  const updateUserInfo = (newData: User) => {
    setUser(newData);
  };


  const login = async (credentials: LoginDto) => {
    const { access_token } = await loginService(credentials);
    sessionStorage.setItem('access_token', access_token);
    const userData = await getCurrentUser();
    setUser(userData);
  };

  const logout = async () => {
    try { await logoutService(); } 
    finally {
      sessionStorage.removeItem('access_token');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout, updateUserInfo }}>
      {children}
    </AuthContext.Provider>
  );
}