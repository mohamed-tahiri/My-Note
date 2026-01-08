import { Component, type ReactNode, type ErrorInfo } from 'react';
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
// Remplace par ton utilitaire de log réel ou console.error
const logger = { error: console.error }; 

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static getDerivedStateFromError(_: Error): State {
    // Met à jour l'état pour afficher l'UI de secours au prochain rendu
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Log l'erreur vers ton service de monitoring
    logger.error("ErrorBoundary caught an error", error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false });
    window.location.href = '/'; // Redirige vers l'accueil pour reset l'état
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="sm">
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="80vh"
          >
            <Paper 
              elevation={0} 
              sx={{ p: 5, textAlign: 'center', border: '1px solid', borderColor: 'divider' }}
            >
              <Typography variant="h5" gutterBottom fontWeight={700}>
                Oups ! Quelque chose s'est mal passé.
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                Une erreur inattendue est survenue. Veuillez réessayer ou retourner à l'accueil.
              </Typography>
              <Button
                variant="contained"
                startIcon={<RefreshIcon />}
                onClick={this.handleReset}
              >
                Recharger l'application
              </Button>
            </Paper>
          </Box>
        </Container>
      );
    }

    return this.props.children;
  }
}