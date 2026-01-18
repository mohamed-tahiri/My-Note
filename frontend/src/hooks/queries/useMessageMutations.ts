// src/hooks/queries/useMessageMutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { create, update } from '@/api/messagesService';
import { chatKeys } from './useChatQueries';
import type { CreateMessageDto, UpdateMessageDto } from '@/types/message';

export function useMessageMutations() {
    const queryClient = useQueryClient();

    const sendMessage = useMutation({
        mutationFn: (payload: CreateMessageDto) => create(payload),
        onSuccess: (res) => {
           queryClient.invalidateQueries({ queryKey: chatKeys.detail(res.data.chat.id) });
        },
    });

    const updateMessage = useMutation({
        mutationFn: ({ id, dto }: { id: number; dto: UpdateMessageDto }) => update(id, dto),
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: chatKeys.detail(res.data.chat.id) });
        },
    });

    return { sendMessage, updateMessage };
}