import { Routes, Route, Navigate } from 'react-router-dom';

import NotesPage from '@/pages/NotesPage';
import TasksPage from '@/pages/TasksPage';
import TaskDetailPage from '@/pages/TaskDetailPage';
import AppointmentsPage from '@/pages/AppointmentsPage';
import NoteDetailPage from '@/pages/NoteDetailPage';
import LoginPage from '@/pages/LoginPage';
import Layout from '@/components/layout/Layout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { NotFound } from '@/components/ui/NotFound';
import ProfilePage from '@/pages/ProfilePage';
import CalendarPage from '@/pages/CalendarPage';
import ChatsPage from '@/pages/ChatsPage';
import ChatWindow from '@/components/chat/window/ChatWindow';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route 
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Navigate to="/notes" replace />} />

        {/* Section Notes */}
        <Route path="/notes" element={<NotesPage />} />
        <Route path="/notes/:id" element={<NoteDetailPage />} />
        
        {/* Section Tasks */}
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/tasks/:id" element={<TaskDetailPage />} />

        {/* Section Appointments */}
        <Route path="/appointments" element={<AppointmentsPage />} />
        <Route path="/appointments/calendar" element={<CalendarPage />} />

        {/* Section Appointments */}
        <Route path="/chats" element={<ChatsPage />}>
          <Route path=":id" element={<ChatWindow />} />
        </Route>

        {/* Section Profile */}
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}