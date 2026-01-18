import { useState } from 'react';
import { 
  Box, Typography, Paper, TextField, Button, 
  Avatar, Stack, Divider, Grid, 
  Alert, CircularProgress, MenuItem, Switch, FormControlLabel,
  IconButton,
  Chip
} from '@mui/material';
import { useAuth } from '@/hooks/useAuth';
import SaveIcon from '@mui/icons-material/Save';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { logger } from '@/utils/logger';
import { updateProfile } from '@/api/userService';

export default function ProfilePage() {
  const { user, updateUserInfo } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    avatarUrl: user?.avatarUrl || '',
    themePreference: user?.themePreference || 'light',
    language: user?.language || 'fr',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? (checked ? 'dark' : 'light') : value 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
        
        if (!user?.id) return;

        const payload = {
            ...formData,
            avatarUrl: formData.avatarUrl.trim() === "" ? undefined : formData.avatarUrl
        };

        const updatedUser = await updateProfile(user.id, payload); 

        updateUserInfo(updatedUser);
        
        setMessage({ type: 'success', text: 'Profil mis à jour avec succès !' });
    } catch (err) {
      logger.error(err);
      setMessage({ type: 'error', text: 'Erreur lors de la sauvegarde.' });
    } finally {
      setLoading(false);
    }
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
        <Alert severity={message.type} sx={{ mb: 4, borderRadius: '12px', color: "primary.main" }}>
          {message.text}
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Colonne de gauche : Aperçu & Préférences rapides */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={3}>
            <Paper elevation={0} sx={{ p: 4, textAlign: 'center', borderRadius: '20px', border: '1px solid', borderColor: 'divider' }}>
              <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
                <Avatar 
                  src={formData.avatarUrl} 
                  sx={{ width: 100, height: 100, mx: 'auto', border: '4px solid white', boxShadow: '0 4px 14px rgba(0,0,0,0.1)' }}
                >
                  {user?.email.charAt(0).toUpperCase()}
                </Avatar>
                <IconButton
                  size="small" 
                  sx={{ position: 'absolute', bottom: 0, right: 0, bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } }}
                >
                  <PhotoCameraIcon fontSize="small" />
                </IconButton>
              </Box>
              <Typography variant="h6" fontWeight={700}>{formData.firstName || 'Utilisateur'}</Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>{user?.email}</Typography>
              <Chip label={user?.role} size="small" sx={{ fontWeight: 600, mt: 1 }} />
            </Paper>

            <Paper elevation={0} sx={{ p: 3, borderRadius: '20px', border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>Interface</Typography>
              <Stack spacing={1}>
                <FormControlLabel
                  control={
                    <Switch 
                      name="themePreference" 
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
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  fullWidth
                >
                  <MenuItem value="fr">Français</MenuItem>
                  <MenuItem value="en">English</MenuItem>
                </TextField>
              </Stack>
            </Paper>
          </Stack>
        </Grid>

        {/* Colonne de droite : Formulaire complet */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: '20px', border: '1px solid', borderColor: 'divider' }}>
            <Box component="form" onSubmit={handleSubmit}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>Informations personnelles</Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Prénom"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Nom"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="URL de l'avatar"
                    name="avatarUrl"
                    value={formData.avatarUrl}
                    onChange={handleChange}
                    placeholder="https://images.com/photo.jpg"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 4 }} />

              <Stack direction="row" justifyContent="flex-end" spacing={2}>
                <Button 
                  variant="contained" 
                  type="submit" 
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                  sx={{ borderRadius: '10px', px: 4, py: 1.2, fontWeight: 700 }}
                >
                  Sauvegarder
                </Button>
              </Stack>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}