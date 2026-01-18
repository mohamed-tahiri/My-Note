import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Typography, Stack, Button } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

import { useAppointments, useAppointmentMutations } from '@/hooks/queries/useAppointmentQueries';
import { AppointmentFormModal } from '@/components/appointments/AppointmentFormModal';
import { AppointmentsList } from '@/components/appointments/AppointmentsList';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { AsyncWrapper } from '@/components/ui/AsyncWrapper';
import type { Appointment, CreateAppointmentDto } from '@/types/appointment';
import FadButton from '@/components/ui/FadButton';

export default function AppointmentsPage() {
  const { data: appointments, isLoading, error, refetch } = useAppointments();

  const { createAppointment, updateAppointment, deleteAppointment } = useAppointmentMutations();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApt, setEditingApt] = useState<Appointment | undefined>();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleCreateOrUpdate = (data: CreateAppointmentDto) => {
    if (editingApt) {
      updateAppointment.mutate({ id: editingApt.id, data }, {
        onSuccess: () => {
          setIsModalOpen(false);
          setEditingApt(undefined);
        }
      });
    } else {
      createAppointment.mutate(data, {
        onSuccess: () => setIsModalOpen(false)
      });
    }
  };

  const handleConfirmDelete = () => {
    if (selectedId) {
      deleteAppointment.mutate(selectedId, {
        onSuccess: () => setConfirmOpen(false)
      });
    }
  };

  const onHandleFad = () => {
    setEditingApt(undefined); 
    setIsModalOpen(true); 
  }

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

      <AsyncWrapper
        loading={isLoading}
        error={error}
        isEmpty={!appointments || appointments.length === 0}
        emptyMessage="Aucun rendez-vous prévu. Cliquez sur le bouton + pour commencer."
        onRetry={() => refetch()}
      >
        <AppointmentsList
          appointments={appointments || []}
          onEdit={(apt) => { setEditingApt(apt); setIsModalOpen(true); }}
          onDelete={(id) => { setSelectedId(id); setConfirmOpen(true); }}
        />
      </AsyncWrapper>

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

      <FadButton onHandleFad={onHandleFad}  />
    </Box>
  );
}