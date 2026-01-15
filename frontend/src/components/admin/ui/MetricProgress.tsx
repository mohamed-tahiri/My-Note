import type { MetricProgressProps } from "@/types/admin";
import { Box, LinearProgress, Stack, Typography } from "@mui/material";

export const MetricProgress = ({ 
    label, 
    value, 
    subLabel, 
    color = '#6366f1', 
    autoColor = false 
}: MetricProgressProps) => {

    const getAutoColor = () => {
        if (!autoColor) return color;
        if (value > 90) return '#10B981'; 
        if (value > 70) return '#F59E0B'; 
        return '#EF4444';               
    };

    const finalColor = getAutoColor();

    return (
        <Box sx={{ width: '100%' }}>
            <Stack direction="row" justifyContent="space-between" mb={1} alignItems="center">
                <Typography variant="body2" fontWeight={600} color="text.primary">
                    {label}
                </Typography>
                <Typography variant="caption" fontWeight={700} sx={{ color: finalColor }}>
                    {subLabel || `${value}%`}
                </Typography>
            </Stack>
            <LinearProgress 
                variant="determinate" 
                value={value} 
                sx={{ 
                    height: 6, 
                    borderRadius: 3, 
                    bgcolor: '#f1f5f9', 
                    '& .MuiLinearProgress-bar': { bgcolor: finalColor } 
                }} 
            />
        </Box>
    );
};