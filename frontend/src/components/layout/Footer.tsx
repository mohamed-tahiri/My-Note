import React from 'react';
import { Box, Container, Typography, Link, Stack, Divider } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box 
      component="footer" 
      sx={{ 
        bgcolor: 'background.paper', 
        borderTop: '1px solid',
        borderColor: 'divider',
        py: { xs: 4, md: 6 },
        mt: 'auto' // Pratique pour pousser le footer en bas si le contenu est court
      }}
    >
      <Container maxWidth="lg">
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' }, 
            justifyContent: 'space-between', 
            alignItems: 'center',
            gap: 2
          }}
        >
          {/* Section Logo / Nom */}
          <Box>
            <Typography 
              variant="subtitle1" 
              sx={{ fontWeight: 800, color: 'primary.main', letterSpacing: '-0.5px' }}
            >
              My Note
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Organisez vos idées, simplifiez votre vie.
            </Typography>
          </Box>

          {/* Liens de navigation rapides */}
          <Stack 
            direction="row" 
            spacing={3} 
            sx={{ 
              '& a': { 
                textDecoration: 'none', 
                color: 'text.secondary', 
                fontSize: '0.85rem',
                fontWeight: 500,
                '&:hover': { color: 'primary.main' }
              } 
            }}
          >
            <Link component={RouterLink} to="/notes">Notes</Link>
            <Link component={RouterLink} to="/tasks">Tâches</Link>
            <Link component={RouterLink} to="/appointments">Rendez-vous</Link>
            <Link component={RouterLink} to="/privacy">Confidentialité</Link>
          </Stack>
        </Box>

        <Divider sx={{ my: 3, opacity: 0.5 }} />

        {/* Copyright */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="caption" color="text.disabled">
            © {currentYear}{' '}
            <Typography 
              component="span" 
              variant="caption" 
              sx={{ fontWeight: 700, color: 'primary.light' }}
            >
              My Note
            </Typography>
            . Tous droits réservés.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;