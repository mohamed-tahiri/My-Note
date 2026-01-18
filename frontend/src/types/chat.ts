import type { Message } from './message';
import type { User } from './user';

export interface Chat {
    id: number;
    name: string;
    type: string;
    participants: User[];
    messages: Message[];
    lastMessage: Message;
    createdAt: string;
    updatedAt: string;
}

export interface CreateChatDto {
    name: string;
    type: 'private' | 'task_group';
    participantIds: number[];
}

export interface UpdateChatDto {
    name?: string;
    type?: string;
    participantIds?: number[];
}
