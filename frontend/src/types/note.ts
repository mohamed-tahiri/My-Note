export interface Note {
  id: number;
  title: string;
  content: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoteDto {
  title: string;
  content: string;
  userId: number;
}

export interface UpdateNoteDto {
  title?: string;
  content?: string;
}
