import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/hooks/useAuth';
import { useChatSocket } from '@/hooks/useChatSocket';
import { useChatDetail } from '@/hooks/queries/useChatQueries';
import { useMessages, useMessageMutations, messageKeys } from '@/hooks/queries/useMessageQueries';

import { ChatMessage } from '../ChatMessage';
import { ChatInput } from '../ChatInput';
import { ChatInfoDrawer } from './ChatInfoDrawer';
import { AsyncWrapper } from '@/components/ui/AsyncWrapper';
import type { Message } from '@/types/message';
import Header from './Header';

export default function ChatWindow() {
  const { id } = useParams();
  const chatId = Number(id);
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { socket, joinChat, leaveChat } = useChatSocket();

  // 1. DATA FETCHING (TanStack Query)
  const { data: chat, isLoading: chatLoading, error: chatError } = useChatDetail(chatId);
  const { data: messages, isLoading: messagesLoading } = useMessages(chatId);
  
  // 2. MUTATIONS
  const { sendMessage, updateMessage } = useMessageMutations();

  // 3. UI STATES
  const [newMessageText, setNewMessageText] = useState('');
  const [infoOpen, setInfoOpen] = useState(false);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null); 
  const scrollRef = useRef<HTMLDivElement>(null);

  // 4. TEMPS RÉEL (Socket + Sync Cache global)
  useEffect(() => {
    if (chatId && socket) {
      joinChat(chatId);

      const handleNewMessage = (newMsg: Message) => {
        if (newMsg.chat.id === chatId) {
          // Mise à jour du cache des messages pour ce chat spécifique
          queryClient.setQueryData(messageKeys.byChat(chatId), (old: Message[] | undefined) => {
            const exists = old?.some(m => m.id === newMsg.id);
            if (exists) {
              return old?.map(m => m.id === newMsg.id ? newMsg : m);
            }
            return [...(old || []), newMsg];
          });
          
          // Optionnel : Invalider la liste des chats pour mettre à jour le "lastMessage" dans la sidebar
          queryClient.invalidateQueries({ queryKey: ['chats'] });
        }
      };

      socket.on('newMessage', handleNewMessage);
      
      return () => {
        leaveChat(chatId);
        socket.off('newMessage', handleNewMessage);
      };
    }
  }, [chatId, socket, joinChat, leaveChat, queryClient]);

  // Scroll automatique
  useEffect(() => {
    if (messages) {
      scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // 5. HANDLERS
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const content = newMessageText.trim();
    if (!content || !user?.id || !chat) return;

    if (editingMessage) {
      updateMessage.mutate({ id: editingMessage.id, dto: { content } }, {
        onSuccess: (updatedData) => {
          socket?.emit('updateMessage', updatedData); 
          setEditingMessage(null);
          setNewMessageText('');
        }
      });
    } else {
      sendMessage.mutate({ chatId: chat.id, content, senderId: user.id }, {
        onSuccess: (sentData) => {
          socket?.emit('sendMessage', sentData);
          setNewMessageText('');
        }
      });
    }
  };

  const handleEditClick = (message: Message) => {
    setEditingMessage(message);
    setNewMessageText(message.content);
  };

  const cancelEdit = () => {
    setEditingMessage(null);
    setNewMessageText('');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: 'background.default', overflow: 'hidden' }}>
      
      <AsyncWrapper loading={chatLoading || messagesLoading} error={chatError}>
        {chat && (
          <>
            {/* HEADER */}
            <Header chat={chat} user={user} setInfoOpen={setInfoOpen} />

            {/* MESSAGES ZONE */}
            <Box sx={{ flex: 1, overflowY: 'auto', p: 3, display: 'flex', flexDirection: 'column', gap: 1.5, bgcolor: '#f8fafc' }}>
              {messages?.length === 0 ? (
                <Box sx={{ m: 'auto', opacity: 0.5 }}>Aucun message ici...</Box>
              ) : (
                messages?.map((msg: Message) => (
                  <ChatMessage 
                    key={msg.id} 
                    message={msg} 
                    isMe={msg.sender.id === Number(user?.id)}
                    onDelete={(id) => updateMessage.mutate({ id, dto: { isDeleted: true } })} 
                    onEdit={handleEditClick}     
                  />
                ))
              )}
              <div ref={scrollRef} />
            </Box>

            {/* INPUT ZONE */}
            <ChatInput
              message={newMessageText}
              setMessage={setNewMessageText}
              handleSend={handleSend}
              cancelEdit={cancelEdit}
              editingMessage={editingMessage}
              disabled={sendMessage.isPending || updateMessage.isPending} 
              placeholder={editingMessage ? "Modifier..." : "Écrire..."}
            />
            
            <ChatInfoDrawer open={infoOpen} onClose={() => setInfoOpen(false)} chat={chat} />
          </>
        )}
      </AsyncWrapper>
    </Box>
  );
}