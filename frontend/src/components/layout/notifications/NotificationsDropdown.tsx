import React, { useState, useEffect, useCallback } from 'react';
import { Socket } from 'socket.io-client';
import type { Notification } from '@/types/notification';
import { getByUserId, markAsRead } from '@/api/notificationsService';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { 
  Box, IconButton, Badge, Menu, Typography, 
  List, ListItem, ListItemText, Divider, CircularProgress 
} from '@mui/material';
import { logger } from '@/utils/logger';

interface NotificationsDropdownProps {
  socket: Socket;
  userId: string | number;
}

const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({ socket, userId }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const loadNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getByUserId(Number(userId));
      setNotifications(res.data);
    } catch (err) {
      logger.error('Erreur lors du chargement des notifications:', err);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadNotifications();

    const handleNewNotif = (notif: Notification) => {
      setNotifications(prev => [notif, ...prev]);
    };

    socket.on('notification', handleNewNotif);
    return () => {
      socket.off('notification', handleNewNotif);
    };
  }, [loadNotifications, socket]);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const markAsReadNoti = async (id: number) => {
    try {
      await markAsRead(id);
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      logger.error('Erreur lors du marquage comme lu:', err);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Box>
      <IconButton 
        onClick={handleOpen} 
        size="large"
        sx={{ color: 'primary.main' }}
      >
        <Badge 
          badgeContent={unreadCount} 
          color="success" // Utilise le vert #10B981 de votre thème
          sx={{ '& .MuiBadge-badge': { fontWeight: 700, fontSize: '0.65rem' } }}
        >
          <NotificationsIcon />
        </Badge>
      </IconButton>

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
            boxShadow: '0px 10px 25px rgba(0,0,0,0.1)',
            overflowY: 'auto'
          }
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1" fontWeight={700} color="primary.main">
            Notifications
          </Typography>
        </Box>
        
        <Divider />

        <List sx={{ p: 0 }}>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress size={24} />
            </Box>
          ) : notifications.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Aucune notification
              </Typography>
            </Box>
          ) : (
            notifications.map((notif) => (
              <ListItem
                key={notif.id}
                onClick={() => !notif.read && markAsReadNoti(notif.id)}
                sx={{
                  cursor: 'pointer',
                  borderLeft: !notif.read ? '4px solid' : 'none',
                  borderColor: 'success.main',
                  bgcolor: !notif.read ? 'success.light' : 'transparent',
                  '&:hover': { bgcolor: !notif.read ? 'success.light' : 'action.hover' },
                  transition: 'all 0.2s',
                  py: 1.5
                }}
              >
                <ListItemText
                  primary={notif.content}
                  secondary={new Date(notif.createdAt).toLocaleString()}
                  primaryTypographyProps={{
                    variant: 'body2',
                    fontWeight: !notif.read ? 700 : 400,
                    color: !notif.read ? 'primary.main' : 'text.primary',
                  }}
                  secondaryTypographyProps={{
                    variant: 'caption',
                    sx: { mt: 0.5, display: 'block', textTransform: 'uppercase' }
                  }}
                />
              </ListItem>
            ))
          )}
        </List>
      </Menu>
    </Box>
  );
};

export default NotificationsDropdown;