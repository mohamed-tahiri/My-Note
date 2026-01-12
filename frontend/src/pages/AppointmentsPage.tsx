import { useState, useEffect, useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Typography, Stack, Button, Fab, CircularProgress, Fade } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import type { Appointment, CreateAppointmentDto } from '@/types/appointment';
import { logger } from '@/utils/logger';
import { AppointmentFormModal } from '@/components/appointments/AppointmentFormModal';
import { AppointmentsList } from '@/components/appointments/AppointmentsList';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
// Import complet des services
import { getAll, create, update, deleteAppointment } from '@/api/appointmentsService';

export default function AppointmentsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApt, setEditingApt] = useState<Appointment | undefined>();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Charger les rendez-vous depuis l'API
  const loadAppointments = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await getAll();
      setAppointments(res.data);
    } catch (error) {
      logger.error('Erreur lors du chargement des rendez-vous:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  const handleCreateOrUpdate = async (data: CreateAppointmentDto) => {
    try {
      if (editingApt) {
        await update(editingApt.id, data);
      } else {
        await create(data);
      }
      setIsModalOpen(false);
      setEditingApt(undefined);
      loadAppointments();
    } catch (error) {
      logger.error('Erreur lors de la sauvegarde:', error);
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
        await deleteAppointment(selectedId);
        setConfirmOpen(false);
        setSelectedId(null);
        loadAppointments();
      } catch (error) {
        logger.error('Erreur lors de la suppression:', error);
      }
    }
  };

  return (
    <Box sx={{ pb: 8 }}>
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
        description="Cette action est irréversible. Voulez-vous vraiment supprimer ce rendez-vous ?"
        onConfirm={handleConfirmDelete}
        onClose={() => setConfirmOpen(false)}
      />

      <Fab 
        color="primary" 
        onClick={() => setIsModalOpen(true)}
        sx={{ 
          position: 'fixed', 
          bottom: { xs: 80, md: 40 }, 
          right: { xs: 20, md: 40 },
          boxShadow: '0px 4px 20px rgba(37, 99, 235, 0.4)'
        }}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
}