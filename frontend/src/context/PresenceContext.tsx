// src/context/PresenceContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '@/hooks/useAuth';
import { env } from '@/utils/env';

const PresenceContext = createContext<{ onlineUsers: Set<number> }>({ onlineUsers: new Set() });

export const PresenceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [onlineUsers, setOnlineUsers] = useState<Set<number>>(new Set());

    useEffect(() => {
        if (!user?.id) return;

        const socket: Socket = io(`${env.apiSocket}/presence`, {
            query: { userId: user.id },
            transports: ['websocket'],
        });

        socket.on('USER_ONLINE', (userId: number) => {
            setOnlineUsers(prev => new Set(prev).add(userId));
        });

        socket.on('USER_OFFLINE', (userId: number) => {
            setOnlineUsers(prev => {
                const next = new Set(prev);
                next.delete(userId);
                return next;
            });
        });

        socket.on('SYNC_PRESENCE', (userIds: number[]) => {
            setOnlineUsers(new Set(userIds));
        });

        return () => { socket.disconnect(); };
    }, [user?.id]);

    return (
        <PresenceContext.Provider value={{ onlineUsers }}>
            {children}
        </PresenceContext.Provider>
    );
};

export const usePresence = () => useContext(PresenceContext);