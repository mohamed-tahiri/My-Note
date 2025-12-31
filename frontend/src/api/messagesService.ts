import { api } from './api';
import type { CreateMessageDto, UpdateMessageDto } from '@/types/message';

/**
 * Récupère tous les messages d’un chat donné.
 * @param chatId L'identifiant du chat
 * @returns Une promesse contenant la liste des messages du chat
 */
export const getByChat = (chatId: number) => api.get(`/messages/${chatId}`);

/**
 * Crée un nouveau message.
 * @param data Données du message à créer
 * @returns Une promesse contenant le message créé
 */
export const create = (data: CreateMessageDto) => api.post('/messages', data);

/**
 * Met à jour un message existant.
 * @param id L'identifiant du message à mettre à jour
 * @param data Données à mettre à jour
 * @returns Une promesse contenant le message mis à jour
 */
export const update = (id: number, data: UpdateMessageDto) => api.patch(`/messages/${id}`, data);

/**
 * Supprime un message par son ID.
 * @param id L'identifiant du message à supprimer
 * @returns Une promesse indiquant le succès de la suppression
 */
export const deleteMessage = (id: number) => api.delete(`/messages/${id}`);
