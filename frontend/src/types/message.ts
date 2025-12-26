export interface Message {
  id: number;
  content: string;
  senderId: number;
  chatId: number;
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
}
