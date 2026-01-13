import { BaseAreaChart } from '@/components/admin/charts/BaseAreaChart';
import { BaseDonutChart } from '@/components/admin/charts/BaseDonutChart';
import { GenericTable } from '@/components/admin/ui/GenericTable';
import { PageHeader } from '@/components/admin/ui/PageHeader';
import { StatsCard } from '@/components/admin/ui/StatsCard';
import { distributionData, networkData, serverColumns, servers } from '@/data/mockData';
import { Box, Grid } from '@mui/material';
import { Activity, Users, Server, Zap, } from 'lucide-react';

export default function OverviewPage() {
    return (
        <Box>
            <PageHeader
                title="Système Global"
                subtitle="Statistiques consolidées en temps réel."
            />
            
            <Grid container spacing={3} mb={3}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatsCard title="Requêtes/sec" value="2,450" trend="+12%" icon={<Zap size={20}/>} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatsCard title="Utilisateurs" value="12.8k" trend="+5%" icon={<Users size={20}/>} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatsCard title="Uptime" value="99.9%" trend="Stable" icon={<Server size={20}/>} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatsCard title="Erreurs" value="0.04%" trend="-2%" icon={<Activity size={20}/>} />
                </Grid>
            </Grid>

            <Grid container spacing={3} mb={3}>
                <Grid size={{ xs: 12, lg: 8 }}>
                    <BaseAreaChart 
                        title="Utilisation Réseau (Gbps)"
                        data={networkData}
                        dataKey="load"
                        color="#6366f1"
                    />
                </Grid>

                <Grid size={{ xs: 12, lg: 4 }}>
                    <BaseDonutChart 
                        title="Répartition Cluster" 
                        data={distributionData} 
                    />
                </Grid>
            </Grid>

            <Grid size={{ xs: 12 }}>
                <GenericTable title="Rapport d'Intégrité" data={servers} columns={serverColumns} />
            </Grid>
        </Box>
    );
}