import { 
  Box, Typography, List, Divider, CircularProgress, 
  Paper, alpha, InputBase, Stack, IconButton, Tooltip 
} from '@mui/material';
import AddCommentIcon from '@mui/icons-material/AddComment';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import { ChatItem } from './ChatItem';
import type { ChatSidebarProps } from '@/types/props';

export function ChatSidebar({ chats, loading, activeChatId, currentUserId, onOpenCreateModal }: ChatSidebarProps) {
  const navigate = useNavigate();

  return (
    <Paper 
      elevation={0}
      sx={{ 
        width: { xs: 95, md: 350 }, 
        borderRight: '1px solid', 
        borderColor: 'divider',
        display: 'flex', 
        flexDirection: 'column', 
        borderRadius: 0,
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
        height: '100%'
      }}
    >
      {/* HEADER SECTION */}
      <Box sx={{ p: { xs: 1.5, md: 3 } }}>
        <Stack 
          direction="row" 
          justifyContent={{ xs: 'center', md: 'space-between' }} 
          alignItems="center" 
          sx={{ mb: 3 }}
        >
          {/* TITRE: Masqué sur XS/SM, visible sur MD+ */}
          <Typography 
            variant="h5" 
            fontWeight={800} 
            sx={{ 
              display: { xs: 'none', md: 'block' },
              whiteSpace: 'nowrap' 
            }}
          >
            Messages
          </Typography>

          <Tooltip title="Nouveau message" placement="right">
            <IconButton
              onClick={onOpenCreateModal}
              sx={{ 
                bgcolor: alpha('#2563eb', 0.1), 
                color: 'primary.main',
                width: { xs: 45, md: 'auto' },
                height: { xs: 45, md: 'auto' },
                '&:hover': { bgcolor: alpha('#2563eb', 0.2) }
              }}
            >
              <AddCommentIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>

        {/* SEARCH SECTION */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: { xs: 'center', md: 'flex-start' },
            bgcolor: { xs: 'transparent', md: alpha('#64748b', 0.08) }, 
            borderRadius: '12px', 
            px: { xs: 0, md: 2 }, 
            py: { xs: 1, md: 1.2 },
            minHeight: 45
          }}
        >
          <SearchIcon sx={{ color: 'text.disabled', fontSize: 22 }} />
          
          <InputBase 
            placeholder="Rechercher..." 
            sx={{ 
              fontSize: '0.9rem', 
              flex: 1, 
              ml: 1,
              fontWeight: 500,
              // MASQUÉ sur XS/SM, AFFICHÉ sur MD+
              display: { xs: 'none', md: 'block' } 
            }} 
          />
        </Box>
      </Box>

      <Divider />

      {/* CHAT LIST SECTION */}
      <Box sx={{ 
        flex: 1, 
        overflowY: 'auto',
        // Scrollbar stylisée pour éviter l'encombrement sur mobile
        '&::-webkit-scrollbar': { width: '4px' },
        '&::-webkit-scrollbar-thumb': { bgcolor: 'divider', borderRadius: '4px' }
      }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress size={24} thickness={5} />
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {chats.map((chat) => (
              <ChatItem
                key={chat.id}
                chat={chat}
                currentUserId={currentUserId}
                isActive={Number(activeChatId) === chat.id}
                // On passe une info de responsive au ChatItem si nécessaire
                onClick={() => navigate(`/chats/${chat.id}`)}
              />
            ))}
          </List>
        )}
      </Box>
    </Paper>
  );
}