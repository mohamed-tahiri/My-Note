import { useEffect, useState, useCallback } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import ForumIcon from '@mui/icons-material/Forum';
import { useParams, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { getChatsByUser } from '@/api/chatService';
import { CreateChatModal } from '@/components/chat/CreateChatModal';
import type { Chat } from '@/types/chat';
import { ChatSidebar } from '@/components/chat/ChatSidebar';

export default function ChatsPage() {
  const { id: activeChatId } = useParams();
  const { user } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

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
      <ChatSidebar 
        chats={chats} 
        loading={loading} 
        activeChatId={activeChatId}
        currentUserId={Number(user?.id)}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
      />

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

      <CreateChatModal 
        open={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onChatCreated={loadChats}
      />
    </Box>
  );
}