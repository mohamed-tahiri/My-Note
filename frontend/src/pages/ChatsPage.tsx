import { useEffect, useState, useCallback } from 'react';
import { 
  Box, Typography, List, ListItem, ListItemAvatar, 
  Avatar, ListItemText, Divider, CircularProgress, 
  Paper, alpha, InputBase, Stack
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import SearchIcon from '@mui/icons-material/Search';
import ForumIcon from '@mui/icons-material/Forum';
import { useNavigate, useParams, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { getChatsByUser } from '@/api/chatService';
import type { Chat } from '@/types/chat';
import type { User } from '@/types/user';

export default function ChatsPage() {
  const navigate = useNavigate();
  const { id: activeChatId } = useParams();
  const { user } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  const loadChats = useCallback(async () => {
    if (!user?.id) return;
    try {
      const res = await getChatsByUser(Number(user.id));
      setChats(res.data);
    } catch (error) {
      console.error("Erreur chargement chats", error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => { loadChats(); }, [loadChats]);

  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)', bgcolor: 'background.default' }}>
      
      {/* SIDEBAR GAUCHE */}
      <Paper 
        elevation={0}
        sx={{ 
          width: 350, 
          borderRight: '1px solid', 
          borderColor: 'divider',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 0
        }}
      >
        <Box sx={{ p: 3 }}>
          <Typography variant="h5" fontWeight={800} sx={{ mb: 2 }}>Messages</Typography>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            bgcolor: alpha('#64748b', 0.08), 
            borderRadius: '12px', 
            px: 2, py: 1 
          }}>
            <SearchIcon sx={{ color: 'text.disabled', mr: 1, fontSize: 20 }} />
            <InputBase placeholder="Rechercher..." sx={{ fontSize: '0.9rem', flex: 1 }} />
          </Box>
        </Box>

        <Divider />

        <Box sx={{ flex: 1, overflowY: 'auto' }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress size={24} /></Box>
          ) : (
            <List sx={{ p: 0 }}>
              {chats.map((chat) => {
                const isGroup = chat.type === 'task_group';
                const isActive = Number(activeChatId) === chat.id;
                const displayName = chat.name || 
                  chat.participants.find((p: User) => p.id !== user?.id)?.firstName || "Discussion";
                const lastMsg = chat.messages?.[chat.messages.length - 1];

                return (
                  <ListItem
                    key={chat.id}
                    onClick={() => navigate(`/chats/${chat.id}`)}
                    sx={{ 
                      cursor: 'pointer', 
                      py: 2, px: 3,
                      bgcolor: isActive ? alpha('#2563eb', 0.06) : 'transparent',
                      borderLeft: '4px solid',
                      borderLeftColor: isActive ? 'primary.main' : 'transparent',
                      '&:hover': { bgcolor: alpha('#2563eb', 0.03) }
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: isGroup ? 'secondary.main' : 'primary.light', width: 45, height: 45 }}>
                        {isGroup ? <GroupIcon /> : <PersonIcon />}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={displayName}
                      secondary={lastMsg?.content || "Aucun message"}
                      primaryTypographyProps={{ variant: 'body2', fontWeight: 700, noWrap: true }}
                      secondaryTypographyProps={{ variant: 'caption', noWrap: true }}
                    />
                  </ListItem>
                );
              })}
            </List>
          )}
        </Box>
      </Paper>

      {/* ZONE DROITE (Contenu de la conversation) */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', bgcolor: '#f8fafc' }}>
        {activeChatId ? (
          <Outlet /> 
        ) : (
          <Stack sx={{ m: 'auto', alignItems: 'center', textAlign: 'center', opacity: 0.5 }}>
            <ForumIcon sx={{ fontSize: 80, mb: 2, color: 'primary.light' }} />
            <Typography variant="h6" fontWeight={700}>Vos conversations</Typography>
            <Typography variant="body2">Sélectionnez une discussion pour commencer à écrire.</Typography>
          </Stack>
        )}
      </Box>
    </Box>
  );
}