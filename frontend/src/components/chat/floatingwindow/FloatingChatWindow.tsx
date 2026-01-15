import { useState, useEffect, useRef, useCallback } from 'react';
import { Paper, Box, Divider, CircularProgress, Typography } from '@mui/material';
import type { Chat } from '@/types/chat';
import type { Message } from '@/types/message';
import { useChatSocket } from '@/hooks/useChatSocket';
import { useAuth } from '@/hooks/useAuth';
import { getById } from '@/api/chatService';
import { create } from '@/api/messagesService';
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
    const [loading, setLoading] = useState(true); // Initialisé à true pour le premier chargement
    const [sending, setSending] = useState(false); // État spécifique pour l'envoi
    const scrollRef = useRef<HTMLDivElement>(null);

    // Chargement initial du chat
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

    // Gestion des Sockets
    useEffect(() => {
        if (chatId && socket) {
            joinChat(chatId);
            
            socket.on('newMessage', (newMsg: Message) => {
                if (newMsg.chat.id === chatId) {
                    setChat(prev => prev ? {
                        ...prev,
                        messages: [...(prev.messages || []), newMsg],
                        lastMessage: newMsg 
                    } : null);
                }
            });
        }

        return () => {
            if (chatId) {
                leaveChat(chatId);
                socket?.off('newMessage');
            }
        };
    }, [chatId, socket, joinChat, leaveChat]);

    // Scroll automatique
    useEffect(() => {
        if (!minimized && chat?.messages) {
            scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [chat?.messages, minimized]);

    // Envoi de message avec try/catch et loading
    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedMessage = message.trim();
        
        if (!trimmedMessage || !user?.id || sending) return;

        setSending(true);
        try {
            const payload = {
                chatId,
                content: trimmedMessage,
                senderId: user.id
            };

            // 1. Envoi API
            const response = await create(payload);
            const sendedMessage = response.data;

            socket?.emit('sendMessage', sendedMessage);

            setMessage('');
        } catch (error) {
            logger.error("Erreur lors de l'envoi du message:", error);
        } finally {
            setSending(false);
        }
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
                width: 360,
                position: 'fixed',
                bottom: 20,
                right: 110,
                zIndex: 1300,
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                height: 450,
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
                        Aucun message. Dites bonjour !
                    </Typography>
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

            <Divider />
            
            <ChatInput
                variant="compact"
                message={message}
                setMessage={setMessage}
                handleSend={handleSend}
                disabled={sending} 
                placeholder="Écrire..."
            />
        </Paper>
    );
}