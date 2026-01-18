import React, { useState } from 'react';
import { Box, Paper, Typography, alpha, IconButton, Menu, MenuItem, ListItemIcon } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import type { ChatMessageProps } from '@/types/props';

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isMe, onDelete, onEdit }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  if (message.isDeleted) {
    return (
      <Box sx={{ alignSelf: isMe ? 'flex-end' : 'flex-start', mb: 1 }}>
        <Typography variant="caption" sx={{ fontStyle: 'italic', color: 'text.disabled', px: 2 }}>
          Ce message a été supprimé
        </Typography>
      </Box>
    );
  }

  return (
    <Box 
      sx={{ 
        display: 'flex',
        flexDirection: 'column',
        alignSelf: isMe ? 'flex-end' : 'flex-start',
        alignItems: isMe ? 'flex-end' : 'flex-start',
        maxWidth: isMe ? '90%' : '85%', 
        mb: 0.5,
        position: 'relative',
        '&:hover .message-actions': { opacity: 1 },
        '&:hover .time-caption': { opacity: 1, maxHeight: '20px', mt: 0.3 }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexDirection: isMe ? 'row-reverse' : 'row' }}>
        <Paper 
          elevation={0}
          sx={{ 
            p: 1.2, px: 1.8,
            borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px', 
            bgcolor: isMe ? 'primary.main' : 'white',
            color: isMe ? 'white' : 'text.primary',
            border: isMe ? 'none' : '1px solid',
            borderColor: alpha('#64748b', 0.2),
            boxShadow: isMe ? '0px 4px 10px rgba(37, 99, 235, 0.2)' : '0px 2px 4px rgba(0,0,0,0.05)',
          }}
        >
          <Typography variant="body2" sx={{ fontSize: '0.875rem', lineHeight: 1.5, wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
            {message.content}
          </Typography>
        </Paper>

        {isMe && (
          <IconButton 
            className="message-actions"
            size="small" 
            onClick={handleOpenMenu}
            sx={{ opacity: 0, transition: 'opacity 0.2s', bgcolor: alpha('#64748b', 0.05) }}
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      <Menu sx={{ marginTop: 1, right: 0, top: 0 }} anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
        <MenuItem onClick={() => { onEdit?.(message); handleCloseMenu(); }}>
          <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
          Éditer
        </MenuItem>
        <MenuItem onClick={() => { onDelete?.(message.id); handleCloseMenu(); }} sx={{ color: 'error.main' }}>
          <ListItemIcon><DeleteIcon fontSize="small" color="error" /></ListItemIcon>
          Supprimer
        </MenuItem>
      </Menu>

      <Typography 
        className="time-caption"
        variant="caption" 
        sx={{ px: 0.5, color: 'text.disabled', fontSize: '0.65rem', fontWeight: 600, opacity: 0, maxHeight: 0, overflow: 'hidden', transition: 'all 0.2s ease-in-out' }}
      >
        {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Typography>
    </Box>
  );
};