import { api } from './api';
import type {
  CreateAppointmentDto,
  UpdateAppointmentDto,
} from '../types/appointment';

export const appointmentsService = {
  getAll: () => api.get('/appointments'),

  getById: (id: number) => api.get(`/appointments/${id}`),

  create: (data: CreateAppointmentDto) =>
    api.post('/appointments', data),

  update: (id: number, data: UpdateAppointmentDto) =>
    api.patch(`/appointments/${id}`, data),

  delete: (id: number) =>
    api.delete(`/appointments/${id}`),
};