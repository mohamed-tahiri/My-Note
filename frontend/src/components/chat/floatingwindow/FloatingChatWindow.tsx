import { useState, useEffect, useRef } from 'react';
import { Paper, Box, Divider } from '@mui/material';
import type { Chat } from '@/types/chat';
import type { Message } from '@/types/message';
import { useChatSocket } from '@/hooks/useChatSocket';
import { useAuth } from '@/hooks/useAuth';
import { getById } from '@/api/chatService';
import { create } from '@/api/messagesService';
import { ChatMessage } from '../ChatMessage';
import MinimizedChat from './MinimizedChat';
import Header from './Header';
import InputMessage from './InputMessage';

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
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const loadChat = async () => {
            const res = await getById(chatId);
            setChat(res.data);
        };
        loadChat();
    }, [chatId]);

    useEffect(() => {
        if (chatId) {
            joinChat(chatId);
            
            socket?.on('newMessage', (newMsg: Message) => {
                if (newMsg.chatId === chatId) {
                    setChat(prev => prev ? {
                        ...prev,
                        messages: [...(prev.messages || []), newMsg]
                    } : null);
                }
            });
        }

        return () => {
            leaveChat(chatId);
            socket?.off('newMessage');
        };
    }, [chatId, socket, joinChat, leaveChat]);

    useEffect(() => {
        if (!minimized) {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [chat?.messages, minimized]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;
        if (!user?.id) return; 

        const payload = {
            chatId,
            content: message,
            senderId: user.id
        };

        const sendedMessage = await create(payload);

        socket?.emit('sendMessage', sendedMessage);
        setMessage('');
    };

    if (!chat) return null;

    if (minimized) {
        return (
            <MinimizedChat chat={chat} setMinimized={setMinimized} onClose={onClose} />
        );
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
                {chat.messages?.map((msg: Message) => (
                    <ChatMessage
                        key={msg.id} 
                        message={msg} 
                        isMe={msg.sender.id === Number(user?.id)} 
                    />   
                ))}
                <div ref={scrollRef} />
            </Box>
            <Divider />
            <InputMessage
                message={message}
                setMessage={setMessage}
                handleSend={handleSend}
            />
            
        </Paper>
    );
}