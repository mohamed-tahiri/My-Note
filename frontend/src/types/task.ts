import type { User } from './user';

export interface Task {
    id: number;
    title: string;
    description: string;
    assignees: User[];
    status: string;
    relatedNoteId?: number;
    dueDate: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateTaskDto {
    title: string;
    description: string;
    assigneeIds: number[];
    status: string;
    dueDate: string;
    relatedNoteId?: number;
}

export interface UpdateTaskDto {
    title?: string;
    description?: string;
    assigneeIds?: number[];
    status?: string;
    dueDate?: string;
    relatedNoteId?: number;
}
