import { type ReactNode } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { AuthContext } from './AuthContext';
import { login as loginService, logout as logoutService, getCurrentUser } from '@/api/authService';
import type { LoginDto } from '@/types/auth';
import type { User } from '@/types/user';

export function AuthProvider({ children }: { children: ReactNode }) {
    const queryClient = useQueryClient();

    const {
        data: user,
        isLoading,
        isFetching,
    } = useQuery({
        queryKey: ['auth-user'],
        queryFn: async () => {
            const token = sessionStorage.getItem('access_token');
            if (!token) return null;
            return await getCurrentUser();
        },
        retry: false,
        staleTime: 1000 * 60 * 10,
    });

    const loginMutation = useMutation({
        mutationFn: async (credentials: LoginDto) => {
            const { access_token } = await loginService(credentials);
            sessionStorage.setItem('access_token', access_token);
            return await getCurrentUser();
        },
        onSuccess: (userData) => {
            queryClient.setQueryData(['auth-user'], userData);
        },
    });

    const logoutMutation = useMutation({
        mutationFn: async () => {
            await logoutService();
        },
        onSettled: () => {
            sessionStorage.removeItem('access_token');
            queryClient.clear();
        },
    });

    const updateUserInfo = (newData: User) => {
        queryClient.setQueryData(['auth-user'], newData);
    };

    return (
        <AuthContext.Provider
            value={{
                user: user ?? null,
                isAuthenticated: !!user,
                isLoading: isLoading || loginMutation.isPending,
                isFetching: isFetching,
                login: loginMutation.mutateAsync,
                logout: logoutMutation.mutateAsync,
                updateUserInfo,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
