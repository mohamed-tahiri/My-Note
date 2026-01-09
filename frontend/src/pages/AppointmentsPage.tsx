import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Typography, Stack, Button, Fab, CircularProgress, Fade } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import type { Appointment, CreateAppointmentDto } from '@/types/appointment';
import { logger } from '@/utils/logger';
import { AppointmentFormModal } from '@/components/appointments/AppointmentFormModal';
import { AppointmentsList } from '@/components/appointments/AppointmentsList';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';


const mockAppointments: Appointment[] = [
  {
    id: 1, title: 'Réunion d\'équipe Sync', startAt: '2026-01-10', location: 'Salle de conférence B', type: 'Professional',
    endAt: '',
    userId: 0,
    createdAt: '',
    updatedAt: ''
  },
  {
    id: 2, title: 'Check-up Dentiste', startAt: '2026-01-10', location: 'Cabinet Dr. Martin', type: 'Medical',
    endAt: '',
    userId: 0,
    createdAt: '',
    updatedAt: ''
  },
  {
    id: 3, title: 'Dîner avec Sophie', startAt: '2026-01-12', location: 'Restaurant Le Bistro', type: 'Personal',
    endAt: '',
    userId: 0,
    createdAt: '',
    updatedAt: ''
  },
];

export default function AppointmentsPage() {
  const [isLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApt, setEditingApt] = useState<Appointment | undefined>();
  const [appointments] = useState<Appointment[]>(mockAppointments);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleCreateOrUpdate = (data: CreateAppointmentDto) => {
    if (editingApt) {
      logger.info('Update:', data);
      // Appel API update...
    } else {
      logger.info('Create:', data);
      // Appel API create...
    }
  };


  const handleEdit = (appointment: Appointment) => {
    setEditingApt(appointment);
    setIsModalOpen(true);
  };


  const openDeleteConfirm = (id: number) => {
    setSelectedId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedId) {
      try {
        // await deleteNote(selectedId); // Ou deleteTask selon la page
        // await loadNotes();
        setConfirmOpen(false);
      } catch (error) {
        logger.error('Delete failed', error);
      }
    }
  };

  return (
    <Box sx={{ pb: 8 }}>
      {/* Header avec bouton d'ajout moderne */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main' }}>
            Rendez-vous
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            Planifiez et gérez votre emploi du temps.
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          component={RouterLink}
          to="/appointments/calendar"
          startIcon={<CalendarMonthIcon />}
          sx={{ display: { xs: 'none', md: 'flex' }, borderRadius: '10px', textTransform: 'none', fontWeight: 700 }}
        >
          Vue Calendrier
        </Button>
      </Stack>

      {/* Liste Chronologique */}
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <Fade in={!isLoading}>
          <Box>
            <AppointmentsList
              appointments={appointments}
              onEdit={handleEdit}
              onDelete={openDeleteConfirm}
            />
          </Box>
        </Fade>
      )}

      <AppointmentFormModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingApt(undefined); }}
        onSubmit={handleCreateOrUpdate}
        editingAppointment={editingApt}
      />

      <ConfirmDialog
        isOpen={confirmOpen}
        title="Confirmer la suppression"
        description="Cette action est irréversible. Voulez-vous vraiment supprimer cet élément ?"
        onConfirm={handleConfirmDelete}
        onClose={() => setConfirmOpen(false)}
      />

      {/* Bouton d'ajout flottant pour Mobile */}
      <Fab 
        color="primary" 
        onClick={() => setIsModalOpen(true)}
        sx={{ position: 'fixed', bottom: { xs: 80, md: 40 }, right: { xs: 20, md: 40 } }}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
}