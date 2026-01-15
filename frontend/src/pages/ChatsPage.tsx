import { useEffect, useState, useCallback } from 'react';
import { Box } from '@mui/material';
import { useParams, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { getChatsByUser } from '@/api/chatService';
import { CreateChatModal } from '@/components/chat/CreateChatModal';
import type { Chat } from '@/types/chat';
import { ChatSidebar } from '@/components/chat/ChatSidebar';
import { logger } from '@/utils/logger';

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
      logger.error("Erreur chargement chats", error);
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
        <Outlet /> 
      </Box>

      <CreateChatModal 
        open={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onChatCreated={loadChats}
      />
    </Box>
  );
}