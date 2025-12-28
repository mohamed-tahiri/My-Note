import { useEffect, useState } from 'react';
import { notesService } from '../api/notesService';
import type { Note, CreateNoteDto } from '../types/note';
import { NoteForm } from '../components/notes/NoteForm';
import { NotesList } from '../components/notes/NotesList';
import { Header } from '../components/layout/Header';

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  const loadNotes = async () => {
    try {    
      const res = await notesService.getAll();
      setNotes(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const init = async () => {
      await loadNotes();
    };

    init();
  }, []);

  const handleCreateOrUpdate = async (data: CreateNoteDto) => {
    if (editingNote) {
      await notesService.update(editingNote.id, data);
      setEditingNote(null);
    } else {
      await notesService.create(data);
    }
    loadNotes();
  };

  const handleDelete = async (id: number) => {
    await notesService.delete(id);
    loadNotes();
  };

  return (
    <>
      <Header />
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-bold">Notes</h1>

        <NoteForm
          key={editingNote ? editingNote.id : 'new'}
          onSubmit={handleCreateOrUpdate}
          editingNote={editingNote ?? undefined}
        />

        <NotesList
          notes={notes}
          onEdit={setEditingNote}
          onDelete={handleDelete}
        />
      </div>
    </>
  );
}
