import { Box, Typography, Paper, Breadcrumbs, Link, Stack, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ListIcon from '@mui/icons-material/List';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import CalendarView from '@/components/calendar/CalendarView';
import { useState } from 'react';

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

export default function CalendarPage() {
    const [appointments] = useState<Appointment[]>(mockAppointments);

    return (
        <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                <Box>
                <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 1 }}>
                    <Link underline="hover" color="inherit" component={RouterLink} to="/appointments">
                    Rendez-vous
                    </Link>
                    <Typography color="text.primary">Calendrier</Typography>
                </Breadcrumbs>
                <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main' }}>
                    Vue Calendrier
                </Typography>
                </Box>

                <Button 
                variant="outlined" 
                component={RouterLink}
                to="/appointments"
                startIcon={<ListIcon />}
                sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700 }}
                >
                Vue Liste
                </Button>
            </Stack>
            <Paper sx={{ p: 3, borderRadius: '20px', border: '1px solid', borderColor: 'divider' }}>
                <CalendarView appointments={appointments} />
            </Paper>
        </Box>
    );
}