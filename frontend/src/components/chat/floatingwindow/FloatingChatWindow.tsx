import { useState, useRef, useEffect } from 'react';
import { Paper, Box, Typography } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/hooks/useAuth';
import { useChatSocket } from '@/hooks/useChatSocket';
import { useChatDetail } from '@/hooks/queries/useChatQueries';
import { useMessages, useMessageMutations, messageKeys } from '@/hooks/queries/useMessageQueries';

import { ChatMessage } from '../ChatMessage';
import { ChatInput } from '../ChatInput';
import MinimizedChat from './MinimizedChat';
import Header from './Header';
import { AsyncWrapper } from '@/components/ui/AsyncWrapper';

import type { Message } from '@/types/message';
import type { FloatingChatProps } from '@/types/props';

export default function FloatingChatWindow({ chatId, onClose }: FloatingChatProps) {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const { socket, joinChat, leaveChat } = useChatSocket();
    
    const { data: chat, isLoading: chatLoading } = useChatDetail(chatId);
    const { data: messages, isLoading: messagesLoading } = useMessages(chatId);
    const { sendMessage, updateMessage } = useMessageMutations();

    const [messageText, setMessageText] = useState('');
    const [minimized, setMinimized] = useState(false);
    const [editingMessage, setEditingMessage] = useState<Message | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Sync Sockets
    useEffect(() => {
        if (chatId && socket) {
            joinChat(chatId);
            const handleNewMessage = (newMsg: Message) => {
                if (newMsg.chat.id === chatId) {
                    queryClient.setQueryData(messageKeys.byChat(chatId), (old: Message[] | undefined) => {
                        const exists = old?.some(m => m.id === newMsg.id);
                        if (exists) return old?.map(m => m.id === newMsg.id ? newMsg : m);
                        return [...(old || []), newMsg];
                    });
                }
            };
            socket.on('newMessage', handleNewMessage);
            return () => {
                leaveChat(chatId);
                socket.off('newMessage', handleNewMessage);
            };
        }
    }, [chatId, socket, queryClient, joinChat, leaveChat]);

    useEffect(() => {
        if (!minimized && messages) {
            scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, minimized]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        const content = messageText.trim();
        if (!content || !user?.id) return;

        if (editingMessage) {
            updateMessage.mutate({ id: editingMessage.id, dto: { content } }, {
                onSuccess: (res) => {
                    socket?.emit('updateMessage', res);
                    setEditingMessage(null);
                    setMessageText('');
                }
            });
        } else {
            sendMessage.mutate({ chatId, content, senderId: user.id }, {
                onSuccess: (res) => {
                    socket?.emit('sendMessage', res);
                    setMessageText('');
                }
            });
        }
    };

    const cancelEdit = () => {
        setEditingMessage(null);
        setMessageText('');
    };

    if (minimized && chat) {
        return <MinimizedChat chat={chat} setMinimized={setMinimized} onClose={onClose} />;
    }

    return (
        <Paper
            elevation={6}
            sx={{
                width: { xs: '100vw', sm: 360 },
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
            }}
        >
            <AsyncWrapper loading={chatLoading || messagesLoading} error={null}>
                {chat && (
                    <> 
                        <Header chat={chat} setMinimized={setMinimized} onClose={onClose} />
                        
                        <Box sx={{ 
                            flex: 1,
                            overflowY: 'auto', 
                            p: 2, 
                            display: 'flex', 
                            flexDirection: 'column', 
                            gap: 1, 
                            bgcolor: '#f8fafc' 
                        }}>
                            {messages?.length === 0 ? (
                                <Typography variant="caption" sx={{ textAlign: 'center', mt: 2, color: 'text.disabled' }}>
                                    Aucun message.
                                </Typography>
                            ) : (
                                messages?.map((msg: Message) => (
                                    <ChatMessage
                                        key={msg.id} 
                                        message={msg} 
                                        isMe={msg.sender.id === Number(user?.id)}
                                        onDelete={(id) => updateMessage.mutate({ id, dto: { isDeleted: true } })}
                                        onEdit={(m) => { setEditingMessage(m); setMessageText(m.content); }}
                                    />   
                                ))
                            )}
                            <div ref={scrollRef} />
                        </Box>

                        <ChatInput
                            variant="compact"
                            message={messageText}
                            setMessage={setMessageText}
                            handleSend={handleSend}
                            cancelEdit={cancelEdit}
                            editingMessage={editingMessage}
                            disabled={sendMessage.isPending || updateMessage.isPending} 
                            placeholder={editingMessage ? "Modifier..." : "Écrire..."}
                        />
                    </>
                )}
            </AsyncWrapper>
        </Paper>
    );
}