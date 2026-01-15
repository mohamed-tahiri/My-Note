import React, { useCallback, useEffect, useState } from 'react';
import { Box, Menu, Typography, List, Divider, CircularProgress } from '@mui/material';
import { useAuth } from '@/hooks/useAuth';
import type { Chat } from '@/types/chat';
import { getChatsByUser } from '@/api/chatService';
import FloatingChatWindow from '../floatingwindow/FloatingChatWindow';
import { useChatSocket } from '@/hooks/useChatSocket';
import type { Message } from '@/types/message';
import Icon from './Icon';
import Header from './Header';
import { ChatItem } from '../ChatItem';
import { logger } from '@/utils/logger';

export default function ChatsDropdown() {
  const { socket } = useChatSocket();
  const { user } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openChatId, setOpenChatId] = useState<number | null>(null);
  
  const open = Boolean(anchorEl);

  const loadChats = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
        const res = await getChatsByUser(Number(user.id));
        const sortedChats = res.data.sort((a: Chat, b: Chat) => 
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
        setChats(sortedChats);
    } catch (error) {
      logger.error("Erreur chargement chats", error);
    } finally {
        setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (open) {
      loadChats();
    }
  }, [open, loadChats]);

  useEffect(() => {
    if (!socket) return;
    
    socket.on('newMessage', (newMsg: Message) => {
      setChats(prev => {
        const updated = prev.map(c => 
          c.id === newMsg.chatId ? { ...c, messages: [...(c.messages || []), newMsg], updatedAt: new Date().toISOString() } : c
        );
        return updated.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      });
    });

    return () => { socket.off('newMessage'); };
  }, [socket]);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const unreadCount = chats.length; 

  return (
    <>
      <Box>
        <Icon
          handleOpen={handleOpen} 
          unreadCount={unreadCount} 
        />
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
              borderColor: 'divider'
            }
          }}
        >
          
          <Header handleClose={handleClose} />
          <Divider />

          <List sx={{ p: 0 }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress size={24} />
              </Box>
            ) : chats.length === 0 ? (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Aucune conversation
                </Typography>
              </Box>
            ) : (
              chats.map((chat) => (
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
              ))
            )}
          </List>
        </Menu>
      </Box>
      {openChatId && (
        <FloatingChatWindow
          chatId={openChatId} 
          onClose={() => setOpenChatId(null)} 
        />
      )}
    </>
  );
}