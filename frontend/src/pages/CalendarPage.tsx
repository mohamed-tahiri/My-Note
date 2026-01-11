import { Box, Typography, Paper, Breadcrumbs, Link, Stack, Button, CircularProgress } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ListIcon from '@mui/icons-material/List';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import CalendarView from '@/components/calendar/CalendarView';
import { useCallback, useEffect, useState } from 'react';
import { getAll } from '@/api/appointmentsService';
import { logger } from '@/utils/logger';
import type { Appointment } from '@/types/appointment';

export default function CalendarPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [appointments, setAppointments] = useState<Appointment[]>([]);


     const loadAppointments = useCallback(async () => {
        try {
          setIsLoading(true);
          const res = await getAll();
          setAppointments(res.data);
        } catch (error) {
          logger.error('Erreur lors du chargement des rendez-vous:', error);
        } finally {
          setIsLoading(false);
        }
      }, []);
    
    useEffect(() => {
        loadAppointments();
    }, [loadAppointments]);

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
            {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                    <CircularProgress color="primary" />
                </Box>
            ) : (
                <Paper sx={{ p: 3, borderRadius: '20px', border: '1px solid', borderColor: 'divider' }}>
                    <CalendarView appointments={appointments} />
                </Paper>
            )}
        </Box>
    );
}