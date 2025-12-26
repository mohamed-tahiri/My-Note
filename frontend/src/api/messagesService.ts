import { api } from './api';
import type {
  CreateMessageDto,
  UpdateMessageDto,
} from '../types/message';

export const messagesService = {
  getByChat: (chatId: number) =>
    api.get(`/messages/${chatId}`),

  create: (data: CreateMessageDto) =>
    api.post('/messages', data),

  update: (id: number, data: UpdateMessageDto) =>
    api.patch(`/messages/${id}`, data),

  delete: (id: number) =>
    api.delete(`/messages/${id}`),
};