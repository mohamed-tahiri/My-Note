import React, { useCallback, useEffect, useState } from 'react';
import { 
  Box, IconButton, Badge, Menu, Typography, 
  List, ListItem, ListItemAvatar, Avatar, ListItemText, 
  Divider, Tooltip, CircularProgress, alpha
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import type { Chat } from '@/types/chat';
import { getChatsByUser } from '@/api/chatService';
import type { User } from '@/types/user';
import FloatingChatWindow from './FloatingChatWindow';

export default function ChatsDropdown() {
  const navigate = useNavigate();
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
        // On trie pour mettre les plus récents en haut
        const sortedChats = res.data.sort((a: Chat, b: Chat) => 
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
        setChats(sortedChats);
    } catch (error) {
        console.error("Erreur chargement chats", error);
    } finally {
        setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (open) {
      loadChats();
    }
  }, [open, loadChats]);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // On considère un chat comme "non lu" s'il y a des messages (à affiner avec votre logique unread backend)
  const unreadCount = chats.length; 

  return (
    <>
      <Box>
        <Tooltip title="Messages">
          <IconButton 
            onClick={handleOpen} 
            size="large" 
            sx={{ color: 'primary.main' }}
          >
            <Badge 
              badgeContent={unreadCount} 
              color="error"
              sx={{ '& .MuiBadge-badge': { fontWeight: 700, fontSize: '0.65rem' } }}
            >
              <ChatIcon />
            </Badge>
          </IconButton>
        </Tooltip>

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
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle1" fontWeight={800} color="primary.main">
              Messages récents
            </Typography>
            
            <Tooltip title="Voir toutes les conversations">
              <IconButton 
                size="small" 
                onClick={() => {
                  navigate('/chats');
                  handleClose(); // Ferme le menu dropdown
                }}
                sx={{ 
                  color: 'primary.main',
                  bgcolor: alpha('#2563eb', 0.05),
                  '&:hover': { bgcolor: alpha('#2563eb', 0.1) }
                }}
              >
                <OpenInNewIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
          </Box>
          
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
              chats.map((chat) => {
                const isGroup = chat.type === 'task_group';
                const displayName = chat.name || 
                    chat.participants.find((p: User) => p.id !== user?.id)?.firstName || "Discussion";
                const lastMsg = chat.messages?.[chat.messages.length - 1];

                return (
                  <React.Fragment key={chat.id}>
                    <ListItem
                      onClick={() => {
                        setOpenChatId(chat.id);
                        handleClose();
                      }}
                      sx={{
                        cursor: 'pointer',
                        py: 1.5,
                        px: 2,
                        transition: 'all 0.2s',
                        '&:hover': { bgcolor: alpha('#F1F5F9', 0.8) },
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar 
                          sx={{ 
                            bgcolor: isGroup ? 'secondary.main' : 'primary.light',
                            width: 42,
                            height: 42
                          }}
                        >
                          {isGroup ? <GroupIcon /> : <PersonIcon />}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={displayName}
                        secondary={lastMsg?.content || "Démarrer une conversation..."}
                        primaryTypographyProps={{
                          variant: 'body2',
                          fontWeight: 700,
                          color: 'text.primary',
                          noWrap: true
                        }}
                        secondaryTypographyProps={{
                          variant: 'caption',
                          color: 'text.secondary',
                          noWrap: true,
                          sx: { mt: 0.3, display: 'block' }
                        }}
                      />
                      <Box sx={{ ml: 1, textAlign: 'right', minWidth: 60 }}>
                        <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.7rem', fontWeight: 600 }}>
                          {lastMsg ? new Date(lastMsg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        </Typography>
                      </Box>
                    </ListItem>
                    <Divider component="li" sx={{ mx: 2, opacity: 0.5 }} />
                  </React.Fragment>
                );
              })
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