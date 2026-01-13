import { BaseBarChart } from '@/components/admin/charts/BaseBarChart';
import { BaseRadarChart } from '@/components/admin/charts/BaseRadarChart';
import { GenericTable } from '@/components/admin/ui/GenericTable';
import { PageHeader } from '@/components/admin/ui/PageHeader';
import { alertFrequency, logColumns, securityLogs, threatData } from '@/data/mockData';
import { Box, Typography, Paper, Grid } from '@mui/material';
import { ShieldAlert } from 'lucide-react';

export default function SecurityPage() {
    return (
        <Box>
            <PageHeader
                title="Sécurité & Conformité"
                subtitle="Protection active et surveillance des points d'accès."
                icon={<ShieldAlert size={28} />}
                iconBgColor="error.main"
                rightContent={
                    <Paper sx={{ p: 2, borderLeft: '4px solid #10B981' }}>
                    <Typography variant="caption" fontWeight={700} color="text.secondary">Niveau de Menace</Typography>
                    <Typography variant="h6" fontWeight={800} color="success.main">BAS</Typography>
                    </Paper>
                }
            />

            <Grid container spacing={3} mb={4}>
                {/* 1. Radar des Menaces */}
                <Grid size={{ xs: 12, md: 5 }}>
                    <BaseRadarChart 
                        title="Vecteurs d'Attaque" 
                        data={threatData} 
                        color="#EF4444"
                        height={300}
                    />
                </Grid>

                {/* 2. Fréquence des alertes */}
                <Grid size={{ xs: 12, md: 7 }}>
                    <BaseBarChart
                        title="Alertes par tranches horaires (24h)"
                        data={alertFrequency}
                        xAxisKey="time"
                        barKey="count"
                        color="#1e293b"
                    />
                </Grid>
            </Grid>
            <GenericTable
                title="Journal d'Audit de Sécurité" 
                data={securityLogs} 
                columns={logColumns} 
            />
        </Box>
    );
}