// src/components/ui/BaseModal.tsx
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  title: string;
  submitLabel?: string;
  isPending?: boolean;
  children: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg';
}

export function BaseModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  submitLabel = 'Enregistrer',
  isPending = false,
  children,
  maxWidth = 'sm',
}: BaseModalProps) {
    return (
        <Dialog 
            open={isOpen} 
            onClose={onClose} 
            fullWidth 
            maxWidth={maxWidth} 
            PaperProps={{ sx: { borderRadius: '16px', backgroundImage: 'none' } }}
        >
            <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" fontWeight={800} color="primary.main">
                    {title}
                </Typography>
                <IconButton onClick={onClose} size="small" sx={{ color: 'text.secondary' }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <Box component="form" onSubmit={onSubmit} noValidate>
                <DialogContent dividers sx={{ py: 3, borderBottom: 'none' }}>
                    {children}
                </DialogContent>

                <DialogActions sx={{ p: 3, pt: 1, gap: 1 }}>
                    <Button onClick={onClose} color="inherit" sx={{ fontWeight: 600, textTransform: 'none' }}>
                        Annuler
                    </Button>
                    <Button 
                        type="submit" 
                        variant="contained" 
                        disabled={isPending}
                        sx={{ 
                            borderRadius: '10px', 
                            px: 4, 
                            fontWeight: 700, 
                            textTransform: 'none',
                            minWidth: '120px' 
                        }}
                    >
                        {isPending ? <CircularProgress size={24} color="inherit" /> : submitLabel}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
}