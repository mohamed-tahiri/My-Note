import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Typography,
} from '@mui/material';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import type { ConfirmDialogProps } from '@/types/props';

export function ConfirmDialog({
    isOpen,
    title,
    description,
    onConfirm,
    onClose,
    isLoading,
}: ConfirmDialogProps) {
    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            PaperProps={{ sx: { borderRadius: '16px', p: 1, maxWidth: '400px' } }}
        >
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <WarningAmberRoundedIcon color="error" />
                <Typography variant="h6" fontWeight={800}>
                    {title}
                </Typography>
            </DialogTitle>

            <DialogContent>
                <DialogContentText sx={{ color: 'text.secondary', fontSize: '0.95rem' }}>
                    {description}
                </DialogContentText>
            </DialogContent>

            <DialogActions sx={{ p: 2, pt: 1 }}>
                <Button
                    onClick={onClose}
                    disabled={isLoading}
                    sx={{ fontWeight: 600, textTransform: 'none', color: 'text.secondary' }}
                >
                    Annuler
                </Button>
                <Button
                    onClick={onConfirm}
                    variant="contained"
                    color="error"
                    disabled={isLoading}
                    sx={{
                        fontWeight: 700,
                        textTransform: 'none',
                        borderRadius: '10px',
                        px: 3,
                        boxShadow: 'none',
                        '&:hover': { bgcolor: 'error.dark', boxShadow: 'none' },
                    }}
                >
                    {isLoading ? 'Suppression...' : 'Supprimer'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
