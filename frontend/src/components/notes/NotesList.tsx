import type { Note } from '../../types/note';
import { NoteItem } from './NoteItem';

interface Props {
  notes: Note[];
  onEdit: (note: Note) => void;
  onDelete: (id: number) => void;
}

export function NotesList({ notes, onEdit, onDelete }: Props) {
  return (
    <div className="grid gap-2">
      {notes.map((note) => (
        <NoteItem
          key={note.id}
          note={note}
          onEdit={() => onEdit(note)}
          onDelete={() => onDelete(note.id)}
        />
      ))}
    </div>
  );
}
