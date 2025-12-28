import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import type { Note } from '../types/note'
import type { Task } from '../types/task'
import { notesService } from '../api/notesService'
import { tasksService } from '../api/tasksService'
import { CreateTaskForm } from '../components/tasks/CreateTaskForm'
import { NoteTasksList } from '../components/notes/NoteTasksList'

export default function NoteDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [note, setNote] = useState<Note | null>(null)
  const [loading, setLoading] = useState(true)
  const [tasks, setTasks] = useState<Task[]>([])
  const [tasksLoading, setTasksLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadNote = async (id: number) => {
    setLoading(true)
    try {
        setError(null)
        const res = await notesService.getById(id);
        setNote(res.data);
    }  catch (err) {
        console.error(err)
        setError('Failed to load note')
    } finally {
        setLoading(false)
    }
  }

  const loadTasks = async (noteId: number) => {
    setTasksLoading(true)
    try {
      const res = await tasksService.getTasksByNote(noteId)
      setTasks(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setTasksLoading(false)
    }
  }

  useEffect(() => {
    if (!id) return
    const noteId = Number(id)
    loadNote(noteId);
    loadTasks(noteId);
  }, [id])

  if (loading) return <div className="p-4">Loading...</div>
  if (error) return <div className="p-4 text-red-600">{error}</div>
  if (!note) return <div className="p-4">Note not found</div>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">{note.title}</h1>
      <p className="text-gray-700 whitespace-pre-line">{note.content}</p>
      <p className="mt-4 text-sm text-gray-500">
        Created at: {new Date(note.createdAt).toLocaleString()}
      </p>
      <p className="text-sm text-gray-500">
        Updated at: {new Date(note.updatedAt).toLocaleString()}
      </p>
      <button
        onClick={() => navigate('/notes')}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Back to Notes
      </button>

      <h2 className="text-xl font-semibold mt-8 mb-4">Tasks</h2>

      {tasksLoading && <p>Loading tasks...</p>}

      {!tasksLoading && tasks.length === 0 && (
        <p className="text-gray-500">No tasks for this note</p>
      )}

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-3">Tasks</h2>

        <CreateTaskForm
          noteId={note.id}
          onCreated={() => loadTasks(note.id)}
        />

        <div className="mt-4">
          <NoteTasksList   tasks={tasks} />
        </div>
      </div>

    </div>
  )
}
