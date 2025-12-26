export interface Appointment {
  id: number;
  title: string;
  startAt: string;
  endAt: string;
  userId: number;
  assignedToId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAppointmentDto {
  title: string;
  startAt: string;
  endAt: string;
  userId: number;
  assignedToId?: number;
}

export interface UpdateAppointmentDto {
  title?: string;
  startAt?: string;
  endAt?: string;
  userId?: number;
  assignedToId?: number;
}
