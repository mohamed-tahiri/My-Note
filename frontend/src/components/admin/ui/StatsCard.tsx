import type { StatsProps } from '@/types/admin';
import { Card, CardContent, Typography, Box, Stack } from '@mui/material';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const StatsCard = ({ title, value, trend, icon }: StatsProps) => {
  const isNegative = trend.includes('-');

  return (
    <Card sx={{ borderRadius: '16px', boxShadow: '0px 2px 4px rgba(0,0,0,0.02)', border: '1px solid #E2E8F0' }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            width: 40, 
            height: 40, 
            borderRadius: '10px', 
            bgcolor: 'rgba(99, 102, 241, 0.08)', 
            color: 'primary.main' 
          }}>
            {icon}
          </Box>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            px: 1, 
            py: 0.5, 
            borderRadius: '6px', 
            bgcolor: isNegative ? 'rgba(239, 68, 68, 0.08)' : 'rgba(16, 185, 129, 0.08)',
            color: isNegative ? 'error.main' : 'success.main'
          }}>
            {isNegative ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
            <Typography variant="caption" sx={{ ml: 0.5, fontWeight: 700 }}>
              {trend}
            </Typography>
          </Box>
        </Stack>
        
        <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
          {title}
        </Typography>
        <Typography variant="h4" fontWeight={800} sx={{ mt: 0.5 }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
};