import { 
  Box, Typography, IconButton, Checkbox, Stack, AvatarGroup, Avatar, alpha
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { TaskStatus } from "@/enums/task";
import type { TaskItemProps } from '@/types/props';

export function TaskItem({ task, onEdit, onDelete, onToggleStatus }: TaskItemProps) {
  const isCompleted = task.status === TaskStatus.COMPLETED;

  const moveNext = task.status === TaskStatus.PENDING ? TaskStatus.IN_PROGRESS : 
                   task.status === TaskStatus.IN_PROGRESS ? TaskStatus.COMPLETED : null;
  const moveBack = task.status === TaskStatus.COMPLETED ? TaskStatus.IN_PROGRESS : 
                   task.status === TaskStatus.IN_PROGRESS ? TaskStatus.PENDING : null;

  return (    
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        p: 2,
        mb: 2,
        borderRadius: '12px',
        border: '1px solid',
        borderColor: 'divider',
        transition: 'all 0.2s ease-in-out',
        bgcolor: isCompleted ? alpha('#f8fafc', 0.5) : 'background.paper',
        '&:hover': {
          borderColor: 'primary.main',
          boxShadow: '0px 4px 20px rgba(15, 23, 42, 0.08)',
          transform: 'translateY(-2px)'
        }
      }}
    >  
      <Stack direction="row" spacing={1.5} alignItems="flex-start">
        <Checkbox
          checked={isCompleted}
          onChange={() => onToggleStatus?.(task)}
          icon={<RadioButtonUncheckedIcon fontSize="small" />}
          checkedIcon={<CheckCircleIcon fontSize="small" />}
          sx={{ p: 0, mt: 0.3, '&.Mui-checked': { color: 'success.main' } }}
        />

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography 
            variant="body2" 
            component={RouterLink} 
            to={`/tasks/${task.id}`}
            sx={{ 
              fontWeight: 700, 
              color: isCompleted ? 'text.disabled' : 'text.primary',
              textDecoration: isCompleted ? 'line-through' : 'none',
              lineHeight: 1.4,
              mb: 0.5
            }}
          >
            {task.title}
          </Typography>
          
          {task.description && (
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'text.secondary', 
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                lineHeight: 1.3
              }}
            >
              {task.description}
            </Typography>
          )}
        </Box>
      </Stack>

      {/* Footer de la carte */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 2 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          {task.assignees && task.assignees.length > 0 && (
            <AvatarGroup max={2} sx={{ '& .MuiAvatar-root': { width: 20, height: 20, fontSize: '0.5rem' } }}>
              {task.assignees.map((u) => (
                <Avatar key={u.id} src={u.avatarUrl}>{u.firstName?.charAt(0)}</Avatar>
              ))}
            </AvatarGroup>
          )}
          {task.dueDate && (
             <Typography variant="caption" color="text.disabled" sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                <AccessTimeIcon sx={{ fontSize: '12px' }} />
                {new Date(task.dueDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
             </Typography>
          )}
        </Stack>

        <Stack direction="row" spacing={0}>
          {/* Boutons de mouvement rapide */}
          {moveBack && (
            <IconButton size="small" onClick={() => onToggleStatus?.(task, moveBack)}>
              <ArrowBackIcon sx={{ fontSize: 16 }} />
            </IconButton>
          )}
          
          {moveNext && (
            <IconButton size="small" onClick={() => onToggleStatus?.(task, moveNext)} color="primary">
              <ArrowForwardIcon sx={{ fontSize: 16 }} />
            </IconButton>
          )}

          <IconButton size="small" onClick={() => onEdit(task)}>
            <EditIcon sx={{ fontSize: 16 }} />
          </IconButton>

          <IconButton size="small" onClick={() => onDelete(task.id)} sx={{ color: 'error.light' }}>
            <DeleteIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Stack>
      </Stack>
    </Box>
  );
}