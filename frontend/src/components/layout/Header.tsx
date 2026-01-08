import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { 
  Box, Typography, IconButton, Avatar, 
  Menu, MenuItem, Divider, ListItemIcon, Tooltip 
} from '@mui/material';
import { Logout } from '@mui/icons-material';
import { useState, useMemo } from 'react';

import { useAuth } from '@/hooks/useAuth';
import NotificationsDropdown from './NotificationsDropdown';
import ChatsDropdown from './chat/ChatsDropdown';
import { env } from '@/utils/env';

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
    <header style={{ 
      backgroundColor: '#FFFFFF', 
      borderBottom: '1px solid #E2E8F0',
      position: 'sticky',
      top: 0,
      zIndex: 1100 
    }}>
      <Box sx={{ maxWidth: '1200px', mx: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5 }}>
        
        {/* Logo */}
        <Typography 
          variant="h6" 
          component={RouterLink} 
          to="/" 
          sx={{ 
            fontWeight: 800, 
            textDecoration: 'none', 
            color: 'primary.main',
            letterSpacing: '-0.5px'
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
                '&:hover': { color: 'primary.main' }
              }}
            >
              {item}
            </Typography>
          ))}
        </Box>

        {/* Actions & Profil */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ChatsDropdown />
          {socket && user && (
            <NotificationsDropdown socket={socket} userId={user.id} />
          )}

          <Divider orientation="vertical" flexItem sx={{ mx: 1, my: 1 }} />

          {/* Menu Utilisateur */}
          <Tooltip title="Paramètres du compte">
            <IconButton onClick={handleOpenMenu} size="small">
              <Avatar sx={{ 
                width: 32, 
                height: 32, 
                bgcolor: 'primary.main', 
                fontSize: '0.8rem',
                fontWeight: 600
              }}>
                {user?.email?.charAt(0)}
              </Avatar>
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleCloseMenu}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              sx: { mt: 1.5, minWidth: 200, borderRadius: '12px', boxShadow: '0px 8px 16px rgba(0,0,0,0.1)' }
            }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="subtitle2" noWrap>{user?.email || 'Utilisateur'}</Typography>
              <Typography variant="caption" color="text.secondary" noWrap>{user?.email}</Typography>
            </Box>
            <Divider />
            
            <MenuItem onClick={handleLogout} sx={{ color: 'error.main', py: 1 }}>
              <ListItemIcon>
                <Logout fontSize="small" sx={{ color: 'error.main' }} />
              </ListItemIcon>
              Déconnexion
            </MenuItem>
          </Menu>
        </Box>
      </Box>
    </header>
  );
}