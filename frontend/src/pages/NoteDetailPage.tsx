import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import type { Note } from '../types/note'
import { notesService } from '../api/notesService'

export default function NoteDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [note, setNote] = useState<Note | null>(null)
  const [loading, setLoading] = useState(true)
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

  useEffect(() => {
    if (!id) return
    loadNote(Number(id));
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
    </div>
  )
}
