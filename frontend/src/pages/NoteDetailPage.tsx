import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    IconButton,
    Paper,
    Divider,
    Stack,
    Breadcrumbs,
    Link,
    Chip,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

import { useNoteDetail } from '@/hooks/queries/useNoteQueries';
import { useTasksByNote } from '@/hooks/queries/useTaskQueries';
import { NoteTasksList } from '@/components/notes/NoteTasksList';
import { AsyncWrapper } from '@/components/ui/AsyncWrapper';

export default function NoteDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const noteId = Number(id);

    const {
        data: note,
        isLoading: isNoteLoading,
        error: noteError,
        refetch: refetchNote,
    } = useNoteDetail(noteId);

    const {
        data: tasks,
        isLoading: isTasksLoading,
        refetch: refetchTasks,
    } = useTasksByNote(noteId);

    return (
        <Box>
            <Breadcrumbs sx={{ mb: 3 }}>
                <Link
                    component="button"
                    onClick={() => navigate('/notes')}
                    underline="hover"
                    color="inherit"
                    sx={{ display: 'flex', alignItems: 'center', fontSize: '0.875rem' }}
                >
                    Notes
                </Link>
                <Typography color="text.primary" sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                    Détails
                </Typography>
            </Breadcrumbs>

            {/* Utilisation du AsyncWrapper pour la structure principale (la note) */}
            <AsyncWrapper loading={isNoteLoading} error={noteError} onRetry={() => refetchNote()}>
                {note && (
                    <>
                        {/* Header Action Bar */}
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="flex-start"
                            sx={{ mb: 4 }}
                        >
                            <Box>
                                <Typography variant="h4" gutterBottom sx={{ fontWeight: 800 }}>
                                    {note.title}
                                </Typography>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Chip
                                        icon={
                                            <CalendarTodayIcon
                                                sx={{ fontSize: '1rem !important' }}
                                            />
                                        }
                                        label={`Créée le ${new Date(note.createdAt).toLocaleDateString()}`}
                                        size="small"
                                        variant="outlined"
                                        sx={{ borderRadius: '6px' }}
                                    />
                                </Stack>
                            </Box>
                            <IconButton
                                onClick={() => navigate('/notes')}
                                sx={{
                                    bgcolor: 'background.paper',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                }}
                            >
                                <ArrowBackIcon />
                            </IconButton>
                        </Stack>

                        <Stack spacing={4}>
                            {/* Note Content Section */}
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 4,
                                    borderRadius: '16px',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    bgcolor: 'background.paper',
                                }}
                            >
                                <Typography
                                    variant="body1"
                                    sx={{
                                        whiteSpace: 'pre-line',
                                        color: 'text.primary',
                                        lineHeight: 1.8,
                                        fontSize: '1.05rem',
                                    }}
                                >
                                    {note.content}
                                </Typography>

                                <Divider sx={{ my: 3 }} />

                                <Typography
                                    variant="caption"
                                    color="text.disabled"
                                    sx={{ display: 'block' }}
                                >
                                    Dernière mise à jour :{' '}
                                    {new Date(note.updatedAt).toLocaleString()}
                                </Typography>
                            </Paper>

                            {/* Tasks Section - On passe les états directement à NoteTasksList 
                  ou on pourrait remettre un petit AsyncWrapper interne ici */}
                            <NoteTasksList
                                note={note}
                                tasks={tasks || []}
                                tasksLoading={isTasksLoading}
                                reloadTasks={() => refetchTasks()}
                            />
                        </Stack>
                    </>
                )}
            </AsyncWrapper>
        </Box>
    );
}
