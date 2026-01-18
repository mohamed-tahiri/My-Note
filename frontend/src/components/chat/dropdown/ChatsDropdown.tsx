import React, { useState, useEffect, useMemo } from 'react';
import { Box, Menu, List, Divider } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/hooks/useAuth';
import { useChats, chatKeys } from '@/hooks/queries/useChatQueries';
import { useChatSocket } from '@/hooks/useChatSocket';
import FloatingChatWindow from '../floatingwindow/FloatingChatWindow';
import { AsyncWrapper } from '@/components/ui/AsyncWrapper';
import { ChatItem } from '../ChatItem';
import Icon from './Icon';
import Header from './Header';

import type { Chat } from '@/types/chat';
import type { Message } from '@/types/message';

export default function ChatsDropdown() {
    const { user } = useAuth();
    const { socket } = useChatSocket();
    const queryClient = useQueryClient();

    // UI States
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [openChatId, setOpenChatId] = useState<number | null>(null);
    const open = Boolean(anchorEl);

    // 1. TanStack Query : Récupération des conversations
    // On utilise le hook centralisé. Les données sont triées par updatedAt via useMemo pour la performance.
    const { data: chatsData, isLoading, error } = useChats(Number(user?.id));

    const sortedChats = useMemo(() => {
        if (!chatsData) return [];
        return [...chatsData].sort(
            (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
    }, [chatsData]);

    // 2. Temps réel : Synchronisation du cache global
    useEffect(() => {
        if (!socket || !user?.id) return;

        const handleNewMessage = (newMsg: Message) => {
            queryClient.setQueryData(chatKeys.user(Number(user.id)), (old: Chat[] | undefined) => {
                if (!old) return [];
                return old.map((c) =>
                    c.id === newMsg.chat.id
                        ? { ...c, updatedAt: new Date().toISOString(), lastMessage: newMsg }
                        : c
                );
            });
        };

        socket.on('newMessage', handleNewMessage);
        return () => {
            socket.off('newMessage');
        };
    }, [socket, user?.id, queryClient]);

    const handleOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    return (
        <>
            <Box>
                <Icon handleOpen={handleOpen} unreadCount={sortedChats.length} />
                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    PaperProps={{
                        sx: {
                            mt: 1.5,
                            width: 360,
                            maxHeight: 480,
                            borderRadius: '12px',
                            boxShadow: '0px 10px 25px rgba(15, 23, 42, 0.15)',
                            overflowY: 'auto',
                            border: '1px solid',
                            borderColor: 'divider',
                        },
                    }}
                >
                    <Header handleClose={handleClose} />
                    <Divider />

                    <AsyncWrapper
                        loading={isLoading}
                        error={error}
                        isEmpty={sortedChats.length === 0}
                        emptyMessage="Aucune conversation"
                    >
                        <List sx={{ p: 0 }}>
                            {sortedChats.map((chat) => (
                                <React.Fragment key={chat.id}>
                                    <ChatItem
                                        chat={chat}
                                        currentUserId={Number(user?.id)}
                                        variant="dropdown"
                                        onClick={() => {
                                            setOpenChatId(chat.id);
                                            handleClose();
                                        }}
                                    />
                                    <Divider component="li" sx={{ mx: 2, opacity: 0.5 }} />
                                </React.Fragment>
                            ))}
                        </List>
                    </AsyncWrapper>
                </Menu>
            </Box>

            {openChatId && (
                <FloatingChatWindow chatId={openChatId} onClose={() => setOpenChatId(null)} />
            )}
        </>
    );
}
