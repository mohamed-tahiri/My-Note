import { useState } from 'react';
import type { Note } from '@/types/note';
import type { Task } from '@/types/task';
import { TaskItem } from '../tasks/TaskItem';
import AddIcon from '@mui/icons-material/Add';
import { TaskModal } from '../tasks/TaskForm';
import { logger } from '@/utils/logger';
import { deleteTask } from '@/api/tasksService';

interface Props {
  note: Note;
  tasks: Task[];
  tasksLoading: boolean;
  reloadTasks: () => void;
}

export function NoteTasksList({ note, tasks, tasksLoading, reloadTasks }: Props) {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleDelete = async (task: Task) => {
    try {
      await deleteTask(task.id);
      reloadTasks();
    } catch (err) {
      logger.error(err);
    };
  };    

  return (
    <section className="mt-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Tasks</h2>
        <button
          onClick={() => {
            setEditingTask(null);
            setIsTaskModalOpen(true);
          }}
          className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded px-3 py-2"
        >
          <AddIcon fontSize="medium" />
        </button>
      </div>

      <TaskModal
        noteId={note.id}
        task={editingTask}
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSaved={reloadTasks}
      />

      {tasksLoading ? (
        <p>Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p className="text-gray-500">No tasks for this note.</p>
      ) : (
        <ul className="space-y-2">
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} onEdit={handleEdit} onDelete={handleDelete} />
          ))}
        </ul>
      )}
    </section>
  );
}