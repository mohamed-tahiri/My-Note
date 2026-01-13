import type { PageHeaderProps } from '@/types/admin';
import { Box, Stack, Typography } from '@mui/material';

export const PageHeader = ({ 
  title, 
  subtitle, 
  icon, 
  iconBgColor = 'primary.main', 
  rightContent 
}: PageHeaderProps) => {
  return (
    <Stack 
      direction="row" 
      justifyContent="space-between" 
      alignItems="center" 
      mb={4}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        {icon && (
          <Box sx={{ 
            p: 1.5, 
            bgcolor: iconBgColor, 
            borderRadius: '12px', 
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {icon}
          </Box>
        )}
        
        <Box>
          <Typography variant="h4" fontWeight={800} color="primary.main">
            {title}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            {subtitle}
          </Typography>
        </Box>
      </Stack>

      {/* Affichage conditionnel du contenu à droite (Chip, Paper, etc.) */}
      {rightContent && (
        <Box>
          {rightContent}
        </Box>
      )}
    </Stack>
  );
};