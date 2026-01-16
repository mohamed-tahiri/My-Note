import type { Chat } from "./chat";
import type { User } from "./user";

export interface Message {
  id: number;
  content: string;
  sender: User;
  senderId: number;
  chat: Chat;
  chatId: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMessageDto {
  content: string;
  senderId: number;
  chatId: number;
}

export interface UpdateMessageDto {
  content?: string;
  isDeleted?: boolean;
}
