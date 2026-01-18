import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAll, updateProfile } from '@/api/userService';
import { logger } from '@/utils/logger';
import type { UpdateUserDto } from '@/types/user';

// 1. Définition des clés de cache
export const userKeys = {
    all: ['users'] as const,
    lists: () => [...userKeys.all, 'list'] as const,
    detail: (id: number) => [...userKeys.all, 'detail', id] as const,
};

/**
 * HOOK: Récupérer la liste de tous les utilisateurs
 */
export function useUsers() {
    return useQuery({
        queryKey: userKeys.lists(),
        queryFn: () => getAll().then((res) => res.data),
        staleTime: 1000 * 60 * 5,
    });
}

/**
 * HOOK: Actions sur les utilisateurs (Mutations)
 */
export function useUserMutations() {
    const queryClient = useQueryClient();

    const updateProfileMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateUserDto }) => updateProfile(id, data),
        onSuccess: (updatedUser) => {
            queryClient.setQueryData(userKeys.detail(updatedUser.id), updatedUser);
            queryClient.invalidateQueries({ queryKey: userKeys.all });
            queryClient.invalidateQueries({ queryKey: ['auth-user'] });
        },
        onError: (error: Error) => {
            logger.error(error.message);
        },
    });

    return {
        updateProfile: updateProfileMutation,
    };
}
