import type { Message } from "./message";
import type { User } from "./user";

export interface Chat {
  id: number;
  participants: User[];
  name: string;
  type: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateChatDto {
  participantIds: number[];
}

export interface UpdateChatDto {
  participantIds?: number[];
}
