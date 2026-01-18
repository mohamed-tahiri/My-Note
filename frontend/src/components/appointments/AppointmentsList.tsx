import { Stack } from '@mui/material';
import { AppointmentItem } from './AppointmentItem';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import { EmptyState } from '../ui/EmptyState';
import type { AppointmentsListProps } from '@/types/props';

export function AppointmentsList({ appointments, onEdit, onDelete }: AppointmentsListProps) {
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