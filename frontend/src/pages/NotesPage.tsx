import { useState } from 'react';
import { Box, Typography, Stack } from '@mui/material';

import { useNotesByUser, useNoteMutations } from '@/hooks/queries/useNoteQueries';
import { useAuth } from '@/hooks/useAuth';
import { NotesList } from '@/components/notes/NotesList';
import { NoteFormModal } from '@/components/notes/NoteForm';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { AsyncWrapper } from '@/components/ui/AsyncWrapper';
import type { Note, CreateNoteDto } from '@/types/note';
import FadButton from '@/components/ui/FadButton';

export default function NotesPage() {
  const { user } = useAuth(); 
  
  // 1. DATA FETCHING avec TanStack Query
  const { data: notes, isLoading, error, refetch } = useNotesByUser(user?.id);
  
  // 2. MUTATIONS
  const { createNote, updateNote, deleteNote } = useNoteMutations();

  // 3. UI STATES (Uniquement pour les modales)
  const [editingNote, setEditingNote] = useState<Note | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleCreateOrUpdate = (data: CreateNoteDto) => {
    if (editingNote) {
      updateNote.mutate({ id: editingNote.id, data }, {
        onSuccess: () => setIsModalOpen(false)
      });
    } else {
      createNote.mutate(data, {
        onSuccess: () => setIsModalOpen(false)
      });
    }
  };

  const handleConfirmDelete = () => {
    if (selectedId) {
      deleteNote.mutate(selectedId, {
        onSuccess: () => setConfirmOpen(false)
      });
    }
  };

  const onHandleFad = () => {
    setEditingNote(undefined); 
    setIsModalOpen(true);
  }

  return (
    <Box sx={{ position: 'relative', pb: 8 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight={800}>Mes Notes</Typography>
          <Typography variant="body2" color="text.secondary">
            Gérez vos idées et vos projets personnels.
          </Typography>
        </Box>
      </Stack>

      <AsyncWrapper 
        loading={isLoading} 
        error={error} 
        isEmpty={!notes || notes.length === 0}
        emptyMessage="Vous n'avez pas encore de notes. Commencez par en créer une !"
        onRetry={() => refetch()}
      >
        <NotesList
          notes={notes || []}
          onEdit={(note) => { setEditingNote(note); setIsModalOpen(true); }}
          onDelete={(id) => { setSelectedId(id); setConfirmOpen(true); }}
        />
      </AsyncWrapper>
      
      <ConfirmDialog
        isOpen={confirmOpen}
        title="Supprimer la note ?"
        description=''
        onConfirm={handleConfirmDelete}
        onClose={() => setConfirmOpen(false)}
      />

      <NoteFormModal
        isOpen={isModalOpen}
        editingNote={editingNote}
        onSubmit={handleCreateOrUpdate}
        onClose={() => setIsModalOpen(false)}
      />
      
      <FadButton onHandleFad={onHandleFad}  />
    </Box>
  );
}