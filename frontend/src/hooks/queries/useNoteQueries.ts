import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getAll, 
  getAllByUser, 
  getById, 
  create, 
  update, 
  deleteNote 
} from '@/api/notesService';
import type { CreateNoteDto, UpdateNoteDto } from '@/types/note';

// 1. Définition des clés de cache
export const noteKeys = {
  all: ['notes'] as const,
  lists: () => [...noteKeys.all, 'list'] as const,
  byUser: (userId: number) => [...noteKeys.lists(), 'user', userId] as const,
  detail: (id: number) => [...noteKeys.all, 'detail', id] as const,
};

/**
 * HOOKS DE LECTURE (QUERIES)
 */

// Récupérer toutes les notes (Admin ou Vue globale)
export const useNotes = () => {
  return useQuery({
    queryKey: noteKeys.lists(),
    queryFn: () => getAll().then(res => res.data),
  });
};

// Récupérer les notes d'un utilisateur spécifique
export const useNotesByUser = (userId: number | undefined) => {
  return useQuery({
    queryKey: noteKeys.byUser(userId!),
    queryFn: () => getAllByUser(userId!).then(res => res.data),
    enabled: !!userId, // Empêche la requête si l'ID n'est pas fourni
    staleTime: 1000 * 60 * 5, // Cache de 5 minutes
  });
};

// Récupérer le détail d'une note
export const useNoteDetail = (id: number | undefined) => {
  return useQuery({
    queryKey: noteKeys.detail(id!),
    queryFn: () => getById(id!).then(res => res.data),
    enabled: !!id,
  });
};

/**
 * HOOKS D'ÉCRITURE (MUTATIONS)
 */

export const useNoteMutations = () => {
  const queryClient = useQueryClient();

  // Création d'une note
  const createMutation = useMutation({
    mutationFn: (data: CreateNoteDto) => create(data).then(res => res.data),
    onSuccess: () => {
      // Invalide toutes les listes pour voir la nouvelle note
      queryClient.invalidateQueries({ queryKey: noteKeys.lists() });
    },
  });

  // Mise à jour d'une note
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateNoteDto }) => 
      update(id, data).then(res => res.data),
    onSuccess: (updatedNote) => {
      // Met à jour le cache spécifique de la note
      queryClient.setQueryData(noteKeys.detail(updatedNote.id), updatedNote);
      // Invalide les listes pour refléter les changements (titre, etc.)
      queryClient.invalidateQueries({ queryKey: noteKeys.lists() });
    },
  });

  // Suppression d'une note
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noteKeys.lists() });
    },
  });

  return {
    createNote: createMutation,
    updateNote: updateMutation,
    deleteNote: deleteMutation,
  };
};