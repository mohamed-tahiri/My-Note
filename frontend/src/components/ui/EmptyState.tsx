import type { EmptyStateProps } from '@/types/props';
import { Box, Typography, Fade } from '@mui/material';

export function EmptyState({ icon: Icon, title, description, sx }: EmptyStateProps) {
  return (
    <Fade in={true} timeout={600}>
      <Box 
        sx={{ 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center', 
          py: 8, 
          px: 3,
          bgcolor: 'background.paper', 
          borderRadius: '24px', // Un peu plus arrondi pour le style Slate
          border: '1px dashed',
          borderColor: 'divider',
          minHeight: '200px',
          ...sx 
        }}
      >
        <Icon sx={{ fontSize: 48, color: 'text.disabled', mb: 2, opacity: 0.7 }} />
        
        <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.secondary', mb: 0.5 }}>
          {title}
        </Typography>
        
        <Typography variant="body2" sx={{ color: 'text.disabled', maxWidth: '300px' }}>
          {description}
        </Typography>
      </Box>
    </Fade>
  );
}