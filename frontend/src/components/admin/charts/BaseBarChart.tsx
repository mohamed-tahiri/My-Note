import type { BaseBarChartProps, ChartDataItem } from '@/types/admin';
import { Box, Paper, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export const BaseBarChart = <T extends ChartDataItem>({ 
    title, data, xAxisKey, barKey, color = "#1e293b", height = 300, barSize = 40
}: BaseBarChartProps<T>) => {
    return (
        <Paper sx={{ p: 3, borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0px 2px 4px rgba(0,0,0,0.02)', height: '100%' }}>
            <Typography variant="h6" fontWeight={700} mb={3}>{title}</Typography>
            <Box sx={{ width: '100%', height: height }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis 
                            dataKey={xAxisKey as string} 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#64748b', fontSize: 12 }}
                        />
                        <YAxis hide />
                        <Tooltip 
                            cursor={{ fill: '#f8fafc' }} 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} 
                        />
                        <Bar 
                            dataKey={barKey as string} 
                            fill={color} 
                            radius={[4, 4, 0, 0]} 
                            barSize={barSize}
                        >
                            {data.map((_entry, index) => (
                                <Cell key={`cell-${index}`} fill={index === data.length - 1 ? '#6366f1' : color} opacity={0.9} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </Box>
        </Paper>
    );
};