import { api } from './api';
import type { CreateChatDto } from '../types/chat';

export const chatService = {
  getAll: () => api.get('/chat'),

  getById: (id: number) => api.get(`/chat/${id}`),

  create: (data: CreateChatDto) =>
    api.post('/chat', data),
};
