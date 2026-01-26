import React from 'react';
import { ListItem, ListItemAvatar, ListItemText, Avatar, Badge, styled } from '@mui/material';
import { usePresence } from '@/context/PresenceContext';
import type { User } from '@/types/user';

const StyledBadge = styled(Badge)(({ theme, color }) => ({
    '& .MuiBadge-badge': {
        backgroundColor: color === 'success' ? '#10B981' : '#94A3B8',
        color: color === 'success' ? '#10B981' : '#94A3B8',
        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
        '&::after': color === 'success' ? {
            position: 'absolute',
            top: 0, left: 0, width: '100%', height: '100%',
            borderRadius: '50%',
            animation: 'ripple 1.2s infinite ease-in-out',
            border: '1px solid currentColor',
            content: '""',
        } : {},
    },
    '@keyframes ripple': {
        '0%': { transform: 'scale(.8)', opacity: 1 },
        '100%': { transform: 'scale(2.4)', opacity: 0 },
    },
}));

interface MemberItemProps {
    member: User;
}

export const MemberItem: React.FC<MemberItemProps> = ({ member }) => {
    const { onlineUsers } = usePresence();
    const isOnline = onlineUsers.has(Number(member.id));

    return (
        <ListItem disableGutters sx={{ mb: 0.5 }}>
            <ListItemAvatar>
                <StyledBadge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    variant="dot"
                    color={isOnline ? 'success' : 'default'}
                >
                    <Avatar 
                        src={member.avatarUrl} 
                        sx={{ width: 36, height: 36, fontSize: '0.9rem', fontWeight: 700 }}
                    >
                        {member.firstName?.charAt(0)}
                    </Avatar>
                </StyledBadge>
            </ListItemAvatar>
            <ListItemText
                primary={`${member.firstName} ${member.lastName}`}
                secondary={isOnline ? "En ligne" : "Hors ligne"}
                primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
                secondaryTypographyProps={{ 
                    variant: 'caption', 
                    color: isOnline ? 'success.main' : 'text.disabled',
                    fontWeight: isOnline ? 700 : 400
                }}
            />
        </ListItem>
    );
};