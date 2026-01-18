import { Box, Typography, Paper, TextField, Button, Switch, FormControlLabel, Divider, Stack, alpha } from '@mui/material';
import { Save, LogOut } from 'lucide-react'; 
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function SettingsPage() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <Box maxWidth="md">
            <Typography variant="h4" fontWeight={800} mb={4}>Paramètres</Typography>

            <Paper sx={{ p: 4, borderRadius: '16px', mb: 3 }}>
                <Typography variant="h6" mb={3} fontWeight={700}>Profil de l'instance</Typography>
                <Stack spacing={3}>
                    <TextField fullWidth label="Nom du Dashboard" defaultValue="CORE_SYSTEM_PROD" />
                    <TextField fullWidth label="Email d'alerte" defaultValue="admin@core-system.com" />
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Typography variant="h6" fontWeight={700}>Préférences</Typography>
                    <FormControlLabel control={<Switch defaultChecked />} label="Activer les notifications push" />
                    <FormControlLabel control={<Switch />} label="Mode maintenance automatique" />
                    <FormControlLabel control={<Switch defaultChecked />} label="Reporting hebdomadaire par mail" />

                    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button variant="contained" startIcon={<Save size={18} />} disableElevation>
                            Enregistrer les modifications
                        </Button>
                    </Box>
                </Stack>
            </Paper>

            {/* Section Session / Déconnexion */}
            <Paper 
                sx={{ 
                    p: 4, 
                    borderRadius: '16px', 
                    border: '1px solid', 
                    borderColor: alpha('#ef4444', 0.2), // Rouge subtil
                    bgcolor: alpha('#ef4444', 0.02)
                }}
            >
                <Typography variant="h6" color="error" mb={1} fontWeight={700}>Session</Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                    Déconnectez-vous de votre compte administrateur pour mettre fin à votre session actuelle.
                </Typography>
                
                <Button 
                    variant="outlined" 
                    color="error" 
                    startIcon={<LogOut size={18} />}
                    onClick={handleLogout}
                    sx={{ borderRadius: '10px' }}
                >
                    Se déconnecter
                </Button>
            </Paper>
        </Box>
    );
}