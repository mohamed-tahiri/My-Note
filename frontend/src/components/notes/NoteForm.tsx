import { useState } from 'react';
import type { CreateNoteDto, Note } from '../../types/note';

interface Props {
  onSubmit: (data: CreateNoteDto, id?: number) => void;
  editingNote?: Note;
  onCancel?: () => void;
}

export function NoteForm({ onSubmit, editingNote, onCancel }: Props) {
  const [formData, setFormData] = useState({
    title: editingNote?.title || '',
    content: editingNote?.content || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;

    onSubmit(
      { ...formData, userId: 1 },
      editingNote?.id
    );

    if (!editingNote) {
      setFormData({ title: '', content: '' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow space-y-3">
      <h2 className="text-lg font-semibold">
        {editingNote ? 'Edit Note' : 'Create Note'}
      </h2>

      <input
        name="title"
        className="w-full border rounded px-3 py-2"
        placeholder="Title"
        value={formData.title}
        onChange={handleChange}
        required
      />

      <textarea
        name="content"
        className="w-full border rounded px-3 py-2"
        placeholder="Content"
        rows={4}
        value={formData.content}
        onChange={handleChange}
        required
      />

      <div className="flex gap-2">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          {editingNote ? 'Update' : 'Create'}
        </button>
        {editingNote && (
          <button type="button" onClick={onCancel} className="bg-gray-400 text-white px-4 py-2 rounded">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}