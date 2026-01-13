import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Box, Typography, Paper } from '@mui/material';
import type { BaseAreaChartProps } from '@/types/admin';

export const BaseAreaChart = ({ 
  title, 
  data, 
  dataKey, 
  color = "#6366f1", 
  height = 300 
}: BaseAreaChartProps) => {
  // ID unique pour le gradient pour éviter les conflits si plusieurs charts sont sur la même page
  const gradientId = `color-${dataKey}`;

  return (
    <Paper sx={{ p: 3, borderRadius: '16px', height: '100%', boxShadow: '0px 2px 4px rgba(0,0,0,0.02)', border: '1px solid #E2E8F0' }}>
      <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mb: 2 }}>
        {title}
      </Typography>
      <Box sx={{ width: '100%', height: height }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={color} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="time" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 12 }} 
              minTickGap={30}
            />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
            <Tooltip 
              contentStyle={{ 
                borderRadius: '12px', 
                border: 'none', 
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                fontSize: '14px'
              }} 
            />
            <Area 
              type="monotone" 
              dataKey={dataKey} 
              stroke={color} 
              strokeWidth={3} 
              fillOpacity={1} 
              fill={`url(#${gradientId})`} 
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};