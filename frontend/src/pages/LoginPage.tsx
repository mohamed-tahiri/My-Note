import { useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Alert,
    CircularProgress,
    Stack,
    InputAdornment,
    IconButton,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from 'axios';

export default function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setLoading(true);

        const formData = new FormData(event.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        try {
            const response = await login({ email, password });

            const userRole = response?.role;
            if (userRole === 'ADMIN') {
                navigate('/admin');
            } else {
                navigate('/notes');
            }
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || 'Identifiants incorrects');
            } else {
                setError('Une erreur est survenue');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                // Dégradé Slate très subtil pour le fond
                background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)',
                p: 2,
            }}
        >
            <Paper
                elevation={0}
                sx={{
                    p: { xs: 4, sm: 6 },
                    width: '100%',
                    maxWidth: '450px',
                    borderRadius: '24px',
                    border: '1px solid',
                    borderColor: 'divider',
                    bgcolor: 'background.paper',
                    boxShadow: '0px 20px 40px rgba(15, 23, 42, 0.05)',
                }}
            >
                {/* Logo ou Icone de l'app */}
                <Box sx={{ textAlign: 'center', mb: 5 }}>
                    <Box
                        sx={{
                            width: 56,
                            height: 56,
                            bgcolor: 'primary.main',
                            borderRadius: '14px',
                            mx: 'auto',
                            mb: 3,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0px 8px 16px rgba(37, 99, 235, 0.2)',
                        }}
                    >
                        <Typography variant="h5" color="white" fontWeight={900}>
                            N
                        </Typography>
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main', mb: 1 }}>
                        MyNote
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Gérez vos idées en toute sécurité
                    </Typography>
                </Box>

                {error && (
                    <Alert
                        severity="error"
                        sx={{
                            mb: 3,
                            borderRadius: '12px',
                            '& .MuiAlert-message': { fontWeight: 500 },
                        }}
                    >
                        {error}
                    </Alert>
                )}

                <Stack component="form" onSubmit={handleSubmit} noValidate spacing={2.5}>
                    <Box>
                        <Typography
                            variant="caption"
                            sx={{
                                fontWeight: 700,
                                ml: 1,
                                color: 'text.secondary',
                                textTransform: 'uppercase',
                            }}
                        >
                            Email
                        </Typography>
                        <TextField
                            required
                            fullWidth
                            id="email"
                            name="email"
                            placeholder="votre@email.com"
                            autoComplete="email"
                            autoFocus
                            disabled={loading}
                            sx={{
                                mt: 1,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                    bgcolor: '#F8FAFC',
                                },
                            }}
                        />
                    </Box>

                    <Box>
                        <Typography
                            variant="caption"
                            sx={{
                                fontWeight: 700,
                                ml: 1,
                                color: 'text.secondary',
                                textTransform: 'uppercase',
                            }}
                        >
                            Mot de passe
                        </Typography>
                        <TextField
                            required
                            fullWidth
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            placeholder="••••••••"
                            autoComplete="current-password"
                            disabled={loading}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                        >
                                            {showPassword ? (
                                                <VisibilityOff fontSize="small" />
                                            ) : (
                                                <Visibility fontSize="small" />
                                            )}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                mt: 1,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                    bgcolor: '#F8FAFC',
                                },
                            }}
                        />
                    </Box>

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={loading}
                        sx={{
                            py: 1.5,
                            mt: 2,
                            borderRadius: '12px',
                            fontSize: '1rem',
                            fontWeight: 700,
                            textTransform: 'none',
                            boxShadow: '0px 4px 12px rgba(37, 99, 235, 0.2)',
                            '&:hover': {
                                boxShadow: '0px 6px 16px rgba(37, 99, 235, 0.3)',
                            },
                        }}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Se connecter'}
                    </Button>
                </Stack>
            </Paper>
        </Box>
    );
}
