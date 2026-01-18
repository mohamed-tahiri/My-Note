import { Avatar, Badge, Box, IconButton, Tooltip } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import type { MinimizedChatProps } from "@/types/props";

export default function MinimizedChat({ chat, setMinimized, onClose } : MinimizedChatProps) {
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
    )
}