import { useState, useEffect } from 'react';
import type { Task, CreateTaskDto, UpdateTaskDto } from '@/types/task';
import { create, update } from '@/api/tasksService';

interface Props {
  noteId: number;
  task?: Task | null; // undefined = create, task = edit
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export function TaskModal({ noteId, task, isOpen, onClose, onSaved }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTitle(task?.title || '');
      setDescription(task?.description || '');
    }
  }, [isOpen, task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (task) {
        const data: UpdateTaskDto = { title, description };
        await update(task.id, data);
      } else {
        const data: CreateTaskDto = { title, description, relatedNoteId: noteId, assigneeId: 1 };
        await create(data);
      }
      onSaved();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-lg bg-white shadow-lg">
        <div className="flex justify-between items-center border-b px-4 py-3">
          <h2 className="text-lg font-semibold">{task ? 'Edit Task' : 'Create Task'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-4">
          <input
            className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="rounded px-4 py-2 text-sm text-gray-600 hover:bg-gray-100">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="rounded bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700">
              {loading ? 'Saving...' : task ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
