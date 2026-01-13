import { BaseAreaChart } from '@/components/admin/charts/BaseAreaChart';
import { BaseRadarChart } from '@/components/admin/charts/BaseRadarChart';
import { MetricProgress } from '@/components/admin/ui/MetricProgress';
import { PageHeader } from '@/components/admin/ui/PageHeader';
import { networkData, resourceBalanceData } from '@/data/mockData';
import { Typography, Stack, Paper, Chip, Box, Grid, LinearProgress } from '@mui/material';
import { Activity, ShieldCheck } from 'lucide-react';

export default function MonitoringPage() {
  return (
    <Box>
      <PageHeader
        title="Infrastructure"
        subtitle="Monitoring temps-réel des clusters de production."
        rightContent={
          <Chip icon={<Activity size={16} />} label="Live: 124 Nodes" color="success" variant="outlined" sx={{ fontWeight: 700 }} />
        }
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <BaseAreaChart 
            title="Utilisation Réseau (Gbps)"
            data={networkData}
            dataKey="load"
            color="#6366f1"
          />
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <BaseRadarChart 
            title="Balance des Ressources" 
            data={resourceBalanceData} 
            color="#6366f1" 
          />
        </Grid>

        <Grid size={{ xs: 12, lg: 8 }}>
          <Paper sx={{ p: 3, borderRadius: '16px' }}>
            <Typography variant="h6" fontWeight={700} mb={3}>Disponibilité des Nodes (Cluster 01)</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(40px, 1fr))', gap: 1.5 }}>
              {[...Array(48)].map((_, i) => (
                <Box
                  key={i}
                  sx={{
                    height: 40,
                    borderRadius: '6px',
                    bgcolor: i === 12 || i === 34 ? '#F59E0B' : '#10B981',
                    opacity: 0.8,
                    cursor: 'pointer',
                    '&:hover': { opacity: 1, transform: 'scale(1.1)' },
                    transition: '0.2s'
                  }}
                />
              ))}
            </Box>
            <Stack direction="row" spacing={2} mt={3}>
              <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 10, height: 10, bgcolor: '#10B981', borderRadius: '2px' }} /> Opérationnel
              </Typography>
              <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 10, height: 10, bgcolor: '#F59E0B', borderRadius: '2px' }} /> Latence élevée
              </Typography>
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Stack spacing={3}>
            <Paper sx={{ p: 3, bgcolor: '#0F172A', color: 'white', borderRadius: '16px' }}>
              <Stack direction="row" justifyContent="space-between" mb={2}>
                <Typography variant="subtitle2" sx={{ opacity: 0.7 }}>Santé du Système</Typography>
                <ShieldCheck size={20} color="#10B981" />
              </Stack>
              <Typography variant="h3" fontWeight={800} mb={1}>99.9%</Typography>
              <LinearProgress 
                variant="determinate" 
                value={99.9} 
                sx={{ height: 8, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.1)', '& .MuiLinearProgress-bar': { bgcolor: '#10B981' } }} 
              />
            </Paper>

            <Paper sx={{ p: 3, borderRadius: '16px' }}>
              <Typography variant="h6" fontWeight={700} mb={2}>Charge Serveurs</Typography>
              <Stack spacing={2}>
                <MetricProgress label="US-East-01" value={45} />
                <MetricProgress label="EU-West-03" value={82} color="#F59E0B" />
                <MetricProgress label="ASIA-South-01" value={28} />
              </Stack>
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}

