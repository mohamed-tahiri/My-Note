export interface Task {
  id: number;
  title: string;
  description: string;
  assigneeId: number;
  status: string;
  relatedNoteId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskDto {
  title: string;
  description: string;
  assigneeId: number;
  relatedNoteId?: number;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  assigneeId?: number;
  relatedNoteId?: number;
}

