import { Stack, Box, Typography, Fade } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import type { Task } from '@/types/task';
import { TaskItem } from './TaskItem';
import { EmptyState } from '@/components/ui/EmptyState';

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
        description="Il semble que vous soyez à jour !"
        sx={{ mt: 4, py: 10 }}
      />
    );
  }

  const completedCount = tasks.filter(t => t.status === 'completed').length;

  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      {/* Header Statistique */}
      <Stack 
        direction="row" 
        justifyContent="space-between" 
        alignItems="center" 
        sx={{ mb: 2, px: 2 }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.secondary' }}>
          {tasks.length} Tâche{tasks.length > 1 ? 's' : ''}
        </Typography>
        <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 700 }}>
          {completedCount} Terminée{completedCount > 1 ? 's' : ''}
        </Typography>
      </Stack>

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
                onEdit={onEdit}
                onDelete={onDelete}
                onToggleStatus={onToggleStatus}
              />
            </Box>
          </Fade>
        ))}
      </Stack>
    </Box>
  );
}