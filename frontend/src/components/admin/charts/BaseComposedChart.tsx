import type { BaseComposedChartProps } from '@/types/props';
import { Box, Paper, Typography } from '@mui/material';
import {
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    Line,
    ComposedChart,
    Area,
    Legend,
} from 'recharts';

interface ChartDataItem {
    [key: string]: string | number;
}

export const BaseComposedChart = <T extends ChartDataItem>({
    title,
    data,
    xAxisKey,
    areaKey,
    barKey,
    lineKey,
    height = 400,
}: BaseComposedChartProps<T>) => {
    return (
        <Paper
            sx={{
                p: 4,
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                boxShadow: '0px 2px 4px rgba(0,0,0,0.02)',
            }}
        >
            <Typography variant="h6" mb={4} fontWeight={700}>
                {title}
            </Typography>
            <Box sx={{ width: '100%', height: height }}>
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis
                            dataKey={xAxisKey as string}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 12 }}
                        />
                        <YAxis yAxisId="left" hide />
                        <YAxis yAxisId="right" orientation="right" hide />

                        <Tooltip
                            contentStyle={{
                                borderRadius: '12px',
                                border: 'none',
                                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                            }}
                        />
                        <Legend
                            verticalAlign="top"
                            align="right"
                            iconType="circle"
                            wrapperStyle={{ paddingBottom: '20px' }}
                        />

                        <Area
                            yAxisId="left"
                            type="monotone"
                            dataKey={areaKey as string}
                            fill="#EEF2FF"
                            stroke="none"
                            name="Charge Globale"
                        />

                        <Bar
                            yAxisId="left"
                            dataKey={barKey as string}
                            barSize={40}
                            radius={[8, 8, 0, 0]}
                            name="Volume (TB)"
                        >
                            {data.map((_, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={index === data.length - 1 ? '#6366f1' : '#CBD5E1'}
                                />
                            ))}
                        </Bar>

                        <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey={lineKey as string}
                            stroke="#F59E0B"
                            strokeWidth={3}
                            dot={{ r: 4, fill: '#F59E0B' }}
                            name="Latence (ms)"
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </Box>
        </Paper>
    );
};
