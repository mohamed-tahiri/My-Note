import { useState } from 'react';
import { Box } from '@mui/material';
import { useParams, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useChats } from '@/hooks/queries/useChatQueries'; // Ton nouveau hook
import { CreateChatModal } from '@/components/chat/CreateChatModal';
import { ChatSidebar } from '@/components/chat/ChatSidebar';
import { AsyncWrapper } from '@/components/ui/AsyncWrapper';
import { logger } from '@/utils/logger';

export default function ChatsPage() {
    const { id: activeChatId } = useParams();
    const { user } = useAuth();

    const { data: chats, isLoading, error, refetch } = useChats(Number(user?.id));

    logger.debug('ChatsPage rendered with chats:', chats);

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    return (
        <Box
            sx={{
                display: 'flex',
                height: 'calc(100vh - 64px)',
                bgcolor: 'background.default',
                overflow: 'hidden',
            }}
        >
            <AsyncWrapper
                loading={isLoading}
                error={error}
                isEmpty={!chats || chats.length === 0}
                emptyMessage="Vous n'avez pas encore de notes. Commencez par en créer une !"
                onRetry={() => refetch()}
            >
                <ChatSidebar
                    chats={chats || []}
                    loading={isLoading}
                    activeChatId={activeChatId}
                    currentUserId={Number(user?.id)}
                    onOpenCreateModal={() => setIsCreateModalOpen(true)}
                />

                <Box
                    sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        bgcolor: '#f8fafc',
                        position: 'relative',
                    }}
                >
                    <Outlet />
                </Box>
            </AsyncWrapper>

            <CreateChatModal
                open={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                // Note: Plus besoin de onChatCreated={loadChats} !
                // La mutation de création dans CreateChatModal invalidera la query ['chats']
            />
        </Box>
    );
}
