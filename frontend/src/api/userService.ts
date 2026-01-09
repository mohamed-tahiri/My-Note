import api from './api';

/**
 * Récupère toutes les utilisateurs.
 * @returns Une promesse contenant la liste des utilisateurs
 */
export const getAll = () => api.get('/users');