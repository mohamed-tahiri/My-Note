import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
    getAll, 
    getById, 
    create, 
    update, 
    deleteAppointment 
} from '@/api/appointmentsService';
import type { CreateAppointmentDto, UpdateAppointmentDto } from '@/types/appointment';

export const appointmentKeys = {
    all: ['appointments'] as const,
    lists: () => [...appointmentKeys.all, 'list'] as const,
    detail: (id: number) => [...appointmentKeys.all, 'detail', id] as const,
};

/**
 * HOOKS DE LECTURE (QUERIES)
 */

export const useAppointments = () => {
    return useQuery({
        queryKey: appointmentKeys.lists(),
        queryFn: () => getAll().then(res => res.data),
        staleTime: 1000 * 60 * 5, // Cache de 5 minutes
    });
};

export const useAppointmentDetail = (id: number | undefined) => {
    return useQuery({
        queryKey: appointmentKeys.detail(id!),
        queryFn: () => getById(id!).then(res => res.data),
        enabled: !!id,
    });
};

/**
 * HOOKS D'ÉCRITURE (MUTATIONS)
 */

export const useAppointmentMutations = () => {
    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: (data: CreateAppointmentDto) => create(data).then(res => res.data),
        onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() });
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateAppointmentDto }) => 
        update(id, data).then(res => res.data),
        onSuccess: (updated) => {
            queryClient.setQueryData(appointmentKeys.detail(updated.id), updated);
            queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() });
        },
    });

    const deleteMutation = useMutation({
            mutationFn: (id: number) => deleteAppointment(id),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() });
            },
    });

    return {
        createAppointment: createMutation,
        updateAppointment: updateMutation,
        deleteAppointment: deleteMutation,
    };
};