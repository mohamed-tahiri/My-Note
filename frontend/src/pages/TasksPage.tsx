import { useEffect, useState } from 'react';
import { getTasksByUser, deleteTask } from '@/api/tasksService';
import { TaskList } from '@/components/tasks/TaskList';
import { logger } from '@/utils/logger';
import type { Task } from '@/types/task';
import { TaskModal } from '@/components/tasks/TaskForm';

export default function TasksPage() {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

  const loadTasks = async () => {
    try {
      const res = await getTasksByUser(1); // Assuming user ID is 1 for now 
      setTasks(res.data);
    } catch (error) {
      logger.error('Failed to load tasks', error);
    }
  };

  useEffect(() => {
    const initializeTasks = async () => {
      await loadTasks();
    };

    initializeTasks();
  }, []);


  const handleDelete = async (task: Task) => {
    try {
      await deleteTask(task.id);
      await loadTasks();
    } catch (error) {
      logger.error('Failed to delete task', error);
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  // const handleEdit = (task: Task) => {
  //   setEditingTask(task);
  //   setIsModalOpen(true);
  // };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Tasks</h1>
        {/* <button
          onClick={handleCreate}
          className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
        >
          <AddIcon fontSize="medium" />
        </button> */}
      </div>

      <TaskModal
        noteId={1}
        task={editingTask}
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSaved={loadTasks}
      />

      {/* Tasks list */}
      <TaskList 
        tasks={tasks}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
