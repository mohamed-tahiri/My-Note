import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Avatar, IconButton, Stack, CircularProgress, alpha } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { getById } from '@/api/chatService';
import { useAuth } from '@/hooks/useAuth';
import type { Chat } from '@/types/chat';
import type { Message } from '@/types/message';
import { useChatSocket } from '@/hooks/useChatSocket';
import { create, update } from '@/api/messagesService';
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
  const [editingMessage, setEditingMessage] = useState<Message | null>(null); 
  const scrollRef = useRef<HTMLDivElement>(null);

  // Chargement initial des données
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

  // Gestion du temps réel (Socket)
  useEffect(() => {
    if (id && socket) {
      const chatId = Number(id);
      joinChat(chatId);

      const handleNewMessage = (newMsg: Message) => {
        if (newMsg.chat.id === chatId) {
          setChat(prev => {
            if (!prev) return null;
            const isExisting = prev.messages.some(m => m.id === newMsg.id);
            if (isExisting) {
              return {
                ...prev,
                messages: prev.messages.map(m => m.id === newMsg.id ? newMsg : m),
                lastMessage: prev.lastMessage?.id === newMsg.id ? newMsg : prev.lastMessage
              };
            } else {
              return { 
                ...prev, 
                messages: [...(prev.messages || []), newMsg],
                lastMessage: newMsg 
              };
            }
          });
        }
      };

      socket.on('newMessage', handleNewMessage);
      
      return () => {
        leaveChat(chatId);
        socket.off('newMessage', handleNewMessage);
      };
    }
  }, [id, socket, joinChat, leaveChat]);

  // Scroll auto
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
      if (editingMessage) {
        const res = await update(editingMessage.id, { content });
        socket?.emit('updateMessage', res.data); 
        setEditingMessage(null);
      } else {
        const payload = { chatId: chat.id, content, senderId: user.id };
        const res = await create(payload);
        socket?.emit('sendMessage', res.data);
      }
      setNewMessage('');
    } catch (err) {
      logger.error("Échec de l'opération:", err);
    } finally {
      setSending(false);
    }
  };

  const handleDeleteMessage = async (messageId: number) => {
    try {
      await update(messageId, { isDeleted: true });
    } catch (err) {
      logger.error("Erreur suppression:", err);
    }
  };

  const handleEditClick = (message: Message) => {
    setEditingMessage(message);
    setNewMessage(message.content);
  };

  const cancelEdit = () => {
    setEditingMessage(null);
    setNewMessage('');
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
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: 'background.default', overflow: 'hidden' }}>
      
      <Box sx={{ 
        p: { xs: 1.5, sm: 2 }, 
        bgcolor: 'background.paper', 
        borderBottom: '1px solid', 
        borderColor: 'divider', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
      }}>
        <Stack direction="row" spacing={{ xs: 1.5, sm: 2 }} alignItems="center">
          <Avatar sx={{ 
            width: { xs: 36, sm: 40 }, 
            height: { xs: 36, sm: 40 }, 
            bgcolor: 'primary.main', 
            fontWeight: 800,
            fontSize: { xs: '0.85rem', sm: '1rem' }
          }}>
            {chat.name?.charAt(0) || chat.participants?.find(p => p.id !== user?.id)?.firstName?.charAt(0) || '?'}
          </Avatar>
          <Box>
            <Typography variant="body1" sx={{ fontWeight: 800, fontSize: { xs: '0.9rem', sm: '1rem' }, lineHeight: 1.2 }}>
              {chat.name || chat.participants?.find(p => p.id !== user?.id)?.firstName || "Discussion"}
            </Typography>
            <Typography variant="caption" color="success.main" sx={{ fontWeight: 700 }}>
              • En ligne
            </Typography>
          </Box>
        </Stack>
        <IconButton size="small" onClick={() => setInfoOpen(true)}>
          <MoreVertIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* MESSAGES ZONE */}
      <Box sx={{ 
        flex: 1, 
        overflowY: 'auto', 
        p: { xs: 1.5, sm: 3 }, 
        display: 'flex', 
        flexDirection: 'column', 
        gap: { xs: 1, sm: 1.5 },
        bgcolor: '#f8fafc' // Gris très clair pour détacher les messages
      }}>
        {chat.messages?.length === 0 ? (
          <Box sx={{ m: 'auto', textAlign: 'center', opacity: 0.5 }}>
            <Typography variant="body2" fontWeight={600}>Aucun message ici...</Typography>
          </Box>
        ) : (
          chat.messages?.map((msg: Message) => (
            <ChatMessage 
              key={msg.id} 
              message={msg} 
              isMe={msg.sender.id === Number(user?.id)}
              onDelete={handleDeleteMessage} 
              onEdit={handleEditClick}     
            />
          ))
        )}
        <div ref={scrollRef} />
      </Box>

      {/* INPUT ZONE AVEC MODE ÉDITION */}
      <Box sx={{ bgcolor: 'background.paper', borderTop: '1px solid', borderColor: 'divider' }}>
        {editingMessage && (
          <Box sx={{ 
            px: 2, 
            py: 0.8, 
            bgcolor: alpha('#2563eb', 0.05), 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            borderBottom: '1px solid',
            borderColor: alpha('#2563eb', 0.1)
          }}>
            <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 700 }}>
              Modification du message...
            </Typography>
            <IconButton size="small" onClick={cancelEdit} sx={{ color: 'text.secondary' }}>
              <Typography variant="caption" sx={{ fontWeight: 800, mr: 0.5 }}>ANNULER</Typography>
            </IconButton>
          </Box>
        )}
        <ChatInput
          message={newMessage}
          setMessage={setNewMessage}
          handleSend={handleSend}
          disabled={sending} 
          placeholder={editingMessage ? "Modifier..." : "Écrire un message..."}
        />
      </Box>
      
      <ChatInfoDrawer 
        open={infoOpen} 
        onClose={() => setInfoOpen(false)} 
        chat={chat} 
      />
    </Box>
  );
}