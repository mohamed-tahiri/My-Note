import { api } from './api';
import type { Notification } from '../types/notification';

export const notificationsService = {
  getByUserId: (userId: number) => api.get<Notification[]>(`/notifications/user/${userId}`),
  markAsRead: (id: number) => api.post(`/notifications/${id}/read`),
  markAllAsRead: (userId: number) => api.post(`/notifications/user/${userId}/read-all`),
};