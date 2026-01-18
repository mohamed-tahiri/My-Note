// src/hooks/queries/useNotificationQueries.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getByUserId, markAsRead } from '@/api/notificationsService';
import type { Notification } from '@/types/notification';

export const notificationKeys = {
  all: ['notifications'] as const,
  user: (userId: number) => ['notifications', 'user', userId] as const,
};

export function useNotifications(userId: number) {
  return useQuery({
    queryKey: notificationKeys.user(userId),
    queryFn: () => getByUserId(userId).then(res => res.data),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useNotificationMutations(userId: number) {
  const queryClient = useQueryClient();

  const markReadMutation = useMutation({
    mutationFn: (id: number) => markAsRead(id),
    onSuccess: (_, id) => {
      // Mise à jour optimiste du cache local
      queryClient.setQueryData(notificationKeys.user(userId), (old: Notification[] | undefined) => {
        return old?.map(n => n.id === id ? { ...n, read: true } : n);
      });
    },
  });

  return { markReadMutation };
}