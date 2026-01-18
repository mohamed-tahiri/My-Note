import React, { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import NotificationsIcon from '@mui/icons-material/Notifications';
import {
    Box,
    IconButton,
    Badge,
    Menu,
    Typography,
    List,
    ListItem,
    ListItemText,
    Divider,
} from '@mui/material';

import {
    useNotifications,
    useNotificationMutations,
    notificationKeys,
} from '@/hooks/queries/useNotificationQueries';
import { AsyncWrapper } from '@/components/ui/AsyncWrapper';
import type { Notification } from '@/types/notification';
import type { NotificationsDropdownProps } from '@/types/props';

const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({ socket, userId }) => {
    const queryClient = useQueryClient();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    // 1. DATA FETCHING
    const { data: notifications = [], isLoading, error } = useNotifications(Number(userId));

    // 2. MUTATIONS
    const { markReadMutation } = useNotificationMutations(Number(userId));

    // 3. SOCKETS : Injection directe dans le cache TanStack
    useEffect(() => {
        if (!socket || !userId) return;

        const handleNewNotif = (notif: Notification) => {
            queryClient.setQueryData(
                notificationKeys.user(Number(userId)),
                (old: Notification[] | undefined) => {
                    return [notif, ...(old || [])];
                }
            );
        };

        socket.on('notification', handleNewNotif);
        return () => {
            socket.off('notification', handleNewNotif);
        };
    }, [socket, userId, queryClient]);

    const handleOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const unreadCount = notifications.filter((n) => !n.read).length;

    return (
        <Box>
            <IconButton onClick={handleOpen} size="large" sx={{ color: 'primary.main' }}>
                <Badge
                    badgeContent={unreadCount}
                    color="success"
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
                        overflowY: 'auto',
                        border: '1px solid',
                        borderColor: 'divider',
                    },
                }}
            >
                <Box sx={{ p: 2 }}>
                    <Typography variant="subtitle1" fontWeight={700} color="primary.main">
                        Notifications
                    </Typography>
                </Box>

                <Divider />

                <AsyncWrapper
                    loading={isLoading}
                    error={error}
                    isEmpty={notifications.length === 0}
                    emptyMessage="Aucune notification"
                >
                    <List sx={{ p: 0 }}>
                        {notifications.map((notif) => (
                            <ListItem
                                key={notif.id}
                                onClick={() => !notif.read && markReadMutation.mutate(notif.id)}
                                sx={{
                                    cursor: 'pointer',
                                    borderLeft: !notif.read ? '4px solid' : 'none',
                                    borderColor: 'success.main',
                                    bgcolor: !notif.read
                                        ? 'rgba(16, 185, 129, 0.08)'
                                        : 'transparent',
                                    '&:hover': {
                                        bgcolor: !notif.read
                                            ? 'rgba(16, 185, 129, 0.12)'
                                            : 'action.hover',
                                    },
                                    transition: 'all 0.2s',
                                    py: 1.5,
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
                                        sx: { mt: 0.5, display: 'block' },
                                    }}
                                />
                            </ListItem>
                        ))}
                    </List>
                </AsyncWrapper>
            </Menu>
        </Box>
    );
};

export default NotificationsDropdown;
