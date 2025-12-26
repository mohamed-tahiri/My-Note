import { api } from './api';
import type { 
  CreateNoteDto, 
  UpdateNoteDto 
} from '../types/note';

export const notesService = {
  getAll: () => api.get('/notes'),
  getById: (id: number) => api.get(`/notes/${id}`),
  create: (data: CreateNoteDto) => api.post('/notes', data),
  update: (id: number, data: UpdateNoteDto) => api.patch(`/notes/${id}`, data),
  delete: (id: number) => api.delete(`/notes/${id}`),
};
