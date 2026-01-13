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
import DashboardLayout from '@/components/layout/admin/DashboardLayout';
import OverviewPage from '@/pages/admin/OverviewPage';
import MonitoringPage from '@/pages/admin/MonitoringPage';
import AnalyticsPage from '@/pages/admin/AnalyticsPage';
import SecurityPage from '@/pages/admin/SecurityPage';
import SettingsPage from '@/pages/admin/SettingsPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* Main App Shell */}
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/" element={<Navigate to="/notes" replace />} />

        {/* Section Notes */}
        <Route path="notes">
          <Route index element={<NotesPage />} />
          <Route path=":id" element={<NoteDetailPage />} />
        </Route>
        
        {/* Section Tasks */}
        <Route path="tasks">
          <Route index element={<TasksPage />} />
          <Route path=":id" element={<TaskDetailPage />} />
        </Route>

        {/* Section Appointments */}
        <Route path="appointments">
          <Route index element={<AppointmentsPage />} />
          <Route path="calendar" element={<CalendarPage />} />
        </Route>

        {/* Section Chats */}
        <Route path="chats" element={<ChatsPage />}>
          <Route path=":id" element={<ChatWindow />} />
        </Route>


        {/* Section Profile */}
        <Route path="profile" element={<ProfilePage />} />
      </Route>


      {/* Section Admin */}
      <Route path="admin" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          {/* This handles the redirect from /admin to /admin/overview */}
          <Route index element={<Navigate to="overview" replace />} />
          
          <Route path="overview" element={<OverviewPage />} />
          <Route path="infrastructure" element={<MonitoringPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="security" element={<SecurityPage />} />
          <Route path="settings" element={<SettingsPage />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}