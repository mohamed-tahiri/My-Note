import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

export function NotFound() {
    return (
        <Box sx={{ 
            minHeight: '80vh', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center',
            textAlign: 'center' 
        }}>
            <Typography variant="h4" sx={{ mb: 1 }}>404</Typography>
            <Typography variant="subtitle2" sx={{ mb: 3 }}>
                La page que vous cherchez n'existe pas.
            </Typography>
            <Button variant="contained" component={Link} to="/">
                Retourner à l'accueil
            </Button>
        </Box>
    )
}
