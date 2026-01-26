// src/hooks/queries/useChatQueries.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getChatsByUser, getById, create } from '@/api/chatService';
import type { CreateChatDto } from '@/types/chat';

export const chatKeys = {
    all: ['chats'] as const,
    user: (id: number) => ['chats', 'user', id] as const,
    detail: (id: number) => ['chats', 'detail', id] as const,
};

export function useChats(currentUserId: number) {
    return useQuery({
        queryKey: chatKeys.user(currentUserId),
        queryFn: () => getChatsByUser(currentUserId).then((res) => res.data),
        enabled: !!currentUserId,
    });
}

export function useChatMutations() {
    const queryClient = useQueryClient();

    const createChat = useMutation({
        mutationFn: (payload: CreateChatDto) => create(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: chatKeys.all });
        },
    });

    return { createChat };
}

export function useChatDetail(chatId: number | undefined) {
    return useQuery({
        queryKey: chatKeys.detail(chatId!),
        queryFn: () => getById(chatId!).then((res) => res.data),
        enabled: !!chatId,
        staleTime: 1000 * 60 * 2,
    });
}
