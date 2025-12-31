import { api } from './api';
import type { CreateNoteDto, UpdateNoteDto } from '@/types/note';

/**
 * Récupère toutes les notes.
 * @returns Une promesse contenant la liste des notes
 */
export const getAll = () => api.get('/notes');

/**
 * Récupère une note par son ID.
 * @param id L'identifiant de la note
 * @returns Une promesse contenant la note correspondante
 */
export const getById = (id: number) => api.get(`/notes/${id}`);

/**
 * Crée une nouvelle note.
 * @param data Données de la note à créer
 * @returns Une promesse contenant la note créée
 */
export const create = (data: CreateNoteDto) => api.post('/notes', data);

/**
 * Met à jour une note existante.
 * @param id L'identifiant de la note à mettre à jour
 * @param data Données à mettre à jour
 * @returns Une promesse contenant la note mise à jour
 */
export const update = (id: number, data: UpdateNoteDto) => api.patch(`/notes/${id}`, data);

/**
 * Supprime une note par son ID.
 * @param id L'identifiant de la note à supprimer
 * @returns Une promesse indiquant le succès de la suppression
 */
export const deleteNote = (id: number) => api.delete(`/notes/${id}`);
