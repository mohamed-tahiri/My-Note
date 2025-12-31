import { api } from './api';
import type { CreateChatDto } from '@/types/chat';

/**
 * Récupère tous les messages de chat.
 * @returns Une promesse contenant la liste des messages
 */
export const getAll = () => api.get('/chat');

/**
 * Récupère un message de chat par son ID.
 * @param id L'identifiant du message
 * @returns Une promesse contenant le message correspondant
 */
export const getById = (id: number) => api.get(`/chat/${id}`);

/**
 * Crée un nouveau message de chat.
 * @param data Données du message à créer
 * @returns Une promesse contenant le message créé
 */
export const create = (data: CreateChatDto) => api.post('/chat', data);
