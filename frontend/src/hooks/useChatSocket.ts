import { useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './useAuth';
import { env } from '@/utils/env';
import { logger } from '@/utils/logger';

let socket: Socket;

export const useChatSocket = () => {const { user } = useAuth();

    useEffect(() => {
        if (!socket && user) {
            socket = io(env.apiSocket, { query: { userId: user.id } });

            socket.on('connect', () => {
                logger.info('Connected to socket server');
            });
        }
    }, [user]);
    
    const joinChat = useCallback((chatId: number) => {
        if (socket?.connected) {
            socket.emit('joinChat', chatId);
        } else {
            socket?.once('connect', () => socket.emit('joinChat', chatId));
        }
    }, []);

    const leaveChat = useCallback((chatId: number) => {
        socket?.emit('leaveChat', chatId);
    }, []);

    return { socket, joinChat, leaveChat };
};