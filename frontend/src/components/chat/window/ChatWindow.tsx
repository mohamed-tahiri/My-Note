import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Avatar, IconButton, Stack, CircularProgress } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { getById } from '@/api/chatService';
import { useAuth } from '@/hooks/useAuth';
import type { Chat } from '@/types/chat';
import type { Message } from '@/types/message';
import { useChatSocket } from '@/hooks/useChatSocket';
import { create } from '@/api/messagesService';
import { ChatMessage } from '../ChatMessage';
import { ChatInput } from '../ChatInput';
import { logger } from '@/utils/logger';
import { ChatInfoDrawer } from './ChatInfoDrawer';

export default function ChatWindow() {
  const { id } = useParams();
  const { user } = useAuth();
  const { socket, joinChat, leaveChat } = useChatSocket();
  const [chat, setChat] = useState<Chat | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [infoOpen, setInfoOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const loadChat = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await getById(Number(id));
      setChat(res.data);
    } catch (err) {
      logger.error("Erreur lors de la récupération du chat:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadChat();
  }, [loadChat]);

  useEffect(() => {
    if (id && socket) {
      const chatId = Number(id);
      joinChat(chatId);

      const handleNewMessage = (newMsg: Message) => {
        if (newMsg.chat.id === chatId) {
          setChat(prev => prev ? { 
            ...prev, 
            messages: [...(prev.messages || []), newMsg],
            lastMessage: newMsg 
          } : null);
        }
      };

      socket.on('newMessage', handleNewMessage);
      
      return () => {
        leaveChat(chatId);
        socket.off('newMessage', handleNewMessage);
      };
    }
  }, [id, socket, joinChat, leaveChat]);

  useEffect(() => {
    if (chat?.messages) {
      scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chat?.messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const content = newMessage.trim();
    
    if (!content || !user?.id || !chat || sending) return;

    setSending(true);
    try {
      const payload = {
        chatId: chat.id,
        content: content,
        senderId: user.id
      };

      const res = await create(payload);
      const sendedMessage = res.data;

      socket?.emit('sendMessage', sendedMessage);
            
      setNewMessage('');
    } catch (err) {
      logger.error("Échec de l'envoi du message:", err);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!chat) return (
    <Box sx={{ p: 3, textAlign: 'center' }}>
      <Typography color="text.secondary">Conversation introuvable</Typography>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: 'background.default' }}>
      
      {/* HEADER */}
      <Box sx={{ p: 2, bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar sx={{ bgcolor: 'primary.main', fontWeight: 700 }}>
            {chat.name?.charAt(0) || chat.participants?.find(p => p.id !== user?.id)?.firstName?.charAt(0) || '?'}
          </Avatar>
          <Box>
            <Typography variant="body1" fontWeight={800}>
              {chat.name || chat.participants?.find(p => p.id !== user?.id)?.firstName || "Discussion"}
            </Typography>
            <Typography variant="caption" color="success.main" fontWeight={700}>Connecté</Typography>
          </Box>
        </Stack>
        <IconButton size="small" onClick={() => setInfoOpen(true)}>
          <MoreVertIcon />
        </IconButton>
      </Box>

      <Box sx={{ flex: 1, overflowY: 'auto', p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {chat.messages?.length === 0 ? (
          <Box sx={{ m: 'auto', textAlign: 'center', opacity: 0.5 }}>
            <Typography variant="body2">Début de la conversation</Typography>
          </Box>
        ) : (
          chat.messages?.map((msg: Message) => (
            <ChatMessage 
              key={msg.id} 
              message={msg} 
              isMe={msg.sender.id === Number(user?.id)} 
            />
          ))
        )}
        <div ref={scrollRef} />
      </Box>

      <ChatInput
        message={newMessage}
        setMessage={setNewMessage}
        handleSend={handleSend}
        disabled={sending} 
      />
      
      <ChatInfoDrawer 
        open={infoOpen} 
        onClose={() => setInfoOpen(false)} 
        chat={chat} 
      />
    </Box>
  );
}