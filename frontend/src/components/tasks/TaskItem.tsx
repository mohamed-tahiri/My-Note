import { 
  Box, 
  Typography, 
  IconButton, 
  Checkbox, 
  Stack, 
  Tooltip 
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import type { Task } from "@/types/task";

interface Props {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onToggleStatus?: (task: Task) => void; // Optionnel : pour changer le statut
}

export function TaskItem({ task, onEdit, onDelete, onToggleStatus }: Props) {
  const isDone = task.status === 'done'; 

  return (    
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        p: 2,
        transition: 'background-color 0.2s',
        '&:hover': {
          bgcolor: 'rgba(15, 23, 42, 0.02)', // Slate très léger au survol
        }
      }}
    >  
      <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ flex: 1 }}>
        {/* Checkbox stylisée */}
        <Checkbox
          checked={isDone}
          onChange={() => onToggleStatus?.(task)}
          icon={<RadioButtonUncheckedIcon />}
          checkedIcon={<CheckCircleIcon />}
          sx={{
            color: 'divider',
            padding: 0,
            mt: 0.3,
            '&.Mui-checked': {
              color: 'success.main',
            },
          }}
        />

        {/* Info de la tâche */}
        <Box sx={{ flex: 1 }}>
          <Typography 
            variant="body1" 
            sx={{ 
              fontWeight: 600, 
              color: isDone ? 'text.disabled' : 'primary.main',
              textDecoration: isDone ? 'line-through' : 'none',
              transition: 'all 0.2s'
            }}
          >
            {task.title}
          </Typography>
          
          {task.description && (
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'text.secondary', 
                mt: 0.5,
                fontSize: '0.85rem',
                opacity: isDone ? 0.6 : 1
              }}
            >
              {task.description}
            </Typography>
          )}
        </Box>
      </Stack>

      {/* Actions */}
      <Stack direction="row" spacing={1}>
        <Tooltip title="Modifier">
          <IconButton 
            size="small" 
            onClick={() => onEdit(task)}
            sx={{ 
              color: 'primary.light',
              '&:hover': { color: 'primary.main', bgcolor: 'primary.light' + '10' }
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Supprimer">
          <IconButton 
            size="small" 
            onClick={() => onDelete(task)}
            sx={{ 
              color: 'error.light',
              '&:hover': { color: 'error.main', bgcolor: 'error.light' + '10' }
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>
    </Box>
  );
}