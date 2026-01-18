import { useState } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { 
  Box, Typography, Paper, IconButton, Stack, Chip, 
  Button, alpha, Grid, Avatar
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DescriptionIcon from '@mui/icons-material/Description';
import EditIcon from '@mui/icons-material/Edit';

import { useTaskDetail } from '@/hooks/queries/useTaskQueries';
import { TaskStatus, type TaskStatusType } from '@/enums/task';
import { TaskModal } from '@/components/tasks/TaskForm';
import { AsyncWrapper } from '@/components/ui/AsyncWrapper';
import type { User } from '@/types/user';

export default function TaskDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const taskId = Number(id);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 1. DATA FETCHING avec TanStack Query
    const { data: task, isLoading, error, refetch } = useTaskDetail(taskId);

    const statusConfig: Record<TaskStatusType, { color: "default" | "primary" | "success" | "warning"; label: string }> = {
        [TaskStatus.PENDING]: { color: 'default', label: 'En attente' },
        [TaskStatus.IN_PROGRESS]: { color: 'primary', label: 'En cours' },
        [TaskStatus.COMPLETED]: { color: 'success', label: 'Terminée' },
        [TaskStatus.ARCHIVED]: { color: 'warning', label: 'Archivée' },
    };

    const currentStatus = task ? (statusConfig[task.status as TaskStatusType] || statusConfig[TaskStatus.PENDING]) : statusConfig[TaskStatus.PENDING];

    return (
        <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: 'background.default' }}>
            <AsyncWrapper 
                loading={isLoading} 
                error={error} 
                onRetry={() => refetch()}
            >
                {task && (
                    <>
                        {/* 1. Header Full Width */}
                        <Box sx={{ borderBottom: '1px solid', borderRadius: '1rem 1rem 0 0', borderColor: 'divider', bgcolor: 'background.paper', mb: 0, px: 4, py: 2 }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Stack direction="row" spacing={3} alignItems="center">
                                    <IconButton onClick={() => navigate(-1)} sx={{ border: '1px solid', borderColor: 'divider' }}>
                                        <ArrowBackIcon />
                                    </IconButton>
                                    <Box>
                                        <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary' }}>
                                            {task.title}
                                        </Typography>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 600 }}>TASK-{task.id}</Typography>
                                            <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'text.disabled' }} />
                                            <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 700 }}>
                                                Créé le {new Date(task.createdAt).toLocaleDateString()}
                                            </Typography>
                                        </Stack>
                                    </Box>
                                </Stack>

                                <Stack direction="row" spacing={2}>
                                    <Chip label={currentStatus.label} color={currentStatus.color} sx={{ fontWeight: 800, px: 1 }} />
                                    <Button 
                                        variant="contained" 
                                        startIcon={<EditIcon />} 
                                        onClick={() => setIsModalOpen(true)}
                                        sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700 }}
                                    >
                                        Modifier
                                    </Button>
                                </Stack>
                            </Stack>
                        </Box>

                        {/* 2. Content Grid */}
                        <Grid container spacing={0} sx={{ height: 'calc(100vh - 80px)' }}>
                            
                            {/* Colonne Gauche : Contenu Principal */}
                            <Grid size={{ xs: 12, md: 8 }} sx={{ p: 4, borderRight: '1px solid', borderColor: 'divider', overflowY: 'auto' }}>
                                <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 800, mb: 2, letterSpacing: 1 }}>
                                    DÉTAILS & DESCRIPTION
                                </Typography>
                                <Paper elevation={0} sx={{ p: 3, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: '16px' }}>
                                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.primary', whiteSpace: 'pre-wrap' }}>
                                        {task.description || "Aucune description détaillée n'a été ajoutée."}
                                    </Typography>
                                </Paper>

                                <Box sx={{ mt: 6 }}>
                                    <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 800, mb: 2 }}>ACTIVITÉ</Typography>
                                    <Typography variant="body2" color="text.disabled" sx={{ fontStyle: 'italic' }}>
                                        Bientôt : Suivez l'historique des modifications ici.
                                    </Typography>
                                </Box>
                            </Grid>

                            {/* Colonne Droite : Sidebar Informations */}
                            <Grid size={{ xs: 12, md: 4 }} sx={{ p: 4, bgcolor: alpha('#f8fafc', 0.5), overflowY: 'auto' }}>
                                <Stack spacing={4}>
                                    <Box>
                                        <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 800, mb: 1.5 }}>ÉCHÉANCE</Typography>
                                        <Paper sx={{ p: 2, borderRadius: '12px', border: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Box sx={{ p: 1, borderRadius: '8px', bgcolor: alpha('#2563eb', 0.1), color: 'primary.main' }}>
                                                <CalendarTodayIcon />
                                            </Box>
                                            <Typography fontWeight={700}>
                                                {task.dueDate ? new Date(task.dueDate).toLocaleDateString('fr-FR', { dateStyle: 'full' }) : 'Non définie'}
                                            </Typography>
                                        </Paper>
                                    </Box>

                                    <Box>
                                        <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 800, mb: 1.5 }}>COLLABORATEURS</Typography>
                                        <Stack spacing={1.5}>
                                            {task.assignees?.map((user: User) => (
                                                <Paper key={user.id} sx={{ p: 1, borderRadius: '12px', border: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Avatar src={user.avatarUrl} sx={{ width: 32, height: 32 }}>{user.firstName?.charAt(0)}</Avatar>
                                                    <Box>
                                                        <Typography variant="body2" fontWeight={700}>{user.firstName} {user.lastName}</Typography>
                                                        <Typography variant="caption" color="text.disabled">{user.email}</Typography>
                                                    </Box>
                                                </Paper>
                                            ))}
                                        </Stack>
                                    </Box>

                                    <Box>
                                        <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 800, mb: 1.5 }}>RELATIONS</Typography>
                                        {task.relatedNoteId ? (
                                            <Button 
                                                fullWidth
                                                component={RouterLink} 
                                                to={`/notes/${task.relatedNoteId}`}
                                                variant="outlined"
                                                startIcon={<DescriptionIcon />}
                                                sx={{ justifyContent: 'flex-start', borderRadius: '12px', p: 1.5, textTransform: 'none', fontWeight: 700 }}
                                            >
                                                Voir la note #{task.relatedNoteId}
                                            </Button>
                                        ) : (
                                            <Typography variant="caption" color="text.disabled">Aucune note liée</Typography>
                                        )}
                                    </Box>
                                </Stack>
                            </Grid>
                        </Grid>

                        <TaskModal
                            isOpen={isModalOpen} 
                            onClose={() => setIsModalOpen(false)} 
                            task={task} 
                        />
                    </>
                )}
            </AsyncWrapper>
        </Box>
    );
}