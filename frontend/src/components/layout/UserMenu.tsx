import { Link } from 'react-router-dom';
import {
    Box,
    Typography,
    IconButton,
    Avatar,
    Menu,
    MenuItem,
    Divider,
    ListItemIcon,
    Tooltip,
} from '@mui/material';
import { Logout } from '@mui/icons-material';
import type { User } from '@/types/user';

interface UserMenuProps {
    user: User | null;
    handleOpenMenu: (event: React.MouseEvent<HTMLElement>) => void;
    anchorEl: HTMLElement | null;
    openMenu: boolean;
    handleCloseMenu: () => void;
    handleLogout: () => void;
}

export default function UserMenu({
    user,
    handleOpenMenu,
    anchorEl,
    openMenu,
    handleCloseMenu,
    handleLogout,
}: UserMenuProps) {
    return (
        <>
            <Tooltip title="Paramètres du compte">
                <IconButton onClick={handleOpenMenu} size="small">
                    <Avatar
                        sx={{
                            width: 32,
                            height: 32,
                            bgcolor: 'primary.main',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                        }}
                    >
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
                    sx: {
                        mt: 1.5,
                        minWidth: 200,
                        borderRadius: '12px',
                        boxShadow: '0px 8px 16px rgba(0,0,0,0.1)',
                    },
                }}
            >
                <Box
                    component={Link}
                    to="/profile"
                    sx={{
                        px: 2.5,
                        py: 2,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        textDecoration: 'none',
                        color: 'inherit',
                        transition: 'background-color 0.2s',
                        '&:hover': {
                            bgcolor: 'action.hover',
                        },
                    }}
                >
                    {/* Avatar avec fallback sur initiales */}
                    <Avatar
                        src={user?.avatarUrl}
                        sx={{
                            width: 40,
                            height: 40,
                            fontSize: '0.9rem',
                            fontWeight: 700,
                            bgcolor: 'primary.main',
                            boxShadow: '0 2px 8px rgba(37, 99, 235, 0.15)',
                        }}
                    >
                        {user?.firstName?.charAt(0) || user?.email.charAt(0).toUpperCase()}
                    </Avatar>

                    {/* Textes : Nom et Email */}
                    <Box sx={{ overflow: 'hidden', flex: 1 }}>
                        <Typography
                            variant="subtitle2"
                            sx={{
                                fontWeight: 700,
                                lineHeight: 1.2,
                                color: 'text.primary',
                                display: 'block',
                            }}
                            noWrap
                        >
                            {user?.firstName && user?.lastName
                                ? `${user.firstName} ${user.lastName}`
                                : user?.firstName || 'Utilisateur'}
                        </Typography>
                        <Typography
                            variant="caption"
                            sx={{
                                color: 'text.disabled',
                                display: 'block',
                                fontSize: '0.75rem',
                            }}
                            noWrap
                        >
                            {user?.email}
                        </Typography>
                    </Box>
                </Box>
                <Divider />

                <MenuItem onClick={handleLogout} sx={{ color: 'error.main', py: 1 }}>
                    <ListItemIcon>
                        <Logout fontSize="small" sx={{ color: 'error.main' }} />
                    </ListItemIcon>
                    Déconnexion
                </MenuItem>
            </Menu>
        </>
    );
}
