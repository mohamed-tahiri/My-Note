import { useState } from 'react';
import type { CreateNoteDto, Note } from '../../types/note';

interface Props {
  onSubmit: (data: CreateNoteDto) => void;
  initialData?: Note;
}

export function NoteForm({ onSubmit, initialData }: Props) {
  const [title, setTitle] = useState(initialData?.title ?? '');
  const [content, setContent] = useState(initialData?.content ?? '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit({
      title,
      content,
      userId: 1, // 🔴 temporaire (pas d’auth)
    });

    setTitle('');
    setContent('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded shadow space-y-3"
    >
      <h2 className="text-lg font-semibold">
        {initialData ? 'Edit Note' : 'Create Note'}
      </h2>

      <input
        className="w-full border rounded px-3 py-2"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <textarea
        className="w-full border rounded px-3 py-2"
        placeholder="Content"
        rows={4}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {initialData ? 'Update' : 'Create'}
      </button>
    </form>
  );
}
