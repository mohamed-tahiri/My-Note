import { Badge, IconButton, Tooltip } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat" 

interface IconProps {
  handleOpen: (event: React.MouseEvent<HTMLElement>) => void;
  unreadCount: number;
}

export default function Icon({ handleOpen, unreadCount }: IconProps) {
    return (
        <Tooltip title="Messages">
            <IconButton 
            onClick={handleOpen} 
            size="large" 
            sx={{ color: 'primary.main' }}
            >
            <Badge
                badgeContent={unreadCount} 
                color="error"
                sx={{ '& .MuiBadge-badge': { fontWeight: 700, fontSize: '0.65rem' } }}
            >
                <ChatIcon />
            </Badge>
            </IconButton>
        </Tooltip>
    )
}