import { 
  Box, 
  Typography, 
  IconButton, 
  Checkbox, 
  Stack, 
  Tooltip,
  Chip,
  AvatarGroup,
  Avatar,
  alpha
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import type { Task } from "@/types/task";
import { TaskStatus } from "@/enums/task";

interface Props {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onToggleStatus?: (task: Task) => void;
}

export function TaskItem({ task, onEdit, onDelete, onToggleStatus }: Props) {
  const isCompleted = task.status === TaskStatus.COMPLETED;

  // Gestion des couleurs par statut
  const getStatusConfig = (status: string) => {
    switch (status) {
      case TaskStatus.COMPLETED: 
        return { label: 'Terminée', color: 'success', opacity: 0.6 };
      case TaskStatus.IN_PROGRESS: 
        return { label: 'En cours', color: 'primary', opacity: 1 };
      default: 
        return { label: 'En attente', color: 'default', opacity: 1 };
    }
  };

  const statusConfig = getStatusConfig(task.status);

  return (    
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        mb: 2,
        p: 2,
        borderRadius: '12px',
        border: '1px solid',
        borderColor: 'divider',
        transition: 'all 0.2s',
        bgcolor: isCompleted ? alpha('#f8fafc', 0.5) : 'background.paper',
        '&:hover': {
          borderColor: 'primary.light',
          boxShadow: '0px 4px 12px rgba(15, 23, 42, 0.04)',
          transform: 'translateY(-1px)'
        }
      }}
    >  
      <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ flex: 1 }}>
        {/* Checkbox stylisée */}
        <Checkbox
          checked={isCompleted}
          onChange={() => onToggleStatus?.(task)}
          icon={<RadioButtonUncheckedIcon />}
          checkedIcon={<CheckCircleIcon />}
          sx={{
            color: 'divider',
            p: 0,
            mt: 0.5,
            '&.Mui-checked': { color: 'success.main' },
          }}
        />

        {/* Corps de la tâche */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
            <Typography 
              variant="body1" 
              noWrap
              sx={{ 
                fontWeight: 700, 
                color: isCompleted ? 'text.disabled' : 'text.primary',
                textDecoration: isCompleted ? 'line-through' : 'none',
              }}
            >
              {task.title}
            </Typography>
            <Chip 
              label={statusConfig.label} 
              size="small" 
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              color={statusConfig.color as any}
              variant={isCompleted ? "outlined" : "filled"}
              sx={{ height: '20px', fontSize: '0.65rem', fontWeight: 800 }}
            />
          </Stack>
          
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'text.secondary', 
              fontSize: '0.85rem',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              opacity: statusConfig.opacity
            }}
          >
            {task.description || "Aucune description fournie."}
          </Typography>

          {/* Footer de la tâche : Date + Assignés */}
          <Stack direction="row" spacing={3} alignItems="center" sx={{ mt: 1.5 }}>
            {task.dueDate && (
              <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color: 'text.disabled' }}>
                <AccessTimeIcon sx={{ fontSize: '14px' }} />
                <Typography variant="caption" fontWeight={600}>
                  {new Date(task.dueDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                </Typography>
              </Stack>
            )}

            {/* Avatar Group pour les multi-assignés */}
            {task.assignees && task.assignees.length > 0 && (
              <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 24, height: 24, fontSize: '0.6rem', border: '2px solid white' } }}>
                {task.assignees.map((u) => (
                  <Tooltip key={u.id} title={`${u.firstName} ${u.lastName}`}>
                    <Avatar src={u.avatarUrl} alt={u.firstName}>
                      {u.firstName?.charAt(0)}
                    </Avatar>
                  </Tooltip>
                ))}
              </AvatarGroup>
            )}
          </Stack>
        </Box>
      </Stack>

      {/* Actions verticales pour un look plus propre sur mobile */}
      <Stack direction="row" spacing={0.5}>
        <IconButton size="small" onClick={() => onEdit(task)} sx={{ color: 'text.secondary' }}>
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" onClick={() => onDelete(task.id)} sx={{ color: 'error.light' }}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Stack>
    </Box>
  );
}