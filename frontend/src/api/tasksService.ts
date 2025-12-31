import { api } from './api';
import type { CreateTaskDto, UpdateTaskDto } from '@/types/task';

/**
 * Récupère toutes les tâches.
 * @returns Une promesse contenant la liste des tâches
 */
export const getAll = () => api.get('/tasks');

/**
 * Récupère toutes les tâches liées à une note spécifique.
 * @param noteId L'identifiant de la note
 * @returns Une promesse contenant la liste des tâches liées à la note
 */
export const getTasksByNote = (noteId: number) => api.get(`/tasks/${noteId}/note`);

/**
 * Récupère toutes les tâches liées à un utilisateur spécifique.
 * @param userId L'identifiant de l'utilisateur
 * @returns Une promesse contenant la liste des tâches liées à l'utilisateur
 */
export const getTasksByUser = (userId: number) => api.get(`/tasks/${userId}/user`);

/**
 * Récupère une tâche par son ID.
 * @param id L'identifiant de la tâche
 * @returns Une promesse contenant la tâche correspondante
 */
export const getById = (id: number) => api.get(`/tasks/${id}`);

/**
 * Crée une nouvelle tâche.
 * @param data Données de la tâche à créer
 * @returns Une promesse contenant la tâche créée
 */
export const create = (data: CreateTaskDto) => api.post('/tasks', data);

/**
 * Met à jour une tâche existante.
 * @param id L'identifiant de la tâche à mettre à jour
 * @param data Données à mettre à jour
 * @returns Une promesse contenant la tâche mise à jour
 */
export const update = (id: number, data: UpdateTaskDto) => api.patch(`/tasks/${id}`, data);

/**
 * Supprime une tâche par son ID.
 * @param id L'identifiant de la tâche à supprimer
 * @returns Une promesse indiquant le succès de la suppression
 */
export const deleteTask = (id: number) => api.delete(`/tasks/${id}`);
