import { Link } from 'react-router-dom';
import type { Note } from '../../types/note';

interface Props {
  note: Note;
  onEdit: () => void;
  onDelete: () => void;
}

export function NoteItem({ note, onEdit, onDelete }: Props) {
  return (
    <div className="relative rounded-lg border bg-white p-4 shadow-sm hover:shadow-md transition">
      
      {/* Zone cliquable */}
      <Link to={`/notes/${note.id}`} className="block">
        <h3 className="font-semibold text-lg text-gray-800">
          {note.title}
        </h3>
        <p className="text-gray-600 mt-1 line-clamp-2">
          {note.content}
        </p>
      </Link>

      {/* Actions */}
      <div className="flex justify-end gap-3 mt-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="text-sm text-indigo-600 hover:underline"
        >
          Edit
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="text-sm text-red-600 hover:underline"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
