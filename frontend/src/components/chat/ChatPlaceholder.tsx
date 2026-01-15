import { alpha, Box, Stack, Typography } from "@mui/material";
import ForumIcon from '@mui/icons-material/Forum';

export function ChatPlaceholder() {
    return (
        <Stack sx={{ m: 'auto', alignItems: 'center', textAlign: 'center', p: 3 }}>
            <Box sx={{ 
                width: 120, height: 120, borderRadius: '50%', 
                bgcolor: alpha('#2563eb', 0.05), display: 'flex', 
                alignItems: 'center', justifyContent: 'center', mb: 2 
            }}>
                <ForumIcon sx={{ fontSize: 60, color: 'primary.main' }} />
            </Box>
            <Typography variant="h5" fontWeight={800}>Vos Conversations</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 300, mt: 1 }}>
                Sélectionnez une discussion à gauche ou créez-en une nouvelle pour collaborer avec votre équipe.
            </Typography>
        </Stack>
    );
}