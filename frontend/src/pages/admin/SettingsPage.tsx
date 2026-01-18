import { useState, useEffect, useEffectEvent } from 'react';
import {
    Box, Typography, Paper, TextField, Button, Switch, FormControlLabel,
    Divider, Stack, alpha, Alert, CircularProgress, Avatar, Grid, IconButton
} from '@mui/material';
import { Save, LogOut, Camera } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useUserMutations } from '@/hooks/queries/useUserQueries';
import { AsyncWrapper } from '@/components/ui/AsyncWrapper';
import type { User, ThemePreference } from '@/types/user';

export default function SettingsPage() {
    const { user, logout, updateUserInfo } = useAuth();
    const navigate = useNavigate();
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const { updateProfile } = useUserMutations();

    // État local regroupant Profil + Instance + Interface
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        avatarUrl: '',
        themePreference: 'light' as ThemePreference,
        // Paramètres d'instance simulés
        dashboardName: 'CORE_SYSTEM_PROD',
        pushEnabled: true,
    });

    // Synchronisation stable des données utilisateur
    const syncData = useEffectEvent((userData: User) => {
        setFormData((prev) => ({
            ...prev,
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            email: userData.email || '',
            avatarUrl: userData.avatarUrl || '',
            themePreference: (userData.themePreference as ThemePreference) || 'light',
        }));
    });

    useEffect(() => {
        if (user) syncData(user);
    }, [user]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!user?.id) return;

      updateProfile.mutate(
          { 
              id: user.id, 
              data: {
                  firstName: formData.firstName,
                  lastName: formData.lastName,
                  avatarUrl: formData.avatarUrl,
                  themePreference: formData.themePreference
              } 
          },
          {
              onSuccess: (updatedUser) => {
                  updateUserInfo(updatedUser);
                  setMessage({ type: 'success', text: 'Paramètres mis à jour avec succès.' });
              },
              onError: (err) => {
                  setMessage({ type: 'error', text: err.message || 'Erreur lors de la sauvegarde.' });
              }
          }
      );
    };

    return (
        <Box maxWidth="md" sx={{ py: 2 }}>
            <Typography variant="h4" fontWeight={800} mb={1}>Paramètres Système</Typography>
            <Typography color="text.secondary" mb={4}>Gérez votre profil administrateur et les configurations de l'instance.</Typography>

            {message && <Alert severity={message.type} sx={{ mb: 3, borderRadius: '12px' }}>{message.text}</Alert>}

            <AsyncWrapper loading={!user} error={null}>
                <Box component="form" onSubmit={handleSubmit}>
                    
                    {/* SECTION 1 : VOTRE PROFIL ADMIN */}
                    <Paper sx={{ p: 4, borderRadius: '20px', mb: 3, border: '1px solid', borderColor: 'divider' }} elevation={0}>
                        <Typography variant="h6" fontWeight={700} mb={3}>Votre Profil</Typography>
                        
                        <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 4 }}>
                            <Box sx={{ position: 'relative' }}>
                                <Avatar 
                                    src={formData.avatarUrl} 
                                    sx={{ width: 80, height: 80, border: '3px solid', borderColor: 'primary.main' }}
                                >
                                    {user?.email?.charAt(0).toUpperCase()}
                                </Avatar>
                                <IconButton size="small" sx={{ position: 'absolute', bottom: -5, right: -5, bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } }}>
                                    <Camera size={14} />
                                </IconButton>
                            </Box>
                            <Box>
                                <Typography variant="subtitle1" fontWeight={700}>{formData.firstName} {formData.lastName}</Typography>
                                <Typography variant="body2" color="text.secondary">{formData.email}</Typography>
                            </Box>
                        </Stack>

                        <Grid container spacing={2}>
                            <Grid size={{ xs:12, sm:6 }}>
                                <TextField fullWidth label="Prénom" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} />
                            </Grid>
                            <Grid size={{ xs:12, sm:6 }}>
                                <TextField fullWidth label="Nom" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} />
                            </Grid>
                            <Grid size={{ xs:12 }}>
                                <TextField fullWidth label="URL de l'avatar" value={formData.avatarUrl} onChange={(e) => setFormData({...formData, avatarUrl: e.target.value})} />
                            </Grid>
                        </Grid>
                    </Paper>

                    {/* SECTION 2 : PRÉFÉRENCES INTERFACE */}
                    <Paper sx={{ p: 4, borderRadius: '20px', mb: 3, border: '1px solid', borderColor: 'divider' }} elevation={0}>
                        <Typography variant="h6" fontWeight={700} mb={3}>Interface & Préférences</Typography>
                        <Stack spacing={2}>
                            <FormControlLabel
                                control={
                                    <Switch 
                                        checked={formData.themePreference === 'dark'} 
                                        onChange={(e) => setFormData({...formData, themePreference: e.target.checked ? 'dark' : 'light'})}
                                    />
                                }
                                label={
                                    <Box>
                                        <Typography variant="body1" fontWeight={600}>Mode Sombre</Typography>
                                        <Typography variant="caption" color="text.secondary">Adapter l'affichage pour les environnements sombres</Typography>
                                    </Box>
                                }
                            />
                            <Divider sx={{ my: 1 }} />
                            <FormControlLabel
                                control={<Switch checked={formData.pushEnabled} onChange={(e) => setFormData({...formData, pushEnabled: e.target.checked})} />}
                                label="Notifications Push Système"
                            />
                        </Stack>
                    </Paper>

                    {/* SECTION 3 : INSTANCE DASHBOARD */}
                    <Paper sx={{ p: 4, borderRadius: '20px', mb: 4, border: '1px solid', borderColor: 'divider' }} elevation={0}>
                        <Typography variant="h6" fontWeight={700} mb={3}>Identité de l'Instance</Typography>
                        <TextField 
                            fullWidth 
                            label="Nom du Dashboard (PROD)" 
                            value={formData.dashboardName}
                            onChange={(e) => setFormData({...formData, dashboardName: e.target.value})}
                            sx={{ mb: 4 }}
                        />
                        
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button 
                                type="submit"
                                variant="contained" 
                                disabled={updateProfile.isPending}
                                startIcon={updateProfile.isPending ? <CircularProgress size={18} color="inherit" /> : <Save size={18} />} 
                                sx={{ borderRadius: '12px', px: 4, py: 1.5, fontWeight: 700 }}
                            >
                                Enregistrer tout
                            </Button>
                        </Box>
                    </Paper>
                </Box>
            </AsyncWrapper>

            {/* DANGER ZONE */}
            <Paper elevation={0} sx={{ p: 4, borderRadius: '20px', border: '1px solid', borderColor: alpha('#ef4444', 0.2), bgcolor: alpha('#ef4444', 0.02) }}>
                <Typography variant="h6" color="error" fontWeight={700} mb={1}>Session</Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>La déconnexion invalidera votre token d'accès administrateur.</Typography>
                <Button variant="outlined" color="error" startIcon={<LogOut size={18} />} onClick={handleLogout} sx={{ borderRadius: '10px', fontWeight: 700 }}>Se déconnecter</Button>
            </Paper>
        </Box>
    );
}