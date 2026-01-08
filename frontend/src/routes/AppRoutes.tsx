import { Routes, Route, Navigate } from 'react-router-dom';

import NotesPage from '../pages/NotesPage';
import TasksPage from '../pages/TasksPage';
import AppointmentsPage from '../pages/AppointmentsPage';
import NoteDetailPage from '../pages/NoteDetailPage';
import LoginPage from '../pages/LoginPage';
import Layout from '../components/layout/Layout';
import { ProtectedRoute } from '../components/ProtectedRoute'; // Import du composant
import { NotFound } from '@/components/ui/NotFound';
import ProfilePage from '@/pages/ProfilePage';

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
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}