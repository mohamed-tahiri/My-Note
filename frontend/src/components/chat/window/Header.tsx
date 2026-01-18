import type { HeaderChatWindow } from '@/types/props';
import type { User } from '@/types/user';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Avatar, Box, IconButton, Stack, Typography } from '@mui/material';

export default function Header({chat, user, setInfoOpen}: HeaderChatWindow) {
    return (
        <Box sx={{ p: 2, bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ bgcolor: 'primary.main', fontWeight: 800 }}>
                {chat.name?.charAt(0) || chat.participants?.find((p: User) => p.id !== user?.id)?.firstName?.charAt(0)}
            </Avatar>
            <Box>
                <Typography variant="body1" sx={{ fontWeight: 800 }}>
                {chat.name || chat.participants?.find((p: User) => p.id !== user?.id)?.firstName}
                </Typography>
                <Typography variant="caption" color="success.main" sx={{ fontWeight: 700 }}>• En ligne</Typography>
            </Box>
            </Stack>
            <IconButton onClick={() => setInfoOpen(true)}><MoreVertIcon /></IconButton>
        </Box>
    );
}