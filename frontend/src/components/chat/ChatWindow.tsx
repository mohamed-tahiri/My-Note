import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Box, Typography, Avatar, IconButton, InputBase, 
  Paper, Stack, CircularProgress, alpha 
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { getById } from '@/api/chatService';
import { useAuth } from '@/hooks/useAuth';
import type { Chat } from '@/types/chat';
import { logger } from '@/utils/logger';
import type { Message } from '@/types/message';

export default function ChatWindow() {
  const { id } = useParams();
  const { user } = useAuth();
  const [chat, setChat] = useState<Chat | null>(null);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Charger la discussion
  useEffect(() => {
    const fetchChat = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const res = await getById(Number(id));
        setChat(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchChat();
  }, [id]);

  // Auto-scroll vers le bas quand un message arrive
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat?.messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    // Ici vous appellerez votre API : await sendMessage(chat.id, newMessage)
    logger.warn("Envoi du message:", newMessage);
    setNewMessage('');
  };

  if (loading) return <Box sx={{ m: 'auto' }}><CircularProgress /></Box>;
  if (!chat) return null;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      
      {/* HEADER DE LA DISCUSSION */}
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

      {/* ZONE DES MESSAGES */}
      <Box sx={{ flex: 1, overflowY: 'auto', p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {chat.messages?.map((msg: Message) => {
          const isMe = msg.senderId === Number(user?.id);
          
          return (
            <Box 
              key={msg.id} 
              sx={{ 
                alignSelf: isMe ? 'flex-end' : 'flex-start',
                maxWidth: '70%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: isMe ? 'flex-end' : 'flex-start'
              }}
            >
              <Paper 
                elevation={0}
                sx={{ 
                  p: 1.5, 
                  px: 2,
                  borderRadius: isMe ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                  bgcolor: isMe ? 'primary.main' : 'white',
                  color: isMe ? 'white' : 'text.primary',
                  border: isMe ? 'none' : '1px solid',
                  borderColor: 'divider'
                }}
              >
                <Typography variant="body2">{msg.content}</Typography>
              </Paper>
              <Typography variant="caption" sx={{ mt: 0.5, color: 'text.disabled', fontSize: '0.65rem' }}>
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Typography>
            </Box>
          );
        })}
        <div ref={scrollRef} />
      </Box>

      {/* BARRE DE SAISIE */}
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