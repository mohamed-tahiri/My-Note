import { useState } from 'react';
import { Box, Typography, Stack } from '@mui/material';
import { useTasksByUser, useTaskMutations } from '@/hooks/queries/useTaskQueries';
import { useAuth } from '@/hooks/useAuth';
import { TaskList } from '@/components/tasks/TaskList';
import { TaskModal } from '@/components/tasks/TaskForm';
import { AsyncWrapper } from '@/components/ui/AsyncWrapper';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { TaskStatus, type TaskStatusType } from '@/enums/task';
import type { Task } from '@/types/task';
import FadButton from '@/components/ui/FadButton';

export default function TasksPage() {
    const { user } = useAuth();

    // 1. DATA FETCHING (TanStack Query)
    const { data: tasks, isLoading, error, refetch } = useTasksByUser(Number(user?.id));

    // 2. MUTATIONS (Centralisées)
    const { updateTask, deleteTask } = useTaskMutations();

    // 3. UI STATES
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const handleToggleStatus = (task: Task, newStatus?: string) => {
        const targetStatus =
            newStatus ||
            (task.status === TaskStatus.COMPLETED ? TaskStatus.PENDING : TaskStatus.COMPLETED);

        updateTask.mutate({
            id: task.id,
            data: { status: targetStatus as TaskStatusType },
        });
    };

    const handleConfirmDelete = () => {
        if (selectedId) {
            deleteTask.mutate(selectedId, {
                onSuccess: () => setConfirmOpen(false),
            });
        }
    };

    const onHandleFad = () => {
        setEditingTask(null);
        setIsTaskModalOpen(true);
    };

    return (
        <Box sx={{ pb: 8 }}>
            {/* Header */}
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 4 }}
            >
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main' }}>
                        Tâches
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary">
                        Suivez l'avancement de vos objectifs.
                    </Typography>
                </Box>
            </Stack>

            {/* Utilisation du AsyncWrapper amélioré */}
            <AsyncWrapper
                loading={isLoading}
                error={error}
                isEmpty={!tasks || tasks.length === 0}
                emptyMessage="Toutes les tâches sont terminées ! Ou vous n'en avez pas encore créé."
                onRetry={() => refetch()}
            >
                <TaskList
                    tasks={tasks || []}
                    onEdit={(task) => {
                        setEditingTask(task);
                        setIsTaskModalOpen(true);
                    }}
                    onDelete={(id) => {
                        setSelectedId(id);
                        setConfirmOpen(true);
                    }}
                    onToggleStatus={handleToggleStatus}
                />
            </AsyncWrapper>

            {/* Modals & Dialogs */}
            <TaskModal
                key={editingTask?.id || 'new-global-task'}
                noteId={0}
                task={editingTask}
                isOpen={isTaskModalOpen}
                onClose={() => setIsTaskModalOpen(false)}
            />

            <ConfirmDialog
                isOpen={confirmOpen}
                title="Supprimer la tâche ?"
                description=""
                onConfirm={handleConfirmDelete}
                onClose={() => setConfirmOpen(false)}
            />

            <FadButton onHandleFad={onHandleFad} />
        </Box>
    );
}
