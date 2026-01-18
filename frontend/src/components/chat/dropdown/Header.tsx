import { alpha, Box, IconButton, Tooltip, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import type { HeaderProps } from '@/types/props';

export default function Header({ handleClose }: HeaderProps) {
    const navigate = useNavigate();
    return (
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle1" fontWeight={800} color="primary.main">
                Messages récents
            </Typography>

            <Tooltip title="Voir toutes les conversations">
                <IconButton
                    size="small"
                    onClick={() => {
                        navigate('/chats');
                        handleClose();
                    }}
                    sx={{
                        color: 'primary.main',
                        bgcolor: alpha('#2563eb', 0.05),
                        '&:hover': { bgcolor: alpha('#2563eb', 0.1) },
                    }}
                >
                    <OpenInNewIcon sx={{ fontSize: 18 }} />
                </IconButton>
            </Tooltip>
        </Box>
    );
}
