import { Stack, Box, Typography, Fade, Grid } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import type { Task } from '@/types/task';
import { TaskItem } from './TaskItem';
import { EmptyState } from '@/components/ui/EmptyState';
import { TaskStatus } from '@/enums/task';

interface Props {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onToggleStatus?: (task: Task) => void;
}

export function TaskList({ tasks, onEdit, onDelete, onToggleStatus }: Props) {
  if (tasks.length === 0) {
    return (
      <EmptyState 
        icon={AssignmentIcon}
        title="Aucune tâche pour le moment"
        description="Votre tableau de bord est vide."
        sx={{ mt: 4, py: 10 }}
      />
    );
  }

  // Configuration des colonnes
  const columns = [
    { title: 'À faire', status: TaskStatus.PENDING, color: 'text.secondary' },
    { title: 'En cours', status: TaskStatus.IN_PROGRESS, color: 'primary.main' },
    { title: 'Terminé', status: TaskStatus.COMPLETED, color: 'success.main' },
  ];

  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      <Grid container spacing={3}>
        {columns.map((col) => {
          const filteredTasks = tasks.filter((t) => t.status === col.status);

          return (
            <Grid key={col.status} size={{ xs: 12, md: 4 }}>
              {/* Header de la colonne */}
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2, px: 1 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: col.color }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {col.title}
                </Typography>
                <Typography variant="caption" sx={{ bgcolor: 'action.hover', px: 1, borderRadius: '10px', fontWeight: 700 }}>
                  {filteredTasks.length}
                </Typography>
              </Stack>

              {/* Conteneur de la colonne */}
              <Stack spacing={0} sx={{ minHeight: '200px' }}>
                {filteredTasks.length === 0 ? (
                   <Typography variant="caption" color="text.disabled" sx={{ textAlign: 'center', mt: 4, fontStyle: 'italic' }}>
                    Aucune tâche {col.title.toLowerCase()}
                   </Typography>
                ) : (
                  filteredTasks.map((task, index) => (
                    <Fade in={true} key={task.id} style={{ transitionDelay: `${index * 50}ms` }}>
                      <Box>
                        <TaskItem
                          task={task}
                          onEdit={onEdit}
                          onDelete={onDelete}
                          onToggleStatus={onToggleStatus}
                        />
                      </Box>
                    </Fade>
                  ))
                )}
              </Stack>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}