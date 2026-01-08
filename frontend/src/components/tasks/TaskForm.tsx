import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Typography,
  Box,
  Stack,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from '@/hooks/useAuth';
import { create, update } from '@/api/tasksService';
import type { Task, CreateTaskDto, UpdateTaskDto } from '@/types/task';

interface Props {
  noteId: number;
  task?: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export function TaskModal({ noteId, task, isOpen, onClose, onSaved }: Props) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  // Synchronisation des champs à l'ouverture
  useEffect(() => {
    if (isOpen) {
      setTitle(task?.title || '');
      setDescription(task?.description || '');
    }
  }, [isOpen, task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    setLoading(true);
    try {
      if (task) {
        const data: UpdateTaskDto = { 
          title: title.trim(), 
          description: description.trim() 
        };
        await update(task.id, data);
      } else {
        const data: CreateTaskDto = { 
          title: title.trim(), 
          description: description.trim(), 
          relatedNoteId: noteId,
          assigneeId: user?.id ? Number(user.id) : 0 
        };
        await create(data);
      }
      onSaved();
      onClose();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de la tâche", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose}
      fullWidth
      maxWidth="xs" // Plus étroit que la note pour différencier visuellement
      PaperProps={{
        sx: { borderRadius: '16px', p: 1 }
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" fontWeight={800} color="primary.main">
          {task ? 'Modifier la tâche' : 'Nouvelle tâche'}
        </Typography>
        <IconButton onClick={onClose} sx={{ color: 'text.secondary' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent dividers sx={{ borderBottom: 'none', py: 2 }}>
          <Stack spacing={2.5}>
            <TextField
              label="Titre de la tâche"
              placeholder="Faire les courses, appeler le client..."
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
              variant="outlined"
              disabled={loading}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
            />

            <TextField
              label="Description (optionnel)"
              placeholder="Ajouter des détails..."
              fullWidth
              multiline
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              variant="outlined"
              disabled={loading}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button 
            onClick={onClose} 
            disabled={loading}
            sx={{ fontWeight: 600, textTransform: 'none', color: 'text.secondary' }}
          >
            Annuler
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={loading}
            disableElevation
            sx={{ 
              fontWeight: 700, 
              textTransform: 'none', 
              px: 3,
              borderRadius: '10px',
              minWidth: '100px'
            }}
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : (task ? 'Mettre à jour' : 'Créer')}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}