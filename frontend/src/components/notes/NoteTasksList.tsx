import { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Stack, 
  CircularProgress, 
  Chip,
  Fade
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import type { Note } from '@/types/note';
import type { Task } from '@/types/task';
import { TaskItem } from '../tasks/TaskItem';
import { TaskModal } from '../tasks/TaskForm';
import { logger } from '@/utils/logger';
import { deleteTask } from '@/api/tasksService';
import { EmptyState } from '../ui/EmptyState';
import { ConfirmDialog } from '../ui/ConfirmDialog';

interface Props {
  note: Note;
  tasks: Task[];
  tasksLoading: boolean;
  reloadTasks: () => void;
}

export function NoteTasksList({ note, tasks, tasksLoading, reloadTasks }: Props) {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };


  const openDeleteConfirm = (id: number) => {
    setSelectedId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedId) {
      try {
        await deleteTask(selectedId);
        reloadTasks();
        setConfirmOpen(false);
      } catch (error) {
        logger.error('Delete failed', error);
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
          Tâches associées
          {tasks.length > 0 && <Chip sx={{ ml: 1 }} label={tasks.length}  size="small" color="primary" />}
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

      <ConfirmDialog
        isOpen={confirmOpen}
        title="Confirmer la suppression"
        description="Cette action est irréversible. Voulez-vous vraiment supprimer cet élément ?"
        onConfirm={handleConfirmDelete}
        onClose={() => setConfirmOpen(false)}
      />

      <TaskModal
        key={editingTask?.id || 'new-task'} // Reset le state de la modal à chaque changement
        noteId={note.id}
        task={editingTask}
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSaved={reloadTasks}
      />
      
        {tasksLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress size={24} />
          </Box>
        ) : tasks.length === 0 ? (
          <EmptyState
            icon={AssignmentTurnedInIcon}
            title="Toutes les tâches sont terminées !"
            description="Ou vous n'en avez pas encore créé pour cette catégorie."
          />
        ) : (
          <Stack spacing={0}>
            {tasks.map((task, index) => (
              <Fade 
                in={true} 
                key={task.id} 
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <Box sx={{ border: 'none', outline: 'none' }}> 
                  <TaskItem
                    task={task}
                    onEdit={handleEdit}
                    onDelete={openDeleteConfirm}
                  />
                </Box>
              </Fade>
            ))}
          </Stack>
        )}
    </Box>
  );
}