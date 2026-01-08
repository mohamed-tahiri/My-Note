import { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Stack, 
  CircularProgress, 
  Paper,
  Divider
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AssignmentIcon from '@mui/icons-material/Assignment';

import type { Note } from '@/types/note';
import type { Task } from '@/types/task';
import { TaskItem } from '../tasks/TaskItem';
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
    if (window.confirm('Supprimer cette tâche ?')) {
      try {
        await deleteTask(task.id);
        reloadTasks();
      } catch (err) {
        logger.error(err);
      }
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      {/* Barre d'action des tâches */}
      <Stack 
        direction="row" 
        justifyContent="space-between" 
        alignItems="center" 
        sx={{ mb: 2 }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
          Tâches
        </Typography>
        <Button
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditingTask(null);
            setIsTaskModalOpen(true);
          }}
          sx={{ 
            borderRadius: '8px', 
            textTransform: 'none',
            fontWeight: 600,
            boxShadow: 'none'
          }}
        >
          Ajouter
        </Button>
      </Stack>

      <TaskModal
        key={editingTask?.id || 'new-task'} // Reset le state de la modal à chaque changement
        noteId={note.id}
        task={editingTask}
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSaved={reloadTasks}
      />

      {/* Liste des tâches */}
      <Paper 
        elevation={0} 
        sx={{ 
          borderRadius: '12px', 
          border: tasks.length > 0 ? '1px solid' : 'none', 
          borderColor: 'divider',
          overflow: 'hidden'
        }}
      >
        {tasksLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress size={24} />
          </Box>
        ) : tasks.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center', bgcolor: 'background.default', borderRadius: '12px', border: '1px dashed', borderColor: 'divider' }}>
            <AssignmentIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
            <Typography variant="body2" color="text.secondary">
              Aucune tâche associée à cette note.
            </Typography>
          </Box>
        ) : (
          <Box>
            {tasks.map((task, index) => (
              <Box key={task.id}>
                <TaskItem 
                  task={task} 
                  onEdit={handleEdit} 
                  onDelete={handleDelete} 
                />
                {index < tasks.length - 1 && <Divider />}
              </Box>
            ))}
          </Box>
        )}
      </Paper>
    </Box>
  );
}