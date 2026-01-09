import { useCallback, useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Fab, 
  Stack, 
  CircularProgress, 
  Fade 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import { create, update, deleteNote, getAllByUser } from '@/api/notesService';
import type { Note, CreateNoteDto } from '@/types/note';
import { NotesList } from '@/components/notes/NotesList';
import { NoteFormModal } from '@/components/notes/NoteForm';
import { logger } from '@/utils/logger';
import { useAuth } from '@/hooks/useAuth';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

export default function NotesPage() {
  const { user } = useAuth(); 
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingNote, setEditingNote] = useState<Note | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const loadNotes = useCallback(async () => {
    try {
      if (!user?.id) return;
      const res = await getAllByUser(user.id);
      setNotes(res.data);
    } catch (error) {
      logger.error('Failed to load notes', error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  const handleCreateOrUpdate = async (data: CreateNoteDto) => {
    try {
      if (editingNote) {
        await update(editingNote.id, data);
      } else {
        await create(data);
      }
      setIsModalOpen(false);
      setEditingNote(undefined);
      await loadNotes();
    } catch (error) {
      logger.error('Failed to save note', error);
    }
  };


  const openDeleteConfirm = (id: number) => {
    setSelectedId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedId) {
      try {
        await deleteNote(selectedId);
        await loadNotes();
        setConfirmOpen(false);
      } catch (error) {
        logger.error('Delete failed', error);
      }
    }
  };

  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingNote(undefined);
    setIsModalOpen(true);
  };

  const handleClose = () => {          
    setIsModalOpen(false);
    setEditingNote(undefined);
  }

  return (
    <Box sx={{ position: 'relative', pb: 8 }}>
      {/* Header avec Titre Moderne */}
      <Stack 
        direction="row" 
        justifyContent="space-between" 
        alignItems="center" 
        sx={{ mb: 4 }}
      >
        <Box>
          <Typography variant="h4" gutterBottom>
            Mes Notes
          </Typography>
          <Typography variant="subtitle2">
            Gérez vos idées et vos projets personnels.
          </Typography>
        </Box>
      </Stack>

      {/* État de chargement ou Liste */}
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <Fade in={!isLoading}>
          <Box>
            <NotesList
              notes={notes}
              onEdit={handleEdit}
              onDelete={openDeleteConfirm}
            />
          </Box>
        </Fade>
      )}
      
      <ConfirmDialog
        isOpen={confirmOpen}
        title="Confirmer la suppression"
        description="Cette action est irréversible. Voulez-vous vraiment supprimer cet élément ?"
        onConfirm={handleConfirmDelete}
        onClose={() => setConfirmOpen(false)}
      />

      {/* Modal Formulaire */}
      <NoteFormModal
        isOpen={isModalOpen}
        editingNote={editingNote}
        onSubmit={handleCreateOrUpdate}
        onClose={handleClose}
      />

      {/* Bouton d'ajout Flottant (Design Moderne) */}
      <Fab 
        color="primary" 
        aria-label="add" 
        onClick={handleCreate}
        sx={{ 
          position: 'fixed', 
          bottom: { xs: 80, md: 40 }, // Ajusté pour le footer mobile
          right: { xs: 20, md: 40 },
          boxShadow: '0px 4px 20px rgba(15, 23, 42, 0.3)'
        }}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
}