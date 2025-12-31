import { useEffect, useState } from 'react';
import type { CreateNoteDto, Note } from '../../types/note';

interface Props {
  isOpen: boolean;
  onSubmit: (data: CreateNoteDto, id?: number) => void;
  editingNote?: Note;
  onClose: () => void;
}

export function NoteFormModal({
  isOpen,
  onSubmit,
  editingNote,
  onClose,
}: Props) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });

  // Sync when editing
  useEffect(() => {
    if (editingNote) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        title: editingNote.title,
        content: editingNote.content,
      });
    } else {
      setFormData({ title: '', content: '' });
    }
  }, [editingNote, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;

    onSubmit(
      { ...formData, userId: 1 },
      editingNote?.id
    );

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 h-[100vh] z-50 flex items-center justify-center">
      
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg rounded-lg bg-white shadow-lg">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h2 className="text-lg font-semibold">
            {editingNote ? 'Edit Note' : 'Create Note'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="space-y-4 p-4">
          <input
            name="title"
            className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <textarea
            name="content"
            rows={5}
            className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Content"
            value={formData.content}
            onChange={handleChange}
            required
          />

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
            >
              {editingNote ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
