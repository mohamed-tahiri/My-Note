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
  MenuItem,
  Chip,
  Avatar,
  Checkbox,
  ListItemText,
  CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from '@/hooks/useAuth';
import { create, update } from '@/api/tasksService';
import { getAll } from '@/api/userService'; // Assurez-vous d'avoir ce service
import type { Task, CreateTaskDto, UpdateTaskDto } from '@/types/task';
import type { User } from '@/types/user';
import { TaskStatus, type TaskStatusType } from '@/enums/task';

interface Props {
  noteId?: number;
  task?: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export function TaskModal({ noteId, task, isOpen, onClose, onSaved }: Props) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: TaskStatus.PENDING as TaskStatusType,
    dueDate: '',
    assigneeIds: [] as number[],
  });

  // 1. Charger la liste des utilisateurs pour la sélection
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAll();
        setAvailableUsers(response.data);
      } catch (error) {
        console.error("Erreur chargement utilisateurs:", error);
      }
    };
    if (isOpen) fetchUsers();
  }, [isOpen]);

  // 2. Synchronisation des données (Mode Création vs Edition)
  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: task?.title || '',
        description: task?.description || '',
        status: (task?.status as TaskStatusType) || TaskStatus.PENDING,
        dueDate: task?.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : '',
        assigneeIds: task?.assignees?.map(u => u.id) || [user?.id].filter(Boolean) as number[],
      });
    }
  }, [isOpen, task, user?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
      
    setLoading(true);
    try {
      const payload = {
        ...formData,
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : undefined,
      };

      if (task) {
        // Pour l'update, le backend attend UpdateTaskDto (partiel)
        await update(task.id, payload as UpdateTaskDto);
      } else {
        // Pour la création, on lie la note et on passe les IDs
        await create({ 
          ...payload, 
          relatedNoteId: noteId 
        } as CreateTaskDto);
      }

      onSaved();
      onClose();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de la tâche:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose} 
      fullWidth 
      maxWidth="sm" 
      PaperProps={{ sx: { borderRadius: '20px', backgroundImage: 'none' } }}
    >
      <DialogTitle sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" fontWeight={800} color="primary.main">
          {task ? 'Modifier la tâche' : 'Nouvelle tâche'}
        </Typography>
        <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
      </DialogTitle>

      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent dividers sx={{ py: 3, borderBottom: 'none' }}>
          <Stack spacing={3}>
            
            {/* Titre */}
            <TextField
              label="Titre"
              placeholder="Faire quoi ?"
              fullWidth
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
              disabled={loading}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
            />

            {/* Multi-Select Assignés */}
            <TextField
              select
              label="Assigner à"
              fullWidth
              disabled={loading}
              SelectProps={{
                multiple: true,
                value: formData.assigneeIds,
                renderValue: (selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {(selected as number[]).map((id) => {
                      const u = availableUsers.find(user => user.id === id);
                      return (
                        <Chip 
                          key={id} 
                          size="small"
                          avatar={<Avatar src={u?.avatarUrl}>{u?.firstName?.charAt(0)}</Avatar>}
                          label={u ? `${u.firstName} ${u.lastName}` : id} 
                        />
                      );
                    })}
                  </Box>
                ),
              }}
              onChange={(e) => setFormData({...formData, assigneeIds: e.target.value as unknown as number[]})}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
            >
              {availableUsers.map((u) => (
                <MenuItem key={u.id} value={u.id}>
                  <Checkbox checked={formData.assigneeIds.indexOf(u.id) > -1} />
                  <Avatar src={u.avatarUrl} sx={{ width: 24, height: 24, mr: 1 }}>
                    {u.firstName?.charAt(0)}
                  </Avatar>
                  <ListItemText primary={`${u.firstName} ${u.lastName}`} secondary={u.email} />
                </MenuItem>
              ))}
            </TextField>

            {/* Statut & Échéance */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                select
                label="Statut"
                fullWidth
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value as TaskStatusType})}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              >
                <MenuItem value={TaskStatus.PENDING}>En attente</MenuItem>
                <MenuItem value={TaskStatus.IN_PROGRESS}>En cours</MenuItem>
                <MenuItem value={TaskStatus.COMPLETED}>Terminée</MenuItem>
              </TextField>

              <TextField
                label="Échéance"
                type="datetime-local"
                fullWidth
                value={formData.dueDate}
                onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                InputLabelProps={{ shrink: true }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              />
            </Stack>

            {/* Description */}
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={onClose} color="inherit" sx={{ fontWeight: 600 }}>Annuler</Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={loading}
            sx={{ borderRadius: '10px', px: 4, fontWeight: 700, minWidth: '120px' }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : (task ? 'Sauvegarder' : 'Créer la tâche')}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}