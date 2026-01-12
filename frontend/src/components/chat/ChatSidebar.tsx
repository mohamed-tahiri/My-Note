import { 
  Box, Typography, List, Divider, CircularProgress, 
  Paper, alpha, InputBase, Stack, IconButton 
} from '@mui/material';
import AddCommentIcon from '@mui/icons-material/AddComment';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import type { Chat } from '@/types/chat';
import { ChatItem } from './ChatItem';

interface ChatSidebarProps {
  chats: Chat[];
  loading: boolean;
  activeChatId?: string;
  currentUserId: number;
  onOpenCreateModal: () => void;
}

export function ChatSidebar({ chats, loading, activeChatId, currentUserId, onOpenCreateModal }: ChatSidebarProps) {
  const navigate = useNavigate();
  return (
    <Paper 
      elevation={0}
      sx={{ 
        width: 350, borderRight: '1px solid', borderColor: 'divider',
        display: 'flex', flexDirection: 'column', borderRadius: 0 
      }}
    >
      <Box sx={{ p: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h5" fontWeight={800}>Messages</Typography>
          <IconButton
            onClick={onOpenCreateModal}
            sx={{ bgcolor: alpha('#2563eb', 0.1), color: 'primary.main' }}
          >
            <AddCommentIcon fontSize="small" />
          </IconButton>
        </Stack>
        <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: alpha('#64748b', 0.08), borderRadius: '12px', px: 2, py: 1 }}>
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
            {chats.map((chat) => (
              <ChatItem
                key={chat.id}
                chat={chat}
                currentUserId={currentUserId}
                isActive={Number(activeChatId) === chat.id}
                variant="sidebar"
                onClick={() => navigate(`/chats/${chat.id}`)}
              />
            ))}
          </List>
        )}
      </Box>
    </Paper>
  );
}