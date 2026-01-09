import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  IconButton, 
  Paper, 
  Divider, 
  Stack, 
  CircularProgress, 
  Button,
  Breadcrumbs,
  Link,
  Chip
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

import type { Note } from '@/types/note';
import type { Task } from '@/types/task';
import { getById } from '@/api/notesService';
import { getTasksByNote } from '@/api/tasksService';
import { NoteTasksList } from '@/components/notes/NoteTasksList';
import { logger } from '@/utils/logger';

export default function NoteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadNote = async (noteId: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getById(noteId);
      setNote(res.data);
    } catch (err) {
      logger.error(err);
      setError('Impossible de charger la note.');
    } finally {
      setLoading(false);
    }
  };

  const loadTasks = async (noteId: number) => {
    setTasksLoading(true);
    try {
      const res = await getTasksByNote(noteId);
      setTasks(res.data);
    } catch (err) {
      logger.error(err);
    } finally {
      setTasksLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    const noteId = Number(id);
    loadNote(noteId);
    loadTasks(noteId);
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !note) {
    return (
      <Box sx={{ textAlign: 'center', py: 10 }}>
        <Typography color="error">{error || 'Note introuvable'}</Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/notes')} sx={{ mt: 2 }}>
          Retour aux notes
        </Button>
      </Box>
    );
  }

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

      {/* Header Action Bar */}
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 4 }}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 800 }}>
            {note.title}
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <Chip 
              icon={<CalendarTodayIcon sx={{ fontSize: '1rem !important' }} />} 
              label={`Créée le ${new Date(note.createdAt).toLocaleDateString()}`}
              size="small"
              variant="outlined"
              sx={{ borderRadius: '6px' }}
            />
          </Stack>
        </Box>
        <IconButton 
          onClick={() => navigate('/notes')}
          sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}
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
            bgcolor: 'background.paper'
          }}
        >
          <Typography 
            variant="body1" 
            sx={{ 
              whiteSpace: 'pre-line', 
              color: 'text.primary', 
              lineHeight: 1.8,
              fontSize: '1.05rem' 
            }}
          >
            {note.content}
          </Typography>
          
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="caption" color="text.disabled" sx={{ display: 'block' }}>
            Dernière mise à jour : {new Date(note.updatedAt).toLocaleString()}
          </Typography>
        </Paper>

        {/* Tasks Section */}
        <NoteTasksList
          note={note}
          tasks={tasks}
          tasksLoading={tasksLoading}
          reloadTasks={() => loadTasks(note.id)}
        />
      </Stack>
    </Box>
  );
}