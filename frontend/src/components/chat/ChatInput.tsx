import React from 'react';
import { Box, alpha, IconButton, InputBase, CircularProgress, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import type { ChatInputProps } from '@/types/props';

export const ChatInput: React.FC<ChatInputProps> = ({ 
    message, 
    setMessage, 
    handleSend, 
    cancelEdit,
    disabled = false,
    editingMessage,
    placeholder = "Écrivez votre message...",
    variant = 'full'
}) => {
    return (
        <Box sx={{ bgcolor: 'background.paper', borderTop: '1px solid', borderColor: 'divider' }}>
              {editingMessage && (
                <Box sx={{ px: 2, py: 1, bgcolor: alpha('#2563eb', 0.05), display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" color="primary" fontWeight={700}>Modification...</Typography>
                  <IconButton size="small" onClick={cancelEdit}><Typography variant="caption">ANNULER</Typography></IconButton>
                </Box>
              )}
            <Box 
                component="form" 
                onSubmit={handleSend} 
                sx={{ 
                    p: variant === 'compact' ? 1.2 : 2, 
                    bgcolor: 'background.paper', 
                    borderTop: '1px solid', 
                    borderColor: 'divider' 
                }}
            >
                <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    bgcolor: alpha('#64748b', 0.05), 
                    borderRadius: variant === 'compact' ? '20px' : '24px', 
                    px: 2, 
                    py: variant === 'compact' ? 0.5 : 1,
                    border: '1px solid',
                    borderColor: 'transparent',
                    '&:focus-within': { 
                        borderColor: 'primary.light', 
                        bgcolor: 'background.paper',
                        boxShadow: '0px 2px 8px rgba(37, 99, 235, 0.1)'
                    },
                    transition: 'all 0.2s'
                }}>
                    <InputBase 
                    fullWidth 
                    multiline 
                    maxRows={4}
                    placeholder={placeholder}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={disabled}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSend(e);
                        }
                    }}
                    sx={{ 
                        ml: 1, 
                        flex: 1, 
                        fontSize: variant === 'compact' ? '0.85rem' : '0.9rem' 
                    }} 
                    />
                    
                    <IconButton 
                        type="submit" 
                        color="primary" 
                        disabled={disabled || !message.trim()}
                        size={variant === 'compact' ? 'small' : 'medium'}
                        sx={{ 
                            transition: 'transform 0.2s',
                            '&:hover': { transform: 'scale(1.1)' },
                            bgcolor: variant === 'compact' ? alpha('#2563eb', 0.1) : 'transparent'
                        }}
                    >
                    {disabled ? (
                        <CircularProgress size={20} color="inherit" />
                    ) : (
                        <SendIcon fontSize={variant === 'compact' ? 'small' : 'medium'} />
                    )}
                    </IconButton>
                </Box>
            </Box>
        </Box>
    );
};