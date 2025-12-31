import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Note } from '@/types/note';
import type { Task } from '@/types/task';
import { getById } from '@/api/notesService';
import { getTasksByNote } from '@/api/tasksService';
import { CreateTaskModal } from '@/components/tasks/CreateTaskForm';
import { NoteTasksList } from '@/components/notes/NoteTasksList';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { logger } from '@/utils/logger';

export default function NoteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const loadNote = async (noteId: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getById(noteId);
      setNote(res.data);
    } catch (err) {
      logger.error(err);
      setError('Failed to load note.');
    } finally {
      setLoading(false);
    }
  };

  const loadTasks = async (noteId: number) => {
    setTasksLoading(true);
    try {
      const res = await getTasksByNote(noteId);
      setTasks(res.data);
    } catch (err) {
      logger.error(err);
    } finally {
      setTasksLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    const noteId = Number(id);
    loadNote(noteId);
    loadTasks(noteId);
  }, [id]);

  if (loading) return <div className="p-4">Loading note...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;
  if (!note) return <div className="p-4">Note not found</div>;

  return (
    <div className="space-y-6 p-4">

      {/* Header / Note Details */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">{note.title}</h1>
          <button
            onClick={() => navigate('/notes')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded px-3 py-2"
          >
            <ArrowBackIcon fontSize="medium" />
          </button>
        </div>

        <p className="text-gray-700 whitespace-pre-line">{note.content}</p>
        <div className="mt-2 text-sm text-gray-500 space-y-1">
          <p>Created at: {new Date(note.createdAt).toLocaleString()}</p>
          <p>Updated at: {new Date(note.updatedAt).toLocaleString()}</p>
        </div>
      </section>

      {/* Tasks Section */}
      <section className="mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Tasks</h2>
          <button
            onClick={() => setIsTaskModalOpen(true)}
            className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded px-3 py-2"
          >
            <AddIcon fontSize="medium" />
          </button>
        </div>

        {/* Task Modal */}
        <CreateTaskModal
          noteId={note.id}
          isOpen={isTaskModalOpen}
          onClose={() => setIsTaskModalOpen(false)}
          onCreated={() => loadTasks(note.id)}
        />

        {/* Task List */}
        <div>
          {tasksLoading ? (
            <p>Loading tasks...</p>
          ) : tasks.length === 0 ? (
            <p className="text-gray-500">No tasks for this note.</p>
          ) : (
            <NoteTasksList tasks={tasks} />
          )}
        </div>
      </section>
    </div>
  );
}
