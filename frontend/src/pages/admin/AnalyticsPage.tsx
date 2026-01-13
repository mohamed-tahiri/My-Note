import { BaseComposedChart } from '@/components/admin/charts/BaseComposedChart';
import { GenericTable } from '@/components/admin/ui/GenericTable';
import { MetricProgress } from '@/components/admin/ui/MetricProgress';
import { PageHeader } from '@/components/admin/ui/PageHeader';
import { performanceData, serverColumns, servers } from '@/data/mockData';
import { Paper, Typography, Box, Stack, Grid, LinearProgress } from '@mui/material';

export default function AnalyticsPage() {
    return (
        <Box>
            <PageHeader
                title="Analyses Avancées"
                subtitle="Intelligence opérationnelle et prévisions de charge."
            />

            <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                    <BaseComposedChart
                        title="Analyse Comparative : Volume vs Latence"
                        data={performanceData}
                        xAxisKey="name"
                        areaKey="load"
                        barKey="volume"
                        lineKey="latency"
                    />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper sx={{ p: 3, borderRadius: '16px', height: '100%' }}>
                        <Typography variant="h6" fontWeight={700} mb={3}>Performance par Région</Typography>
                        <Stack spacing={3}>
                            <MetricProgress label="Europe (Paris)" value={94} subLabel="Optimal" autoColor={true} />
                            <MetricProgress label="US East (N. Virginia)" value={82} subLabel="Warning" autoColor={true} />
                            <MetricProgress label="Asia Pacific (Tokyo)" value={98} subLabel="Optimal" autoColor={true} />
                            <MetricProgress label="South America (Sao Paulo)" value={45} subLabel="Critical" autoColor={true} />
                        </Stack>
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 6 }}>
                            <Paper sx={{ p: 3, borderRadius: '16px', textAlign: 'center', bgcolor: '#6366f1', color: 'white' }}>
                                <Typography variant="caption" sx={{ opacity: 0.8 }}>Efficacité IA</Typography>
                                <Typography variant="h4" fontWeight={800}>92%</Typography>
                            </Paper>
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                            <Paper sx={{ p: 3, borderRadius: '16px', textAlign: 'center' }}>
                                <Typography variant="caption" color="text.secondary">Coût/Requête</Typography>
                                <Typography variant="h4" fontWeight={800}>0.002€</Typography>
                            </Paper>
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <Paper sx={{ p: 3, borderRadius: '16px' }}>
                                <Typography variant="subtitle2" gutterBottom fontWeight={700}>Prédiction de charge (Prochaines 24h)</Typography>
                                <Typography variant="body2" color="text.secondary" mb={2}>
                                    Augmentation prévue de 15% à partir de 18:00.
                                </Typography>
                                <LinearProgress variant="determinate" value={65} sx={{ height: 10, borderRadius: 5, bgcolor: '#f1f5f9' }} />
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <GenericTable title="Rapport d'Intégrité" data={servers} columns={serverColumns} />
                </Grid>
            </Grid>
        </Box>
    );
}