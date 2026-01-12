import React from 'react';
import { 
  ListItem, ListItemAvatar, Avatar, ListItemText, 
  Typography, Box, alpha 
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import type { Chat } from '@/types/chat';
import type { User } from '@/types/user';

interface ChatItemProps {
  chat: Chat;
  currentUserId: number;
  isActive?: boolean;
  onClick: () => void;
  variant?: 'sidebar' | 'dropdown';
}

export const ChatItem: React.FC<ChatItemProps> = ({ 
  chat, 
  currentUserId, 
  isActive = false, 
  onClick,
  variant = 'sidebar'
}) => {
  const isGroup = chat.type === 'task_group';
  
  // Logique de nom : Nom du groupe OU nom du participant (autre que soi-même)
  const displayName = chat.name || 
    chat.participants.find((p: User) => p.id !== currentUserId)?.firstName || "Discussion";
  
  const displayMsg = chat.lastMessage;

  return (
    <ListItem
      onClick={onClick}
      sx={{ 
        cursor: 'pointer',
        py: variant === 'sidebar' ? 2 : 1.5,
        px: variant === 'sidebar' ? 3 : 2,
        bgcolor: isActive ? alpha('#2563eb', 0.06) : 'transparent',
        borderLeft: variant === 'sidebar' ? '4px solid' : 'none',
        borderLeftColor: isActive ? 'primary.main' : 'transparent',
        transition: 'all 0.2s',
        '&:hover': { bgcolor: alpha('#2563eb', 0.03) }
      }}
    >
      <ListItemAvatar>
        <Avatar 
          sx={{ 
            bgcolor: isGroup ? 'secondary.main' : 'primary.light', 
            width: variant === 'sidebar' ? 45 : 42, 
            height: variant === 'sidebar' ? 45 : 42 
          }}
        >
          {isGroup ? <GroupIcon /> : <PersonIcon />}
        </Avatar>
      </ListItemAvatar>
      
      <ListItemText
        primary={displayName}
        secondary={displayMsg?.content || (variant === 'sidebar' ? "Aucun message" : "Démarrer une conversation...")}
        primaryTypographyProps={{ 
          variant: 'body2', 
          fontWeight: 700, 
          noWrap: true,
          color: 'text.primary'
        }}
        secondaryTypographyProps={{ 
          variant: 'caption', 
          noWrap: true,
          sx: { mt: 0.3, display: 'block' }
        }}
      />

      {/* Affichage de l'heure uniquement si un message existe */}
      {displayMsg && (
        <Box sx={{ ml: 1, textAlign: 'right', minWidth: 60 }}>
          <Typography 
            variant="caption" 
            color="text.disabled" 
            sx={{ fontSize: '0.7rem', fontWeight: 600 }}
          >
            {new Date(displayMsg.createdAt).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </Typography>
        </Box>
      )}
    </ListItem>
  );
};