import type { CreateAppointmentDto, UpdateAppointmentDto } from '@/types/appointment';
import { api } from './api';

/**
 * Récupère tous les rendez-vous.
 * @returns Une promesse contenant la liste des rendez-vous.
 */
export const getAll = () => api.get('/appointments');

/**
 * Récupère un rendez-vous par son ID.
 * @param id L'identifiant du rendez-vous
 * @returns Une promesse contenant le rendez-vous correspondant
 */
export const getById = (id: number) => api.get(`/appointments/${id}`);

/**
 * Crée un nouveau rendez-vous.
 * @param data Données du rendez-vous à créer
 * @returns Une promesse contenant le rendez-vous créé
 */
export const create = (data: CreateAppointmentDto) => api.post('/appointments', data);

/**
 * Met à jour un rendez-vous existant.
 * @param id L'identifiant du rendez-vous à mettre à jour
 * @param data Données à mettre à jour
 * @returns Une promesse contenant le rendez-vous mis à jour
 */
export const update = (id: number, data: UpdateAppointmentDto) =>
  api.patch(`/appointments/${id}`, data);

/**
 * Supprime un rendez-vous par son ID.
 * @param id L'identifiant du rendez-vous à supprimer
 * @returns Une promesse indiquant le succès de la suppression
 */
export const deleteAppointment = (id: number) => api.delete(`/appointments/${id}`);
