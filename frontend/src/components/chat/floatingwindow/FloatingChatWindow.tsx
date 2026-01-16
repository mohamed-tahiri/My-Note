import { useState, useEffect, useRef, useCallback } from 'react';
import { Paper, Box, Divider, CircularProgress, Typography, IconButton, alpha } from '@mui/material';
import type { Chat } from '@/types/chat';
import type { Message } from '@/types/message';
import { useChatSocket } from '@/hooks/useChatSocket';
import { useAuth } from '@/hooks/useAuth';
import { getById } from '@/api/chatService';
import { create, update } from '@/api/messagesService'; // Import de update
import { ChatMessage } from '../ChatMessage';
import MinimizedChat from './MinimizedChat';
import Header from './Header';  
import { ChatInput } from '../ChatInput';
import { logger } from '@/utils/logger';

interface FloatingChatProps {
  chatId: number;
  onClose: () => void;
}

export default function FloatingChatWindow({ chatId, onClose }: FloatingChatProps) {
    const { user } = useAuth();
    const { socket, joinChat, leaveChat } = useChatSocket();
    const [chat, setChat] = useState<Chat | null>(null);
    const [message, setMessage] = useState('');
    const [minimized, setMinimized] = useState(false);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    
    // Nouveaux états pour l'édition
    const [editingMessage, setEditingMessage] = useState<Message | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    const loadChat = useCallback(async () => {
        if (!chatId) return;
        try {
            setLoading(true);
            const res = await getById(chatId);
            setChat(res.data);
        } catch (error) {
            logger.error("Erreur lors du chargement de la discussion:", error);
        } finally {
            setLoading(false);
        }
    }, [chatId]);

    useEffect(() => {
        loadChat();
    }, [loadChat]);

    // Gestion des Sockets (Synchronisé avec ChatWindow)
    useEffect(() => {
        if (chatId && socket) {
            joinChat(chatId);
            
            const handleNewMessage = (newMsg: Message) => {
                if (newMsg.chat.id === chatId) {
                    setChat(prev => {
                        if (!prev) return null;
                        const isExisting = prev.messages.some(m => m.id === newMsg.id);
                        
                        if (isExisting) {
                            // UPDATE (Edition ou Suppression)
                            return {
                                ...prev,
                                messages: prev.messages.map(m => m.id === newMsg.id ? newMsg : m),
                                lastMessage: prev.lastMessage?.id === newMsg.id ? newMsg : prev.lastMessage
                            };
                        } else {
                            // NOUVEAU MESSAGE
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
    }, [chatId, socket, joinChat, leaveChat]);

    useEffect(() => {
        if (!minimized && chat?.messages) {
            scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [chat?.messages, minimized]);

    // Fonctions CRUD
    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedMessage = message.trim();
        if (!trimmedMessage || !user?.id || sending) return;

        setSending(true);
        try {
            if (editingMessage) {
                // UPDATE
                const res = await update(editingMessage.id, { content: trimmedMessage });
                socket?.emit('updateMessage', res.data);
                setEditingMessage(null);
            } else {
                // CREATE
                const payload = { chatId, content: trimmedMessage, senderId: user.id };
                const response = await create(payload);
                socket?.emit('sendMessage', response.data);
            }
            setMessage('');
        } catch (error) {
            logger.error("Erreur lors de l'envoi/maj du message:", error);
        } finally {
            setSending(false);
        }
    };

    const handleDeleteMessage = async (messageId: number) => {
        try {
            // Suppression logique via l'update
            await update(messageId, { isDeleted: true });
        } catch (err) {
            logger.error("Erreur suppression:", err);
        }
    };

    const handleEditClick = (msg: Message) => {
        setEditingMessage(msg);
        setMessage(msg.content);
    };

    const cancelEdit = () => {
        setEditingMessage(null);
        setMessage('');
    };

    if (loading && !chat) {
        return (
            <Paper sx={{ width: 360, height: 450, position: 'fixed', bottom: 20, right: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '16px', zIndex: 1300 }}>
                <CircularProgress size={30} />
            </Paper>
        );
    }

    if (!chat) return null;

    if (minimized) {
        return <MinimizedChat chat={chat} setMinimized={setMinimized} onClose={onClose} />;
    }

    return (
        <Paper
            elevation={6}
            sx={{
                width: { xs: '100vw', sm: 360 }, // Responsive width
                position: 'fixed',
                bottom: { xs: 0, sm: 20 },
                right: { xs: 0, sm: 110 },
                zIndex: 1300,
                borderRadius: { xs: 0, sm: '16px' },
                display: 'flex',
                flexDirection: 'column',
                height: { xs: '100%', sm: 450 },
                overflow: 'hidden',
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: '0px 8px 24px rgba(15, 23, 42, 0.15)'
            }}
        >
            <Header chat={chat} setMinimized={setMinimized} onClose={onClose} />
            
            <Box sx={{ flex: 1, overflowY: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 1, bgcolor: '#f8fafc' }}>
                {chat.messages?.length === 0 ? (
                    <Typography variant="caption" sx={{ textAlign: 'center', mt: 2, color: 'text.disabled' }}>
                        Aucun message.
                    </Typography>
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

            <Divider />

            {/* Barre d'édition spécifique pour la version flottante */}
            {editingMessage && (
                <Box sx={{ px: 2, py: 0.5, bgcolor: alpha('#2563eb', 0.05), display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 700 }}>Modifier le message...</Typography>
                    <IconButton size="small" onClick={cancelEdit} sx={{ fontSize: '0.65rem', p: 0 }}>Annuler</IconButton>
                </Box>
            )}
            
            <ChatInput
                variant="compact"
                message={message}
                setMessage={setMessage}
                handleSend={handleSend}
                disabled={sending} 
                placeholder={editingMessage ? "Modifier..." : "Écrire..."}
            />
        </Paper>
    );
}