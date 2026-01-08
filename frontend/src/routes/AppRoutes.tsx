import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

import NotesPage from '../pages/NotesPage';
import TasksPage from '../pages/TasksPage';
import AppointmentsPage from '../pages/AppointmentsPage';
import NoteDetailPage from '../pages/NoteDetailPage';
import LoginPage from '../pages/LoginPage';
import Layout from '../components/layout/Layout';
import { ProtectedRoute } from '../components/ProtectedRoute'; // Import du composant

export default function AppRoutes() {
  return (
    <Routes>
      {/* Route Publique */}
      <Route path="/login" element={<LoginPage />} />

      <Route 
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Navigate to="/notes" replace />} />
        <Route path="/notes" element={<NotesPage />} />
        <Route path="/notes/:id" element={<NoteDetailPage />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/appointments" element={<AppointmentsPage />} />
      </Route>

      <Route path="*" element={
        <Box sx={{ 
          minHeight: '80vh', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'center',
          textAlign: 'center' 
        }}>
          <Typography variant="h4" sx={{ mb: 1 }}>404</Typography>
          <Typography variant="subtitle2" sx={{ mb: 3 }}>
            La page que vous cherchez n'existe pas.
          </Typography>
          <Button variant="contained" component={RouterLink} to="/">
            Retourner à l'accueil
          </Button>
        </Box>
      } />
    </Routes>
  );
}