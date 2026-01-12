import { useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './useAuth';
import { env } from '@/utils/env';

let socket: Socket;

export const useChatSocket = () => {
    const { user } = useAuth();

    useEffect(() => {
        if (!socket && user) {
        socket = io(env.apiSocket, {
            query: { userId: user.id }
        });
        }

        return () => {
        // On garde le socket actif tant que l'utilisateur est connecté
        };
    }, [user]);

    const joinChat = useCallback((chatId: number) => {
        socket?.emit('joinChat', chatId);
    }, []);

    const leaveChat = useCallback((chatId: number) => {
        socket?.emit('leaveChat', chatId);
    }, []);

    return { socket, joinChat, leaveChat };
};