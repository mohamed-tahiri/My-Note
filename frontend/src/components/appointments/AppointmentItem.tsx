import { useState } from 'react';
import {
    Box,
    Chip,
    IconButton,
    Paper,
    Stack,
    Typography,
    Menu,
    MenuItem,
    ListItemIcon,
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import type { AppointmentItemProps } from '@/types/props';

export function AppointmentItem({ appointment, onEdit, onDelete }: AppointmentItemProps) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const getTypeColor = (type: string): 'primary' | 'warning' | 'success' | 'default' => {
        switch (type) {
            case 'Professional':
                return 'primary';
            case 'Medical':
                return 'warning';
            case 'Personal':
                return 'success';
            default:
                return 'default';
        }
    };

    // Formatage propre de l'heure (ex: 14:30)
    const formattedTime = new Date(appointment.startAt).toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <Paper
            elevation={0}
            sx={{
                p: 2.5,
                borderRadius: '16px',
                border: '1px solid',
                borderColor: 'divider',
                transition: 'all 0.2s',
                '&:hover': {
                    boxShadow: '0px 8px 24px rgba(15, 23, 42, 0.06)',
                    borderColor: 'primary.light',
                },
            }}
        >
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={3}
                alignItems={{ sm: 'center' }}
            >
                {/* Badge Date */}
                <Box
                    sx={{
                        minWidth: '80px',
                        textAlign: 'center',
                        bgcolor: 'background.default',
                        p: 1.5,
                        borderRadius: '12px',
                        border: '1px solid',
                        borderColor: 'divider',
                    }}
                >
                    <Typography
                        variant="caption"
                        sx={{
                            fontWeight: 700,
                            color: 'text.secondary',
                            textTransform: 'uppercase',
                        }}
                    >
                        {new Date(appointment.startAt).toLocaleDateString('fr-FR', {
                            month: 'short',
                        })}
                    </Typography>
                    <Typography
                        variant="h5"
                        sx={{ fontWeight: 800, color: 'primary.main', lineHeight: 1 }}
                    >
                        {new Date(appointment.startAt).getDate()}
                    </Typography>
                </Box>

                {/* Détails */}
                <Box sx={{ flex: 1 }}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                        <Chip
                            label={appointment.type}
                            size="small"
                            color={getTypeColor(appointment.type)}
                            sx={{ fontSize: '0.65rem', fontWeight: 800, height: '20px' }}
                        />
                        <Typography
                            variant="caption"
                            color="text.disabled"
                            sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                        >
                            <AccessTimeIcon sx={{ fontSize: '14px' }} /> {formattedTime}
                        </Typography>
                    </Stack>
                    <Typography
                        variant="h6"
                        sx={{ fontWeight: 700, color: 'primary.main', mb: 0.5 }}
                    >
                        {appointment.title}
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                    >
                        <LocationOnIcon sx={{ fontSize: '16px', color: 'primary.light' }} />
                        {appointment.location || 'Aucun lieu spécifié'}
                    </Typography>
                </Box>

                {/* Menu d'actions */}
                <Box>
                    <IconButton onClick={handleOpenMenu}>
                        <MoreVertIcon />
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        PaperProps={{
                            sx: {
                                borderRadius: '12px',
                                minWidth: '150px',
                                mt: 1,
                                boxShadow: '0px 4px 20px rgba(0,0,0,0.08)',
                            },
                        }}
                    >
                        <MenuItem
                            onClick={() => {
                                onEdit(appointment);
                                handleClose();
                            }}
                        >
                            <ListItemIcon>
                                <EditIcon fontSize="small" />
                            </ListItemIcon>
                            <Typography variant="body2">Modifier</Typography>
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                onDelete(appointment.id);
                                handleClose();
                            }}
                            sx={{ color: 'error.main' }}
                        >
                            <ListItemIcon>
                                <DeleteOutlineIcon fontSize="small" sx={{ color: 'error.main' }} />
                            </ListItemIcon>
                            <Typography variant="body2" fontWeight={600}>
                                Supprimer
                            </Typography>
                        </MenuItem>
                    </Menu>
                </Box>
            </Stack>
        </Paper>
    );
}
