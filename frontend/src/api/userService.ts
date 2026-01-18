import api from './api';
import type { UpdateUserDto, User } from '@/types/user';

/**
 * Récupère toutes les utilisateurs.
 * @returns Une promesse contenant la liste des utilisateurs
 */
export const getAll = () => api.get('/users');

/**
 * Met à jour le profil utilisateur
 */
export const updateProfile = async (id: number, data: UpdateUserDto): Promise<User> => {
  const response = await api.patch<User>(`/users/${id}`, data);
  return response.data;
};