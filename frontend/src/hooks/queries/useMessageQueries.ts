import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getByChat, create, update } from '@/api/messagesService';
import { chatKeys } from './useChatQueries';
import type { CreateMessageDto, UpdateMessageDto, Message } from '@/types/message';

// 1. Clés de cache pour les messages
export const messageKeys = {
  all: ['messages'] as const,
  byChat: (chatId: number) => [...messageKeys.all, 'chat', chatId] as const,
};

/**
 * HOOK: Récupérer les messages d'une conversation
 */
export function useMessages(chatId: number | undefined) {
  return useQuery({
    queryKey: messageKeys.byChat(chatId!),
    queryFn: () => getByChat(chatId!).then(res => res.data),
    enabled: !!chatId,
    // On garde les messages en cache car le temps réel (Socket) s'occupera des mises à jour
    staleTime: Infinity, 
  });
}

/**
 * HOOK: Actions sur les messages
 */
export function useMessageMutations() {
  const queryClient = useQueryClient();

  // Envoyer un message
  const sendMessage = useMutation({
    mutationFn: (payload: CreateMessageDto) => create(payload).then(res => res.data),
    onSuccess: (newMessage) => {
      const chatId = newMessage.chat.id;
      // Invalidation ciblée : On rafraîchit la liste des messages de ce chat
      queryClient.invalidateQueries({ queryKey: messageKeys.byChat(chatId) });
      // On met aussi à jour la sidebar (lastMessage)
      queryClient.invalidateQueries({ queryKey: chatKeys.all });
    },
  });

  // Modifier ou supprimer (soft delete) un message
  const updateMessage = useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateMessageDto }) => 
      update(id, dto).then(res => res.data),
    onSuccess: (updatedMsg) => {
      const chatId = updatedMsg.chat.id;
      
      // Mise à jour manuelle du cache pour une réactivité instantanée
      queryClient.setQueryData(messageKeys.byChat(chatId), (old: Message[] | undefined) => {
        return old?.map(m => m.id === updatedMsg.id ? updatedMsg : m);
      });

      // Invalidation de sécurité
      queryClient.invalidateQueries({ queryKey: messageKeys.byChat(chatId) });
    },
  });

  return { sendMessage, updateMessage };
}