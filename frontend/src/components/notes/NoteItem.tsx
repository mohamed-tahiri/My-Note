import type { Note } from '../../types/note';

interface Props {
  note: Note;
  onEdit: () => void;
  onDelete: () => void;
}

export function NoteItem({ note, onEdit, onDelete }: Props) {
  return (
    <div className="border rounded p-4 bg-white shadow">
      <h3 className="font-semibold text-lg">{note.title}</h3>
      <p className="text-gray-600 mt-1">{note.content}</p>

      <div className="flex gap-2 mt-3">
        <button
          onClick={onEdit}
          className="text-sm text-blue-600 hover:underline"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="text-sm text-red-600 hover:underline"
        >
          Delete
        </button>
      </div>
    </div>
  );
}