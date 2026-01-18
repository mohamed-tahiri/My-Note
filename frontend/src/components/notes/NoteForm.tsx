import React, { useEffect, useState, useEffectEvent } from 'react';
import { TextField, Stack, MenuItem } from '@mui/material';
import { useAuth } from '@/hooks/useAuth';
import type { CreateNoteDto, UpdateNoteDto } from '@/types/note';
import { NotePriority } from '@/enums/note';
import type { NoteFormModalProps } from '@/types/props';
import { BaseModal } from '../ui/BaseModal';

const DEFAULT_STATE = {
  title: '',
  content: '',
  priority: NotePriority.LOW,
};

export function NoteFormModal({
  isOpen, onSubmit, editingNote, onClose,
}: NoteFormModalProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState<{
    title: string;
    content: string;
    priority: NotePriority;
  }>(DEFAULT_STATE);

  /**
   * Action stabilisée pour réinitialiser le formulaire.
   * L'usage de useEffectEvent garantit que cette fonction lit les dernières
   * valeurs sans forcer le useEffect à se redéclencher inutilement.
   */
  const handleResetForm = useEffectEvent((note?: UpdateNoteDto) => {
    if (note) {
      setFormData({
        title: note.title ?? '',
        content: note.content ?? '',
        priority: note.priority ?? NotePriority.LOW,
      });
    } else {
      setFormData(DEFAULT_STATE);
    }
  });

  useEffect(() => {
    if (isOpen) {
      handleResetForm(editingNote);
    }
  }, [isOpen, editingNote]); // handleResetForm n'est pas une dépendance réactive

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) return;

    const noteData: CreateNoteDto = {
      ...formData,
      userId: user?.id ? Number(user.id) : 0
    };

    onSubmit(noteData);
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title={editingNote ? 'Modifier la note' : 'Nouvelle note'}
    >
      <Stack spacing={3}>
        <TextField
          name="title"
          label="Titre de la note"
          placeholder="Ex: Liste de courses, Idées de voyage..."
          fullWidth
          value={formData.title}
          onChange={handleChange}
          required
          autoFocus
          variant="outlined"
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
        />

        <TextField
          select
          name="priority"
          label="Priorité"
          value={formData.priority}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
        >
          <MenuItem value={NotePriority.HIGH}>Haute (Important)</MenuItem>
          <MenuItem value={NotePriority.MEDIUM}>Moyenne</MenuItem>
          <MenuItem value={NotePriority.LOW}>Basse (Basique)</MenuItem>
        </TextField>

        <TextField
          name="content"
          label="Contenu"
          placeholder="Détaillez votre pensée ici..."
          fullWidth
          multiline
          rows={6}
          value={formData.content}
          onChange={handleChange}
          required
          variant="outlined"
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
        />
      </Stack>
    </BaseModal>
        
  );
}