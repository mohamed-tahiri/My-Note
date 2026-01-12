import React from 'react';
import { Box, Paper, Typography, alpha } from '@mui/material';
import type { Message } from '@/types/message';

interface ChatMessageProps {
  message: Message;
  isMe: boolean;
  showTime?: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ 
  message, 
  isMe, 
  showTime = true 
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
        mb: 1 // Petit espace entre les messages
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

      {showTime && (
        <Typography 
          variant="caption" 
          sx={{ 
            mt: 0.5, 
            px: 0.5,
            color: 'text.disabled', 
            fontSize: '0.65rem',
            fontWeight: 600
          }}
        >
          {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Typography>
      )}
    </Box>
  );
};