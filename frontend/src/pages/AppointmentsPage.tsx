import { useState } from 'react';
import { 
  Box, Typography, Stack, Button, Paper, 
  IconButton,Fab, 
  Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MoreVertIcon from '@mui/icons-material/MoreVert';

// Exemple de données typées
interface Appointment {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  type: 'Professional' | 'Personal' | 'Medical';
}

const mockAppointments: Appointment[] = [
  { id: 1, title: 'Réunion d\'équipe Sync', date: '2026-01-10', time: '10:00', location: 'Salle de conférence B', type: 'Professional' },
  { id: 2, title: 'Check-up Dentiste', date: '2026-01-10', time: '14:30', location: 'Cabinet Dr. Martin', type: 'Medical' },
  { id: 3, title: 'Dîner avec Sophie', date: '2026-01-12', time: '20:00', location: 'Restaurant Le Bistro', type: 'Personal' },
];

export default function AppointmentsPage() {
  const [appointments] = useState<Appointment[]>(mockAppointments);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Professional': return 'primary';
      case 'Medical': return 'warning';
      case 'Personal': return 'success';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ pb: 8 }}>
      {/* Header avec bouton d'ajout moderne */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main' }}>
            Rendez-vous
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            Planifiez et gérez votre emploi du temps.
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<CalendarMonthIcon />}
          sx={{ display: { xs: 'none', md: 'flex' }, borderRadius: '10px', textTransform: 'none', fontWeight: 700 }}
        >
          Vue Calendrier
        </Button>
      </Stack>

      {/* Liste Chronologique */}
      <Stack spacing={3}>
        {appointments.length === 0 ? (
          <Paper sx={{ p: 6, textAlign: 'center', borderRadius: '16px', border: '1px dashed', borderColor: 'divider' }}>
            <Typography variant="body1" color="text.secondary">Aucun rendez-vous prévu.</Typography>
          </Paper>
        ) : (
          appointments.map((apt) => (
            <Paper 
              key={apt.id}
              elevation={0}
              sx={{ 
                p: 2.5, 
                borderRadius: '16px', 
                border: '1px solid', 
                borderColor: 'divider',
                transition: 'all 0.2s',
                '&:hover': { boxShadow: '0px 8px 24px rgba(15, 23, 42, 0.06)', borderColor: 'primary.light' }
              }}
            >
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems={{ sm: 'center' }}>
                
                {/* Badge Date/Heure */}
                <Box sx={{ 
                  minWidth: '80px', 
                  textAlign: 'center', 
                  bgcolor: 'background.default', 
                  p: 1.5, 
                  borderRadius: '12px',
                  border: '1px solid',
                  borderColor: 'divider'
                }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>
                    {new Date(apt.date).toLocaleDateString('fr-FR', { month: 'short' })}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.main', lineHeight: 1 }}>
                    {new Date(apt.date).getDate()}
                  </Typography>
                </Box>

                {/* Détails du RDV */}
                <Box sx={{ flex: 1 }}>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                    <Chip 
                      label={apt.type} 
                      size="small" 
                      color={getTypeColor(apt.type)} 
                      sx={{ fontSize: '0.65rem', fontWeight: 800, height: '20px' }}
                    />
                    <Typography variant="caption" color="text.disabled" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <AccessTimeIcon sx={{ fontSize: '14px' }} /> {apt.time}
                    </Typography>
                  </Stack>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main', mb: 0.5 }}>
                    {apt.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <LocationOnIcon sx={{ fontSize: '16px', color: 'primary.light' }} /> {apt.location}
                  </Typography>
                </Box>

                {/* Actions */}
                <IconButton>
                  <MoreVertIcon />
                </IconButton>
              </Stack>
            </Paper>
          ))
        )}
      </Stack>

      {/* Bouton d'ajout flottant pour Mobile */}
      <Fab 
        color="primary" 
        sx={{ position: 'fixed', bottom: { xs: 80, md: 40 }, right: { xs: 20, md: 40 } }}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
}