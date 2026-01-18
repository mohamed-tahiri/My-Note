import type { AsyncWrapperProps } from "@/types/props";
import { Alert, Box, CircularProgress, Typography, Button } from "@mui/material";

export const AsyncWrapper = ({ 
  loading, 
  error, 
  children, 
  isEmpty, 
  emptyMessage = "Aucune donnée trouvée.",
  onRetry 
}: AsyncWrapperProps) => {
  
  if (loading) return (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', py: 10, gap: 2 }}>
      <CircularProgress size={40} thickness={4} />
      <Typography variant="body2" color="text.secondary">Chargement en cours...</Typography>
    </Box>
  );

  if (error) return (
    <Box sx={{ py: 4 }}>
      <Alert 
        severity="error" 
        action={onRetry && <Button color="inherit" size="small" onClick={onRetry}>Réessayer</Button>}
      >
        {error?.message || "Une erreur est survenue"}
      </Alert>
    </Box>
  );

  if (isEmpty) return (
    <Box sx={{ py: 10, textAlign: 'center', opacity: 0.6 }}>
      <Typography variant="h6" color="text.disabled">{emptyMessage}</Typography>
    </Box>
  );
  
  return <>{children}</>;
};