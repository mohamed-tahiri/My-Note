import { Routes, Route, Navigate } from 'react-router-dom'
import NotesPage from '../pages/NotesPage'
import TasksPage from '../pages/TasksPage'
import AppointmentsPage from '../pages/AppointmentsPage'
import NoteDetailPage from '../pages/NoteDetailPage'
import Layout from '../components/layout/Layout'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/notes" replace />} />

      {/* Routes enveloppées dans le Layout */}
      <Route element={<Layout />}>
        <Route path="/notes" element={<NotesPage />} />
        <Route path="/notes/:id" element={<NoteDetailPage />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/appointments" element={<AppointmentsPage />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<div className="p-6">Page not found</div>} />
    </Routes>
  )
}
