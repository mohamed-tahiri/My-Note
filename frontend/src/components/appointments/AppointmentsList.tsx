import { Stack } from '@mui/material';
import { AppointmentItem } from './AppointmentItem';
import type { Appointment } from '@/types/appointment';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import { EmptyState } from '../ui/EmptyState';

interface Props {
  appointments: Appointment[];
  onEdit: (appointment: Appointment) => void;
  onDelete: (id: number) => void;
}

export function AppointmentsList({ appointments, onEdit, onDelete }: Props) {
    return (
        <Stack spacing={3}>
            {appointments.length === 0 ? (
                <EmptyState 
                    icon={EventBusyIcon}
                    title="Aucun rendez-vous prévu"
                    description="Votre emploi du temps est libre pour le moment."
                />
            ) : (
                appointments.map((apt) => (
                    <AppointmentItem 
                        key={apt.id} 
                        appointment={apt} 
                        onEdit={onEdit} 
                        onDelete={onDelete} 
                    />
                ))
            )}
        </Stack>
    );
}