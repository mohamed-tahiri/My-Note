import type { Chat } from "./chat";
import { Socket } from 'socket.io-client';
import type { Message } from "./message";
import type { Appointment, CreateAppointmentDto } from "./appointment";
import type { CreateNoteDto, Note } from "./note";
import type { Task } from "./task";
import { type SxProps, type Theme } from '@mui/material';
import { type ElementType } from 'react';
import type { User } from "./user";

export interface NotificationsDropdownProps {
  socket: Socket;
  userId: string | number;
}

export interface ChatInputProps {
    message: string;
    setMessage: (value: string) => void;
    handleSend: (e: React.FormEvent) => void;
    editingMessage: Message | null;
    cancelEdit: () => void;
    disabled?: boolean;
    placeholder?: string;
    variant?: 'compact' | 'full';
}

export interface ChatInfoDrawerProps {
  open: boolean;
  onClose: () => void;
  chat: Chat;
}

export interface ChatItemProps {
  chat: Chat;
  currentUserId: number;
  isActive?: boolean;
  onClick: () => void;
  variant?: 'sidebar' | 'dropdown';
}

export interface ChatMessageProps {
    message: Message;
    isMe: boolean;
    onDelete?: (id: number) => void;
    onEdit?: (message: Message) => void;
}

export interface AppointmentFormModalProps {
  isOpen: boolean;
  onSubmit: (data: CreateAppointmentDto) => void;
  onClose: () => void;
  editingAppointment?: Appointment;
}

export interface AppointmentItemProps {
  appointment: Appointment;
  onEdit: (appointment: Appointment) => void;
  onDelete: (id: number) => void;
}

export interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export interface AppointmentsListProps {
  appointments: Appointment[];
  onEdit: (appointment: Appointment) => void;
  onDelete: (id: number) => void;
}

export interface ChatSidebarProps {
  chats: Chat[];
  loading: boolean;
  activeChatId?: string;
  currentUserId: number;
  onOpenCreateModal: () => void;
}

export interface CreateChatModalProps {
  open: boolean;
  onClose: () => void;
}

export interface HeaderProps {
  handleClose: () => void;
}

export interface IconProps {
  handleOpen: (event: React.MouseEvent<HTMLElement>) => void;
  unreadCount: number;
}

export interface FloatingChatProps {
  chatId: number;
  onClose: () => void;
}

export interface HeaderChatProps {
  chat: Chat,
  setMinimized: (value: boolean) => void,
  onClose: () => void;
}

export interface MinimizedChatProps {
  chat: Chat,
  setMinimized: (value: boolean) => void,
  onClose: () => void;
}

export interface HeaderAdminProps {
  onMenuClick: () => void;
}

export interface NoteFormModalProps {
  isOpen: boolean;
  onSubmit: (data: CreateNoteDto) => void;
  editingNote?: Note;
  onClose: () => void;
}

export interface NoteItemProps {
  note: Note;
  onEdit: () => void;
  onDelete: () => void;
}

export interface NotesListProps {
  notes: Note[];
  onEdit: (note: Note) => void;
  onDelete: (id: number) => void;
}

export interface NoteTasksListProps {
  note: Note;
  tasks: Task[];
  tasksLoading: boolean;
  reloadTasks: () => void;
}

export interface TaskModalProps {
  noteId?: number;
  task?: Task | null;
  isOpen: boolean;
  onClose: () => void;
}

export interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onToggleStatus?: (task: Task, newStatus?: string) => void;
}

export interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onToggleStatus?: (task: Task) => void;
}

export interface AsyncWrapperProps {
  loading: boolean;
  error: Error | null;
  children: React.ReactNode;
  isEmpty?: boolean;
  emptyMessage?: string;
  onRetry?: () => void;
}

export interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onClose: () => void;
  isLoading?: boolean;
}

export interface HeaderChatWindow {
    chat: Chat;
    user: User | null;
    setInfoOpen: (info: boolean) => void
}

export interface EmptyStateProps {
  icon: ElementType; 
  title: string;
  description: string;
  sx?: SxProps<Theme>;
}