import { Avatar, Box, IconButton, Stack, Typography } from "@mui/material";
import RemoveIcon from '@mui/icons-material/Remove';
import CloseIcon from '@mui/icons-material/Close';
import type { Chat } from "@/types/chat";

interface HeaderProps {
    chat: Chat,
    setMinimized: (value: boolean) => void,
    onClose: () => void;
}

export default function Header({ chat, setMinimized, onClose } : HeaderProps) {
    return (
        <Box sx={{ 
            p: 1.5, bgcolor: 'primary.main', color: 'white', 
            display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
            <Stack direction="row" spacing={1} alignItems="center">
            <Avatar sx={{ width: 32, height: 32, fontSize: '0.9rem', bgcolor: 'white', color: 'primary.main', fontWeight: 700 }}>
                {chat.name?.charAt(0) || 'C'}
            </Avatar>
            <Typography variant="body2" fontWeight={700} noWrap sx={{ maxWidth: 180 }}>
                {chat.name || "Discussion"}
            </Typography>
            </Stack>
            <Stack direction="row">
            <IconButton size="small" sx={{ color: 'white' }} onClick={() => setMinimized(true)}>
                <RemoveIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" sx={{ color: 'white' }} onClick={onClose}>
                <CloseIcon fontSize="small" />
            </IconButton>
            </Stack>
        </Box>
    )
}