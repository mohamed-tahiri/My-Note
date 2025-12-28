import { useState } from 'react'
import type { CreateTaskDto } from '../../types/task'
import { tasksService } from '../../api/tasksService'

interface Props {
  noteId: number
  onCreated: () => void
}

export function CreateTaskForm({ noteId, onCreated }: Props) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const data: CreateTaskDto = {
        title,
        description,
        relatedNoteId: noteId,
        assigneeId: 1, // Default assignee for simplicity
    }

    try {
      await tasksService.create(data)
      setTitle('')
      setDescription('')
      onCreated()
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input
        className="w-full border px-3 py-2 rounded"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <textarea
        className="w-full border px-3 py-2 rounded"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? 'Creating...' : 'Add Task'}
      </button>
    </form>
  )
}
