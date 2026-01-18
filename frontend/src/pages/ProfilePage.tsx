import { useState, useEffect, useEffectEvent } from 'react';
import {
    Box, Typography, Paper, TextField, Button, Avatar, Stack,
    Divider, Grid, Alert, CircularProgress, MenuItem, Switch,
    FormControlLabel, IconButton, Chip,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

import { useAuth } from '@/hooks/useAuth';
import { useUserMutations } from '@/hooks/queries/useUserQueries';
import { AsyncWrapper } from '@/components/ui/AsyncWrapper';
import type { ThemePreference, User } from '@/types/user';

export default function ProfilePage() {
    const { user, updateUserInfo } = useAuth();
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Utilisation de ton nouveau hook de mutation
    const { updateProfile } = useUserMutations();

    const [formData, setFormData] = useState<{
        firstName: string;
        lastName: string;
        avatarUrl: string;
        themePreference: ThemePreference; 
        language: string;
    }>({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        avatarUrl: user?.avatarUrl || '',
        themePreference: (user?.themePreference as ThemePreference) || 'light',
        language: user?.language || 'fr',
    });

    // Stabilisation de la mise à jour des données avec useEffectEvent
    const updateFormDataEvent = useEffectEvent((userData: User) => {
        setFormData({
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            avatarUrl: userData.avatarUrl || '',
            themePreference: (userData.themePreference as ThemePreference) || 'light',
            language: userData.language || 'fr',
        });
    });

    useEffect(() => {
        if (user) {
            updateFormDataEvent(user);
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.id) return;

        // Préparation des données (on s'assure de matcher UpdateUserDto)
        const dataToSave = {
            ...formData,
            avatarUrl: formData.avatarUrl.trim() === '' ? undefined : formData.avatarUrl,
        };

        // Appel de la mutation via ton hook (attention au nom de la propriété 'data')
        updateProfile.mutate(
            { id: user.id, data: dataToSave }, 
            {
                onSuccess: (res) => {
                    const updatedUser = res; 
                    updateUserInfo(updatedUser);
                    setMessage({ type: 'success', text: 'Profil mis à jour avec succès !' });
                },
                onError: (error) => {
                    setMessage({ type: 'error', text: error.message || 'Erreur lors de la sauvegarde.' });
                }
            }
        );
    };

    return (
        <Box sx={{ maxWidth: '900px', mx: 'auto', py: 4 }}>
            <Stack spacing={1} sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight={800} color="primary.main">
                    Paramètres du profil
                </Typography>
                <Typography color="text.secondary">
                    Gérez vos informations personnelles et vos préférences d'affichage.
                </Typography>
            </Stack>

            {message && (
                <Alert severity={message.type} sx={{ mb: 4, borderRadius: '12px' }}>
                    {message.text}
                </Alert>
            )}

            <AsyncWrapper loading={!user} error={null}>
                <Grid container spacing={4}>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Stack spacing={3}>
                            <Paper elevation={0} sx={{ p: 4, textAlign: 'center', borderRadius: '20px', border: '1px solid', borderColor: 'divider' }}>
                                <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
                                    <Avatar
                                        src={formData.avatarUrl}
                                        sx={{ width: 100, height: 100, mx: 'auto', border: '4px solid white', boxShadow: '0 4px 14px rgba(0,0,0,0.1)' }}
                                    >
                                        {user?.email?.charAt(0).toUpperCase()}
                                    </Avatar>
                                    <IconButton size="small" sx={{ position: 'absolute', bottom: 0, right: 0, bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } }}>
                                        <PhotoCameraIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                                <Typography variant="h6" fontWeight={700}>
                                    {formData.firstName || 'Utilisateur'}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {user?.email}
                                </Typography>
                                <Chip label={user?.role} size="small" sx={{ fontWeight: 600, mt: 1, textTransform: 'uppercase' }} />
                            </Paper>

                            <Paper elevation={0} sx={{ p: 3, borderRadius: '20px', border: '1px solid', borderColor: 'divider' }}>
                                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>Interface</Typography>
                                <Stack spacing={1}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={formData.themePreference === 'dark'}
                                                onChange={(e) => setFormData(prev => ({ ...prev, themePreference: e.target.checked ? 'dark' : 'light' }))}
                                            />
                                        }
                                        label="Mode Sombre"
                                    />
                                    <TextField
                                        select
                                        size="small"
                                        label="Langue"
                                        value={formData.language}
                                        onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))}
                                        fullWidth
                                    >
                                        <MenuItem value="fr">Français</MenuItem>
                                        <MenuItem value="en">English</MenuItem>
                                    </TextField>
                                </Stack>
                            </Paper>
                        </Stack>
                    </Grid>

                    <Grid size={{ xs: 12, md: 8 }}>
                        <Paper elevation={0} sx={{ p: 4, borderRadius: '20px', border: '1px solid', borderColor: 'divider' }}>
                            <Box component="form" onSubmit={handleSubmit}>
                                <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>Informations personnelles</Typography>
                                <Grid container spacing={3}>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <TextField fullWidth label="Prénom" name="firstName" value={formData.firstName} onChange={handleChange} />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <TextField fullWidth label="Nom" name="lastName" value={formData.lastName} onChange={handleChange} />
                                    </Grid>
                                    <Grid size={{ xs: 12 }}>
                                        <TextField fullWidth label="URL de l'avatar" name="avatarUrl" value={formData.avatarUrl} onChange={handleChange} />
                                    </Grid>
                                </Grid>

                                <Divider sx={{ my: 4 }} />

                                <Stack direction="row" justifyContent="flex-end">
                                    <Button
                                        variant="contained"
                                        type="submit"
                                        disabled={updateProfile.isPending}
                                        startIcon={updateProfile.isPending ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                                        sx={{ borderRadius: '10px', px: 4, py: 1.2, fontWeight: 700 }}
                                    >
                                        {updateProfile.isPending ? 'Enregistrement...' : 'Sauvegarder'}
                                    </Button>
                                </Stack>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </AsyncWrapper>
        </Box>
    );
}