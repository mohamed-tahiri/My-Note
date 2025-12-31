import { useEffect, useState } from 'react';
import { getAll, create, update, deleteNote } from '@/api/notesService';
import type { Note, CreateNoteDto } from '@/types/note';
import { NotesList } from '@/components/notes/NotesList';
import { NoteFormModal } from '@/components/notes/NoteForm';
import AddIcon from '@mui/icons-material/Add';
import { logger } from '@/utils/logger';

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [editingNote, setEditingNote] = useState<Note | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadNotes = async () => {
    try {
      const res = await getAll();
      setNotes(res.data);
    } catch (error) {
      logger.error('Failed to load notes', error);
    }
  };

  useEffect(() => {
    const initializeNotes = async () => {
      await loadNotes();
    };
    
    initializeNotes();
  }, []);

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

  const handleDelete = async (id: number) => {
    try {
      await deleteNote(id);
      await loadNotes();
    } catch (error) {
      logger.error('Failed to delete note', error);
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

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Notes</h1>
        <button
          onClick={handleCreate}
          className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
        >
          <AddIcon fontSize="medium" />
        </button>
      </div>

      {/* Modal */}
      <NoteFormModal
        isOpen={isModalOpen}
        editingNote={editingNote}
        onSubmit={handleCreateOrUpdate}
        onClose={() => {
          setIsModalOpen(false);
          setEditingNote(undefined);
        }}
      />

      {/* Notes list */}
      <NotesList
        notes={notes}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
