import { useState } from 'react';
import { 
  Box, Typography, Button, Stack, CircularProgress, Grid, alpha 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import type { Note } from '@/types/note';
import type { Task } from '@/types/task';
import { TaskStatus, type TaskStatusType } from '@/enums/task';
import { TaskItem } from '../tasks/TaskItem';
import { TaskModal } from '../tasks/TaskForm';
import { logger } from '@/utils/logger';
import { deleteTask, update } from '@/api/tasksService';
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

  const columns = [
    { title: 'À faire', status: TaskStatus.PENDING, color: 'text.disabled' },
    { title: 'En cours', status: TaskStatus.IN_PROGRESS, color: 'primary.main' },
    { title: 'Terminé', status: TaskStatus.COMPLETED, color: 'success.main' },
  ];

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

  const handleToggleStatus = async (task: Task, newStatus?: string) => {
    try {
      let targetStatus: string;

      if (newStatus) {
        targetStatus = newStatus;
      } else {
        targetStatus = task.status === TaskStatus.COMPLETED 
          ? TaskStatus.PENDING 
          : TaskStatus.COMPLETED;
      }

      await update(task.id, { status: targetStatus as TaskStatusType });
      
      reloadTasks(); 
    } catch (error) {
      logger.error('Erreur lors du changement de statut', error);
    }
  };

  if (tasksLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h6" fontWeight={800} color="text.primary">
          Tâches associées
        </Typography>
        <Button
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
          onClick={() => { setEditingTask(null); setIsTaskModalOpen(true); }}
          sx={{ borderRadius: '8px', fontWeight: 700, textTransform: 'none' }}
        >
          Nouvelle tâche
        </Button>
      </Stack>

      <ConfirmDialog
        isOpen={confirmOpen}
        title="Supprimer la tâche ?"
        description="Cette action est définitive."
        onConfirm={handleConfirmDelete}
        onClose={() => setConfirmOpen(false)}
      />

      <TaskModal
        key={editingTask?.id || 'new'}
        noteId={note.id}
        task={editingTask}
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSaved={reloadTasks}
      />

      {tasks.length === 0 ? (
        <EmptyState
          icon={AssignmentTurnedInIcon}
          title="Aucune tâche"
          description="Créez une tâche pour commencer à suivre votre progression sur cette note."
        />
      ) : (
        <Grid container spacing={2}>
          {columns.map((col) => {
            const filteredTasks = tasks.filter(t => t.status === col.status);
            
            return (
              <Grid key={col.status} size={{ xs: 12, md: 4 }}>
                {/* Header de colonne miniature */}
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5, px: 1 }}>
                   <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: col.color }} />
                   <Typography variant="caption" fontWeight={800} sx={{ textTransform: 'uppercase', color: 'text.secondary' }}>
                    {col.title}
                   </Typography>
                   <Typography variant="caption" sx={{ ml: 'auto', bgcolor: alpha('#64748b', 0.1), px: 0.8, borderRadius: '6px', fontWeight: 700 }}>
                    {filteredTasks.length}
                   </Typography>
                </Stack>

                {/* Liste des tâches dans la colonne */}
                <Stack spacing={1}>
                  {filteredTasks.length === 0 ? (
                    <Box sx={{ p: 2, border: '1px dashed', borderColor: 'divider', borderRadius: '12px', textAlign: 'center' }}>
                      <Typography variant="caption" color="text.disabled">Vide</Typography>
                    </Box>
                  ) : (
                    filteredTasks.map((task) => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        onEdit={(t) => { setEditingTask(t); setIsTaskModalOpen(true); }}
                        onDelete={(id) => { setSelectedId(id); setConfirmOpen(true); }}
                        onToggleStatus={handleToggleStatus}
                      />
                    ))
                  )}
                </Stack>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
}