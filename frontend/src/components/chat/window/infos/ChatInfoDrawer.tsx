import React from 'react';
import { Drawer, Box, Typography, IconButton, Avatar, List, Divider, Button, Stack, alpha } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LogoutIcon from '@mui/icons-material/Logout';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import type { ChatInfoDrawerProps } from '@/types/props';
import { MemberItem } from './MemberItem';

export const ChatInfoDrawer: React.FC<ChatInfoDrawerProps> = ({ open, onClose, chat }) => {
    return (
        <Drawer 
            anchor="right" 
            open={open} 
            onClose={onClose}
            PaperProps={{ sx: { width: { xs: '100%', sm: 320 }, borderLeft: '1px solid', borderColor: 'divider' } }}
        >
            <Box sx={{ p: 3 }}>
                {/* Header */}
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h6" fontWeight={800} color="primary.main">Détails du chat</Typography>
                    <IconButton onClick={onClose} size="small" sx={{ bgcolor: 'action.hover' }}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Stack>

                {/* Chat Profile */}
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Avatar sx={{ width: 80, height: 80, fontSize: '2rem', mx: 'auto', mb: 2, bgcolor: 'primary.main', fontWeight: 800 }}>
                        {chat.name?.charAt(0) || '?'}
                    </Avatar>
                    <Typography variant="subtitle1" fontWeight={800}>{chat.name || 'Discussion privée'}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 700 }}>
                        {chat.type === 'task_group' ? 'Groupe de travail' : 'Message direct'}
                    </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />
                
                {/* Members List */}
                <Typography variant="overline" color="text.secondary" fontWeight={800} sx={{ mb: 1, display: 'block' }}>
                    Membres ({chat.participants?.length})
                </Typography>

                <List dense sx={{ mb: 2 }}>
                    {chat.participants?.map((member) => (
                        <MemberItem key={member.id} member={member} />
                    ))}
                </List>

                <Divider sx={{ my: 2 }} />
                
                {/* Actions */}
                <Typography variant="overline" color="text.secondary" fontWeight={800} sx={{ mb: 1, display: 'block' }}>Gestion</Typography>
                <Stack spacing={1.5}>
                    <Button
                        startIcon={<LogoutIcon />}
                        color="error"
                        fullWidth
                        sx={{ justifyContent: 'flex-start', borderRadius: '10px', textTransform: 'none', fontWeight: 700, bgcolor: (theme) => alpha(theme.palette.error.main, 0.1) }}
                    >
                        Quitter le groupe
                    </Button>
                    <Button
                        variant="text"
                        startIcon={<DeleteOutlineIcon/>}
                        color="error" fullWidth
                        sx={{ justifyContent: 'flex-start', borderRadius: '10px', textTransform: 'none', fontWeight: 700 }}
                    >
                        Supprimer la conversation
                    </Button>
                </Stack>
            </Box>
        </Drawer>
    );
};