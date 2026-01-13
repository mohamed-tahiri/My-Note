import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Typography, Box, Paper, Stack } from '@mui/material';
import type { BaseDonutChartProps } from '@/types/admin';


export const BaseDonutChart = ({ 
    title, 
    data, 
    height = 200, 
    innerRadius = 60, 
    outerRadius = 80 
}: BaseDonutChartProps) => {
    return (
        <Paper sx={{ p: 3, height: '100%', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0px 2px 4px rgba(0,0,0,0.02)' }}>
            <Typography variant="h6" fontWeight={700} mb={2}>{title}</Typography>
            
            <Box sx={{ width: '100%', height: height }}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data} 
                            innerRadius={innerRadius}
                            outerRadius={outerRadius}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </Box>

            <Stack spacing={1} mt={2}>
                {data.map((item) => (
                    <Stack key={item.name} direction="row" justifyContent="space-between" alignItems="center">
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: item.color }} />
                            <Typography variant="caption" fontWeight={600} color="text.secondary">
                                {item.name}
                            </Typography>
                        </Stack>
                        <Typography variant="caption" fontWeight={700}>
                            {item.value.toLocaleString()} Units
                        </Typography>
                    </Stack>
                ))}
            </Stack>
        </Paper>
    );
}