import { Box, Typography, Paper, Breadcrumbs, Link, Stack, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ListIcon from '@mui/icons-material/List';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

import CalendarView from '@/components/calendar/CalendarView';
import { useAppointments } from '@/hooks/queries/useAppointmentQueries';
import { AsyncWrapper } from '@/components/ui/AsyncWrapper';

export default function CalendarPage() {
    const { data: appointments, isLoading, error, refetch } = useAppointments();

    return (
        <Box>
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 4 }}
            >
                <Box>
                    <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 1 }}>
                        <Link
                            underline="hover"
                            color="inherit"
                            component={RouterLink}
                            to="/appointments"
                        >
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

            {/* Utilisation de l'AsyncWrapper pour le Calendrier */}
            <AsyncWrapper loading={isLoading} error={error} onRetry={() => refetch()}>
                <Paper
                    sx={{
                        p: 3,
                        borderRadius: '20px',
                        border: '1px solid',
                        borderColor: 'divider',
                        minHeight: '600px', // Évite le saut de mise en page
                    }}
                >
                    <CalendarView appointments={appointments || []} />
                </Paper>
            </AsyncWrapper>
        </Box>
    );
}
