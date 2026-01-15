import React from 'react';
import { Box, Paper, Typography, alpha } from '@mui/material';
import type { Message } from '@/types/message';

interface ChatMessageProps {
  message: Message;
  isMe: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ 
  message, 
  isMe, 
}) => {
  return (
    <Box 
      sx={{ 
        display: 'flex',
        flexDirection: 'column',
        alignSelf: isMe ? 'flex-end' : 'flex-start',
        alignItems: isMe ? 'flex-end' : 'flex-start',
        maxWidth: isMe ? '90%' : '85%', 
        width: 'fit-content',
        '&:hover .time-caption': {
          opacity: 1,
          maxHeight: '20px', 
          mt: 0.3,
        }
      }}
    >
      <Paper 
        elevation={0}
        sx={{ 
          p: 1.2, 
          px: 1.8, 
          borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px', 
          bgcolor: isMe ? 'primary.main' : 'white',
          color: isMe ? 'white' : 'text.primary',
          border: isMe ? 'none' : '1px solid',
          borderColor: alpha('#64748b', 0.2),
          boxShadow: isMe ? '0px 4px 10px rgba(37, 99, 235, 0.2)' : '0px 2px 4px rgba(0,0,0,0.05)',
          wordBreak: 'break-word', 
          whiteSpace: 'pre-wrap',
        }}
      >
        <Typography variant="body2" sx={{ fontSize: '0.875rem', lineHeight: 1.5 }}>
          {message.content}
        </Typography>
      </Paper>

      <Typography 
        className="time-caption"
        variant="caption" 
        sx={{ 
          px: 0.5,
          color: 'text.disabled', 
          fontSize: '0.65rem',
          fontWeight: 600,
          opacity: 0,
          maxHeight: 0, 
          mt: 0,    
          overflow: 'hidden',
          transition: 'all 0.2s ease-in-out',
          pointerEvents: 'none'
        }}
      >
        {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Typography>
    </Box>
  );
};