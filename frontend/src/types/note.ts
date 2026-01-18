import type { NotePriority } from '@/enums/note';

export interface Note {
    id: number;
    title: string;
    content: string;
    userId: number;
    priority: NotePriority;
    createdAt: string;
    updatedAt: string;
}

export interface CreateNoteDto {
    title: string;
    content: string;
    userId: number;
    priority: NotePriority;
}

export interface UpdateNoteDto {
    title?: string;
    content?: string;
    priority?: NotePriority;
}
