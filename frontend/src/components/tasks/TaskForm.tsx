import React, { useEffect, useState, useEffectEvent } from 'react';
import { TextField, Box, Stack, MenuItem, Chip, Avatar, Checkbox, ListItemText } from '@mui/material';
import { useAuth } from '@/hooks/useAuth';
import { useUsers } from '@/hooks/queries/useUserQueries';
import { useTaskMutations } from '@/hooks/queries/useTaskQueries';
import type { Task, CreateTaskDto, UpdateTaskDto } from '@/types/task';
import { TaskStatus, type TaskStatusType } from '@/enums/task';
import type { User } from '@/types/user';
import type { TaskModalProps } from '@/types/props';
import { BaseModal } from '../ui/BaseModal';

const DEFAULT_STATE = {
  title: '',
  description: '',
  status: TaskStatus.PENDING as TaskStatusType,
  dueDate: '',
  assigneeIds: [] as number[],
};

export function TaskModal({ noteId, task, isOpen, onClose }: TaskModalProps) {
  const { user } = useAuth();
  
  // 1. DATA FETCHING (TanStack Query)
  const { data: availableUsers = [] } = useUsers();
  const { createTask, updateTask } = useTaskMutations();

  const [formData, setFormData] = useState(DEFAULT_STATE);

  // 2. ÉVÉNEMENT STABILISÉ : Synchronisation du formulaire
  const handleResetForm = useEffectEvent((existingTask?: Task | null) => {
    if (existingTask) {
      setFormData({
        title: existingTask.title || '',
        description: existingTask.description || '',
        status: (existingTask.status as TaskStatusType) || TaskStatus.PENDING,
        // Formatage ISO local pour l'input datetime-local
        dueDate: existingTask.dueDate ? new Date(existingTask.dueDate).toLocaleString('sv').slice(0, 16).replace(' ', 'T') : '',
        assigneeIds: existingTask.assignees?.map(u => u.id) || [],
      });
    } else {
      setFormData({
        ...DEFAULT_STATE,
        assigneeIds: user?.id ? [Number(user.id)] : [],
      });
    }
  });

  useEffect(() => {
    if (isOpen) {
      handleResetForm(task);
    }
  }, [isOpen, task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const payload = {
      ...formData,
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : undefined,
    };

    if (task) {
      updateTask.mutate(
        { id: task.id, data: payload as UpdateTaskDto },
        { onSuccess: onClose }
      );
    } else {
      createTask.mutate(
        { ...payload, relatedNoteId: noteId } as CreateTaskDto,
        { onSuccess: onClose }
      );
    }
  };

  const isPending = createTask.isPending || updateTask.isPending;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title={task ? 'Modifier la note' : 'Nouvelle note'}
    >
      <Stack spacing={3}>
        
        <TextField
          label="Titre"
          fullWidth
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          required
          disabled={isPending}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
        />

        <TextField
          select
          label="Assigner à"
          fullWidth
          disabled={isPending}
          SelectProps={{
            multiple: true,
            value: formData.assigneeIds,
            renderValue: (selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {(selected as number[]).map((id) => {
                  const u = availableUsers.find((user : User) => user.id === id);
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
          onChange={(e) => {
            const value = e.target.value;
            setFormData({
              ...formData, 
              assigneeIds: typeof value === 'string' ? value.split(',').map(Number) : (value as unknown as number[])
            });
          }}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
        >
          {availableUsers.map((user: User) => (
            <MenuItem key={user.id} value={user.id}>
              <Checkbox checked={formData.assigneeIds.includes(user.id)} />
              <Avatar src={user.avatarUrl} sx={{ width: 24, height: 24, mr: 1 }}>
                {user.firstName?.charAt(0)}
              </Avatar>
              <ListItemText primary={`${user.firstName} ${user.lastName}`} />
            </MenuItem>
          ))}
        </TextField>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            select
            label="Statut"
            fullWidth
            value={formData.status}
            onChange={(e) => setFormData({...formData, status: e.target.value as TaskStatusType})}
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
          />
        </Stack>

        <TextField
          label="Description"
          fullWidth
          multiline
          rows={3}
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
        />
      </Stack>
    </BaseModal>
  );
}