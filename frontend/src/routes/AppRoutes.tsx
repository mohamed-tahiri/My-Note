import { Routes, Route, Navigate } from 'react-router-dom'
import NotesPage from '../pages/NotesPage'
import TasksPage from '../pages/TasksPage'
import AppointmentsPage from '../pages/AppointmentsPage'
import ChatPage from '../pages/ChatPage'
import NoteDetailPage from '../pages/NoteDetailPage'

export default function AppRoutes() {
  return (
    <Routes>
      {/* Home */}
      <Route path="/" element={<Navigate to="/notes" replace />} />

      {/* Pages */}
      {/* Notes */}
      <Route path="/notes" element={<NotesPage />} />
      <Route path="/notes/:id" element={<NoteDetailPage />} />
      <Route path="/tasks" element={<TasksPage />} /> 
      <Route path="/appointments" element={<AppointmentsPage />} />
      <Route path="/chat" element={<ChatPage />} />

      {/* 404 */}
      <Route path="*" element={<div className="p-6">Page not found</div>} />
    </Routes>
  )
}
