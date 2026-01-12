import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Box, Typography, Avatar, IconButton, InputBase, Stack, CircularProgress, alpha 
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { getById } from '@/api/chatService';
import { useAuth } from '@/hooks/useAuth';
import type { Chat } from '@/types/chat';
import type { Message } from '@/types/message';
import { useChatSocket } from '@/hooks/useChatSocket';
import { logger } from '@/utils/logger';
import { create } from '@/api/messagesService';
import { ChatMessage } from '../ChatMessage';

export default function ChatWindow() {
  const { id } = useParams();
  const { user } = useAuth();
  const { socket, joinChat, leaveChat } = useChatSocket();
  const [chat, setChat] = useState<Chat | null>(null);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchChat = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await getById(Number(id));
      logger.info(res.data);
      setChat(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchChat();
  }, [fetchChat]);

  useEffect(() => {
    if (id) {
      const chatId = Number(id);
      joinChat(chatId);
      socket?.on('newMessage', (newMsg: Message) => {
        if (newMsg.chatId === chatId) {
          setChat(prev => prev ? { ...prev, messages: [...(prev.messages || []), newMsg] } : null);
        }
      });
    }
    return () => {
        if (id) leaveChat(Number(id));
        socket?.off('newMessage');
    };
  }, [id, socket, joinChat, leaveChat]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat?.messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user?.id) return;
    if (!chat) return;
    const payload = {
      chatId: chat.id,
      content: newMessage,
      senderId: user.id
    };

    const sendedMessage = await create(payload);

    socket?.emit('sendMessage', sendedMessage);
    setNewMessage('');
  };

  if (loading) return <Box sx={{ m: 'auto' }}><CircularProgress /></Box>;
  if (!chat) return null;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      
      <Box sx={{ p: 2, bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar sx={{ bgcolor: 'primary.main' }}>{chat.name?.charAt(0) || '?'}</Avatar>
          <Box>
            <Typography variant="body1" fontWeight={800}>{chat.name || "Discussion"}</Typography>
            <Typography variant="caption" color="success.main" fontWeight={700}>En ligne</Typography>
          </Box>
        </Stack>
        <IconButton size="small"><MoreVertIcon /></IconButton>
      </Box>

      <Box sx={{ flex: 1, overflowY: 'auto', p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {chat.messages?.map((msg: Message) => (
          <ChatMessage 
            key={msg.id} 
            message={msg} 
            isMe={msg.sender.id === Number(user?.id)} 
          />
        ))}
        <div ref={scrollRef} />
      </Box>

      <Box component="form" onSubmit={handleSend} sx={{ p: 2, bgcolor: 'background.paper', borderTop: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          bgcolor: alpha('#64748b', 0.05), 
          borderRadius: '24px', 
          px: 2, py: 1 
        }}>
          <InputBase 
            fullWidth 
            placeholder="Écrivez votre message..." 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            sx={{ ml: 1, flex: 1, fontSize: '0.9rem' }} 
          />
          <IconButton type="submit" color="primary" disabled={!newMessage.trim()}>
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}