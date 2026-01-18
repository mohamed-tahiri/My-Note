import type { BaseRadarChartProps } from '@/types/admin';
import { Box, Paper, Typography } from '@mui/material';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

export const BaseRadarChart = ({
    title,
    data,
    color = '#6366f1',
    height = 250,
}: BaseRadarChartProps) => {
    return (
        <Paper sx={{ p: 3, borderRadius: '16px', height: '100%' }}>
            <Typography variant="h6" fontWeight={700} mb={2}>
                {title}
            </Typography>
            <Box sx={{ width: '100%', height: height }}>
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                        <PolarGrid stroke="#e2e8f0" />
                        <PolarAngleAxis
                            dataKey="subject"
                            tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                        />
                        <Radar
                            name={title}
                            dataKey="A"
                            stroke={color}
                            strokeWidth={2}
                            fill={color}
                            fillOpacity={0.5}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </Box>
        </Paper>
    );
};
