import React, { useEffect, useEffectEvent, useState } from 'react';
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
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from '@/hooks/useAuth';
import type { CreateNoteDto, Note, UpdateNoteDto } from '@/types/note';
import { logger } from '@/utils/logger';
import { NotePriority } from '@/enums/note';

interface Props {
  isOpen: boolean;
  onSubmit: (data: CreateNoteDto) => void;
  editingNote?: Note;
  onClose: () => void;
}

export function NoteFormModal({
  isOpen,
  onSubmit,
  editingNote,
  onClose,
}: Props) {
  const { user } = useAuth();

  // Initialisation avec le champ priority par défaut à 'low'
  const [formData, setFormData] = useState<{
    title: string;
    content: string;
    priority: NotePriority;
  }>({
    title: '',
    content: '',
    priority: NotePriority.LOW,
  });

  const updateDate = useEffectEvent((note: UpdateNoteDto) => {
    setFormData({
      title: note.title ?? '', 
      content: note.content ?? '',
      priority: note.priority ?? NotePriority.LOW,
    });
  });

  useEffect(() => {
    if (!isOpen) return;

    if (editingNote) {
      updateDate(editingNote);
    } else {
      updateDate({ title: '', content: '', priority: NotePriority.LOW });
    }
  }, [editingNote, isOpen]);

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

    logger.log('Saving note data:', noteData);

    onSubmit(noteData);
    onClose();
  };

  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: { 
            borderRadius: '16px', 
            p: 1,
            backgroundImage: 'none'
        }
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" fontWeight={800} color="primary.main">
          {editingNote ? 'Modifier la note' : 'Nouvelle note'}
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ color: 'text.secondary', '&:hover': { bgcolor: 'background.default' } }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <DialogContent dividers sx={{ borderBottom: 'none', py: 3 }}>
          <Stack spacing={3}>
            {/* Champ Titre */}
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

            {/* Champ Priorité (Select) */}
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

            {/* Champ Contenu */}
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
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 1, gap: 1 }}>
          <Button 
            onClick={onClose} 
            color="inherit" 
            sx={{ fontWeight: 600, textTransform: 'none', color: 'text.secondary', px: 3 }}
          >
            Annuler
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disableElevation
            sx={{ 
              fontWeight: 700, 
              textTransform: 'none', 
              px: 4,
              borderRadius: '10px',
              bgcolor: 'primary.main',
              '&:hover': { bgcolor: 'primary.light' }
            }}
          >
            {editingNote ? 'Mettre à jour' : 'Enregistrer'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}