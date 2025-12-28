import { api } from './api';
import type { 
    CreateTaskDto, 
    UpdateTaskDto 
} from '../types/task';

export const tasksService = {
  getAll: () => api.get('/tasks'),

  getTasksByNote: (noteId: number) => api.get(`/tasks/${noteId}/note`),

  getById: (id: number) => api.get(`/tasks/${id}`),

  create: (data: CreateTaskDto) =>
    api.post('/tasks', data),

  update: (id: number, data: UpdateTaskDto) =>
    api.patch(`/tasks/${id}`, data),

  delete: (id: number) =>
    api.delete(`/tasks/${id}`),
};
