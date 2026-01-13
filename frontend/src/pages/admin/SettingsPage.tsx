import { Box, Typography, Paper, TextField, Button, Switch, FormControlLabel, Divider, Stack } from '@mui/material';
import { Save } from 'lucide-react';

export default function SettingsPage() {
    return (
        <Box maxWidth="md">
            <Typography variant="h4" fontWeight={800} mb={4}>Paramètres</Typography>

            <Paper sx={{ p: 4, borderRadius: '16px' }}>
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
        </Box>
    );
}