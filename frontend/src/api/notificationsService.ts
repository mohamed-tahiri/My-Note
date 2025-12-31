import { api } from './api';
import type { Notification } from '@/types/notification';

/**
 * Récupère toutes les notifications d’un utilisateur.
 * @param userId L'identifiant de l'utilisateur
 * @returns Une promesse contenant la liste des notifications
 */
export const getByUserId = (userId: number) => 
  api.get<Notification[]>(`/notifications/user/${userId}`);

/**
 * Marque une notification comme lue.
 * @param id L'identifiant de la notification
 * @returns Une promesse indiquant le succès de l'opération
 */
export const markAsRead = (id: number) => 
  api.post(`/notifications/${id}/read`);

/**
 * Marque toutes les notifications d'un utilisateur comme lues.
 * @param userId L'identifiant de l'utilisateur
 * @returns Une promesse indiquant le succès de l'opération
 */
export const markAllAsRead = (userId: number) => 
  api.post(`/notifications/user/${userId}/read-all`);
