import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { Box, Typography, Divider } from '@mui/material';
import { useState, useMemo } from 'react';

import { useAuth } from '@/hooks/useAuth';
import NotificationsDropdown from './notifications/NotificationsDropdown';
import { env } from '@/utils/env';
import ChatsDropdown from '../chat/dropdown/ChatsDropdown';
import UserMenu from './UserMenu';

export default function Header() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // État pour le menu de profil
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const openMenu = Boolean(anchorEl);

    // Initialisation du socket (on utilise l'ID réel de l'utilisateur)
    // useMemo évite de recréer la connexion socket à chaque render
    // eslint-disable-next-line react-hooks/preserve-manual-memoization
    const socket = useMemo(() => {
        if (!user?.id) return null;
        return io(env.apiSocket, { query: { userId: user.id } });
    }, [user?.id]);

    const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        handleCloseMenu();
        await logout();
        navigate('/login');
    };

    return (
        <Box
            component="header"
            sx={{
                bgcolor: 'background.paper',
                borderBottom: '1px solid',
                borderColor: 'divider',
                position: 'sticky',
                top: 0,
                zIndex: 1100,
                // Pas de backgroundColor hardcoded ici
            }}
        >
            <Box
                sx={{
                    maxWidth: '1200px',
                    mx: 'auto',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: 1.5,
                }}
            >
                {/* Logo */}
                <Typography
                    variant="h6"
                    component={RouterLink}
                    to="/"
                    sx={{
                        fontWeight: 800,
                        textDecoration: 'none',
                        color: 'primary.main',
                        letterSpacing: '-0.5px',
                    }}
                >
                    My Note
                </Typography>

                {/* Navigation Centrale */}
                <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 4 }}>
                    {['Notes', 'Tasks', 'Appointments'].map((item) => (
                        <Typography
                            key={item}
                            component={RouterLink}
                            to={`/${item.toLowerCase()}`}
                            sx={{
                                textDecoration: 'none',
                                color: 'text.secondary',
                                fontWeight: 500,
                                fontSize: '0.9rem',
                                '&:hover': { color: 'primary.main' },
                            }}
                        >
                            {item}
                        </Typography>
                    ))}
                </Box>

                {/* Actions & Profil */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ChatsDropdown />
                    {socket && user && <NotificationsDropdown socket={socket} userId={user.id} />}

                    <Divider orientation="vertical" flexItem sx={{ mx: 1, my: 1 }} />

                    <UserMenu
                        user={user}
                        handleOpenMenu={handleOpenMenu}
                        anchorEl={anchorEl}
                        openMenu={openMenu}
                        handleCloseMenu={handleCloseMenu}
                        handleLogout={handleLogout}
                    />
                </Box>
            </Box>
        </Box>
    );
}
