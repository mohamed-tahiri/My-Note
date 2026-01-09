export type AppointmentType = 'Professional' | 'Personal' | 'Medical';

export interface Appointment {
  id: number;
  title: string;
  startAt: string;
  endAt: string; 
  location?: string;
  type: AppointmentType;
  userId: number;
  assignedToId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAppointmentDto {
  title: string;
  startAt: string;
  endAt: string;
  type: AppointmentType;
  location?: string;
  userId: number;
  assignedToId?: number;
}

export interface UpdateAppointmentDto {
  title?: string;
  startAt?: string;
  endAt?: string;
  type?: AppointmentType;
  location?: string;
  userId?: number;
  assignedToId?: number;
}