import { useState, useEffect, useRef } from 'react';
import { 
  Paper, Box, Typography, IconButton, InputBase, 
  Avatar, Stack, alpha, Divider, Tooltip, 
  Badge
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import RemoveIcon from '@mui/icons-material/Remove';
import { getById } from '@/api/chatService';
import type { Chat } from '@/types/chat';
import type { Message } from '@/types/message';

interface FloatingChatProps {
  chatId: number;
  onClose: () => void;
}

export default function FloatingChatWindow({ chatId, onClose }: FloatingChatProps) {
    const [chat, setChat] = useState<Chat | null>(null);
    const [message, setMessage] = useState('');
    const [minimized, setMinimized] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const loadChat = async () => {
            const res = await getById(chatId);
            setChat(res.data);
        };
        loadChat();
    }, [chatId]);

    useEffect(() => {
        if (!minimized) {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [chat?.messages, minimized]);

    if (!chat) return null;

    if (minimized) {
        return (
        <Tooltip title={chat.name || "Discussion"} placement="left">
            <Box
            onClick={() => setMinimized(false)}
            sx={{
                position: 'fixed',
                bottom: { xs: 80, md: 40},
                right: 110,
                zIndex: 1300,
                cursor: 'pointer',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': { transform: 'scale(1.1)' }
            }}
            >
            <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                badgeContent={
                <IconButton 
                    size="small" 
                    onClick={(e) => { e.stopPropagation(); onClose(); }}
                    sx={{ 
                    bgcolor: 'error.main', 
                    color: 'white', 
                    width: 18, 
                    height: 18,
                    '&:hover': { bgcolor: 'error.dark' }
                    }}
                >
                    <CloseIcon sx={{ fontSize: 12 }} />
                </IconButton>
                }
            >
                <Avatar 
                sx={{ 
                    width: 56, 
                    height: 56, 
                    bgcolor: 'primary.main', 
                    boxShadow: '0px 4px 12px rgba(0,0,0,0.2)'
                }}
                >
                {chat.name?.charAt(0) || 'C'}
                </Avatar>
            </Badge>
            </Box>
        </Tooltip>
        );
    }

    return (
        <Paper
        elevation={6}
        sx={{
            width: 360,
            position: 'fixed',
            bottom: 20,
            right: 110,
            zIndex: 1300,
            borderRadius: '16px',
            display: 'flex',
            flexDirection: 'column',
            height: 450,
            overflow: 'hidden',
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: '0px 8px 24px rgba(15, 23, 42, 0.15)'
        }}
        >
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

        <Box sx={{ flex: 1, overflowY: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 1, bgcolor: '#f8fafc' }}>
            {chat.messages?.map((msg: Message) => (
            <Box key={msg.id} sx={{ alignSelf: msg.senderId === 1 ? 'flex-end' : 'flex-start' }}>
                <Paper sx={{ 
                p: 1.2, px: 1.8, borderRadius: '18px', 
                bgcolor: msg.senderId === 1 ? 'primary.main' : 'white',
                color: msg.senderId === 1 ? 'white' : 'text.primary',
                fontSize: '0.85rem',
                boxShadow: '0px 2px 4px rgba(0,0,0,0.05)'
                }}>
                {msg.content}
                </Paper>
            </Box>
            ))}
            <div ref={scrollRef} />
        </Box>

        <Divider />
        <Box sx={{ p: 1.5, display: 'flex', alignItems: 'center', gap: 1, bgcolor: 'white' }}>
            <InputBase
            fullWidth
            multiline
            maxRows={3}
            placeholder="Écrire un message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            sx={{ 
                fontSize: '0.85rem', 
                bgcolor: alpha('#64748b', 0.08), 
                borderRadius: '20px', 
                px: 2, py: 0.8 
            }}
            />
            <IconButton size="small" color="primary" sx={{ bgcolor: alpha('#2563eb', 0.1) }}>
            <SendIcon fontSize="small" />
            </IconButton>
        </Box>
        </Paper>
    );
}