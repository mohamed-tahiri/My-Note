import { Link } from 'react-router-dom';
import type { Note } from '../../types/note';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface Props {
  note: Note;
  onEdit: () => void;
  onDelete: () => void;
}

export function NoteItem({ note, onEdit, onDelete }: Props) {
  return (
    <div className="flex  items-center justify-between bg-indigo-50 hover:bg-indigo-100 border-l-4 border-l-indigo-600 p-4 shadow-sm hover:shadow-md transition">
      
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
          className="text-sm text-indigo-600 cursor-pointer"
        >
          <EditIcon />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="text-sm text-red-600 cursor-pointer"
        >
          <DeleteIcon />
        </button>
      </div>
    </div>
  );
}
