import React from 'react';
import { 
  Drawer, Box, Typography, IconButton, Avatar, List, 
  ListItem, ListItemAvatar, ListItemText, Divider, Button, Stack 
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import type { Chat } from '@/types/chat';

interface ChatInfoDrawerProps {
  open: boolean;
  onClose: () => void;
  chat: Chat;
}

export const ChatInfoDrawer: React.FC<ChatInfoDrawerProps> = ({ open, onClose, chat }) => {
  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 320, p: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6" fontWeight={800}>Détails</Typography>
          <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
        </Stack>

        {/* Profil du Chat */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Avatar sx={{ width: 80, height: 80, fontSize: '2rem', mx: 'auto', mb: 2, bgcolor: 'primary.main' }}>
            {chat.name?.charAt(0) || '?'}
          </Avatar>
          <Typography variant="subtitle1" fontWeight={700}>{chat.name || "Discussion"}</Typography>
          <Typography variant="caption" color="text.secondary">
            {chat.type === 'task_group' ? 'Groupe de travail' : 'Discussion privée'}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Membres */}
        <Typography variant="overline" color="text.secondary" fontWeight={700}>Membres</Typography>
        <List dense>
          {chat.participants?.map((member) => (
            <ListItem key={member.id} disableGutters>
              <ListItemAvatar>
                <Avatar sx={{ width: 32, height: 32 }}><PersonIcon fontSize="small" /></Avatar>
              </ListItemAvatar>
              <ListItemText 
                primary={`${member.firstName} ${member.lastName || ''}`} 
                secondary="En ligne"
                primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
              />
            </ListItem>
          ))}
        </List>

        <Divider sx={{ my: 2 }} />

        {/* Actions */}
        <Typography variant="overline" color="text.secondary" fontWeight={700}>Actions</Typography>
        <Stack spacing={1} mt={1}>
          <Button startIcon={<LogoutIcon />} color="error" fullWidth sx={{ justifyContent: 'flex-start' }}>
            Quitter le groupe
          </Button>
          <Button startIcon={<DeleteOutlineIcon />} color="error" fullWidth sx={{ justifyContent: 'flex-start' }}>
            Supprimer la conversation
          </Button>
        </Stack>
      </Box>
    </Drawer>
  );
};