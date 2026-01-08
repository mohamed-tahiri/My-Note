import { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Fab, 
  Stack, 
  CircularProgress, 
  Fade 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';

import { getTasksByUser, deleteTask } from '@/api/tasksService';
import { TaskList } from '@/components/tasks/TaskList';
import { TaskModal } from '@/components/tasks/TaskForm';
import { useAuth } from '@/hooks/useAuth';
import { logger } from '@/utils/logger';
import type { Task } from '@/types/task';

export default function TasksPage() {
  const { user } = useAuth();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTasks = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const res = await getTasksByUser(Number(user.id)); 
      setTasks(res.data);
    } catch (error) {
      logger.error('Failed to load tasks', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [user?.id]);

  const handleDelete = async (task: Task) => {
    if (window.confirm('Voulez-vous vraiment supprimer cette tâche ?')) {
      try {
        await deleteTask(task.id);
        await loadTasks();
      } catch (error) {
        logger.error('Failed to delete task', error);
      }
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleCreate = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  return (
    <Box sx={{ pb: 8 }}>
      {/* Header */}
      <Stack 
        direction="row" 
        justifyContent="space-between" 
        alignItems="center" 
        sx={{ mb: 4 }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main' }}>
            Tâches
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            Suivez l'avancement de vos objectifs.
          </Typography>
        </Box>
      </Stack>

      {/* Modal de création/édition */}
      <TaskModal
        key={editingTask?.id || 'new-global-task'}
        noteId={0} // 0 ou null si la tâche n'est pas liée à une note spécifique
        task={editingTask}
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSaved={loadTasks}
      />

      {/* État de chargement */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      ) : tasks.length === 0 ? (
        <Fade in={true}>
          <Box 
            sx={{ 
              textAlign: 'center', 
              py: 10, 
              bgcolor: 'background.paper', 
              borderRadius: '16px',
              border: '1px dashed',
              borderColor: 'divider'
            }}
          >
            <AssignmentTurnedInIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              Toutes les tâches sont terminées !
            </Typography>
            <Typography variant="body2" color="text.disabled">
              Ou vous n'en avez pas encore créé.
            </Typography>
          </Box>
        </Fade>
      ) : (
        <Fade in={!loading}>
          <Box>
            <TaskList 
              tasks={tasks}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </Box>
        </Fade>
      )}

      {/* Bouton d'ajout flottant */}
      <Fab 
        color="primary" 
        onClick={handleCreate}
        sx={{ 
          position: 'fixed', 
          bottom: { xs: 80, md: 40 }, 
          right: { xs: 20, md: 40 },
          boxShadow: '0px 4px 20px rgba(15, 23, 42, 0.3)'
        }}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
}