import React, { useState } from 'react';
import { 
  Box, IconButton, Badge, Menu, Typography, 
  List, ListItem, ListItemAvatar, Avatar, ListItemText, 
  Divider, Tooltip 
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from 'react-router-dom';

// Structure de données typée pour vos messages
interface ChatPreview {
  id: string | number;
  name: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
}

export default function ChatsDropdown() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // Exemple de données (À lier à votre State/Socket plus tard)
  const [chats] = useState<ChatPreview[]>([
    { id: 1, name: 'Jean Dupont', lastMessage: 'On se voit demain pour la note ?', timestamp: '10:30', unread: true },
    { id: 2, name: 'Marie Courtois', lastMessage: 'Merci pour le partage !', timestamp: 'Hier', unread: false },
    { id: 3, name: 'Groupe Projet', lastMessage: 'Le compte-rendu est prêt.', timestamp: 'Lun', unread: false },
  ]);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const unreadCount = chats.filter(c => c.unread).length;

  return (
    <Box>
      <Tooltip title="Messages">
        <IconButton 
          onClick={handleOpen} 
          size="large" 
          sx={{ color: 'primary.main' }}
        >
          <Badge 
            badgeContent={unreadCount} 
            color="success"
            sx={{ '& .MuiBadge-badge': { fontWeight: 700, fontSize: '0.65rem' } }}
          >
            <ChatIcon />
          </Badge>
        </IconButton>
      </Tooltip>

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
            overflow: 'hidden'
          }
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1" fontWeight={700} color="primary.main">
            Messages
          </Typography>
        </Box>
        
        <Divider />

        <List sx={{ p: 0, bgcolor: 'background.paper' }}>
          {chats.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Aucun message récent
              </Typography>
            </Box>
          ) : (
            chats.map((chat) => (
              <React.Fragment key={chat.id}>
                <ListItem
                  onClick={() => {
                    navigate(`/chats/${chat.id}`);
                    handleClose();
                  }}
                  sx={{
                    cursor: 'pointer',
                    py: 1.5,
                    px: 2,
                    '&:hover': { bgcolor: 'background.default' },
                    transition: 'background-color 0.2s',
                  }}
                >
                  <ListItemAvatar>
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      variant="dot"
                      invisible={!chat.unread}
                      sx={{ '& .MuiBadge-badge': { bgcolor: 'success.main' } }}
                    >
                      <Avatar sx={{ bgcolor: 'primary.light' }}>
                        <PersonIcon />
                      </Avatar>
                    </Badge>
                  </ListItemAvatar>
                  <ListItemText
                    primary={chat.name}
                    secondary={chat.lastMessage}
                    primaryTypographyProps={{
                      variant: 'body2',
                      fontWeight: chat.unread ? 700 : 500,
                      color: 'primary.main',
                      noWrap: true
                    }}
                    secondaryTypographyProps={{
                      variant: 'caption',
                      color: 'text.secondary',
                      noWrap: true,
                      sx: { display: 'block', mt: 0.2 }
                    }}
                  />
                  <Box sx={{ ml: 1, textAlign: 'right', minWidth: 50 }}>
                    <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.7rem' }}>
                      {chat.timestamp}
                    </Typography>
                  </Box>
                </ListItem>
                <Divider component="li" sx={{ mx: 2, opacity: 0.6 }} />
              </React.Fragment>
            ))
          )}
        </List>
      </Menu>
    </Box>
  );
}