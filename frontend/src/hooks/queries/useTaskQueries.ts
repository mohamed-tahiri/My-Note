import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getAll,
    getTasksByNote,
    getTasksByUser,
    getById,
    create,
    update,
    deleteTask,
} from '@/api/tasksService';
import type { CreateTaskDto, UpdateTaskDto } from '@/types/task';
import { logger } from '@/utils/logger';

// 1. Définition des clés de cache (Query Keys)
export const taskKeys = {
    all: ['tasks'] as const,
    lists: () => [...taskKeys.all, 'list'] as const,
    byNote: (noteId: number) => [...taskKeys.lists(), 'note', noteId] as const,
    byUser: (userId: number) => [...taskKeys.lists(), 'user', userId] as const,
    detail: (id: number) => [...taskKeys.all, 'detail', id] as const,
};

/**
 * HOOKS DE LECTURE (QUERIES)
 */

export const useTasks = () => {
    return useQuery({
        queryKey: taskKeys.lists(),
        queryFn: () => getAll().then((res) => res.data),
    });
};

export const useTasksByNote = (noteId: number) => {
    return useQuery({
        queryKey: taskKeys.byNote(noteId),
        queryFn: () => getTasksByNote(noteId).then((res) => res.data),
        enabled: !!noteId,
    });
};

export const useTasksByUser = (userId: number) => {
    return useQuery({
        queryKey: taskKeys.byUser(userId),
        queryFn: () => getTasksByUser(userId).then((res) => res.data),
        enabled: !!userId,
    });
};

export const useTaskDetail = (taskId: number) => {
    return useQuery({
        queryKey: taskKeys.detail(taskId),
        queryFn: () => getById(taskId).then((res) => res.data),
        enabled: !!taskId,
    });
};

/**
 * HOOKS D'ÉCRITURE (MUTATIONS)
 */

export const useTaskMutations = () => {
    const queryClient = useQueryClient();

    const createTaskMutation = useMutation({
        mutationFn: (data: CreateTaskDto) => create(data).then((res) => res.data),
        onSuccess: (newTask) => {
            logger.debug(newTask);
            queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
        },
    });

    const updateTaskMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateTaskDto }) =>
            update(id, data).then((res) => res.data),
        onSuccess: (updatedTask) => {
            logger.debug(updatedTask);
            queryClient.invalidateQueries({ queryKey: taskKeys.all });
        },
    });

    const deleteTaskMutation = useMutation({
        mutationFn: (id: number) => deleteTask(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
        },
    });

    return {
        createTask: createTaskMutation,
        updateTask: updateTaskMutation,
        deleteTask: deleteTaskMutation,
    };
};
