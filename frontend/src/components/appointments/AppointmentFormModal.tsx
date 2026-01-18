import React, { useEffect, useEffectEvent, useState } from 'react';
import { TextField, Stack, MenuItem } from '@mui/material';
import { useAuth } from '@/hooks/useAuth';
import type { Appointment, AppointmentType } from '@/types/appointment';
import type { AppointmentFormModalProps } from '@/types/props';
import { BaseModal } from '../ui/BaseModal';

const DEFAULT_STATE = {
    title: '',
    startAt: '',
    endAt: '',
    location: '',
    type: 'Personal' as AppointmentType,
};

export function AppointmentFormModal({
    isOpen,
    onSubmit,
    editingAppointment,
    onClose,
}: AppointmentFormModalProps) {
    const { user } = useAuth();
    const [formData, setFormData] = useState(DEFAULT_STATE);

    const resetFormEvent = useEffectEvent((apt?: Appointment) => {
        if (apt) {
            setFormData({
                title: apt.title || '',
                startAt: apt.startAt
                    ? new Date(apt.startAt).toLocaleString('sv').slice(0, 16).replace(' ', 'T')
                    : '',
                endAt: apt.endAt
                    ? new Date(apt.endAt).toLocaleString('sv').slice(0, 16).replace(' ', 'T')
                    : '',
                location: apt.location || '',
                type: (apt.type as AppointmentType) || 'Personal',
            });
        } else {
            const now = new Date();
            const inOneHour = new Date(now.getTime() + 3600000);
            setFormData({
                ...DEFAULT_STATE,
                startAt: now.toLocaleString('sv').slice(0, 16).replace(' ', 'T'),
                endAt: inOneHour.toLocaleString('sv').slice(0, 16).replace(' ', 'T'),
            });
        }
    });

    useEffect(() => {
        if (isOpen) {
            resetFormEvent(editingAppointment);
        }
    }, [isOpen, editingAppointment]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.startAt) return;

        onSubmit({
            ...formData,
            userId: user?.id || 0,
            startAt: new Date(formData.startAt).toISOString(),
            endAt: new Date(formData.endAt).toISOString(),
        });
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={handleSubmit}
            title={editingAppointment ? 'Modifier la note' : 'Nouvelle note'}
        >
            <Stack spacing={3}>
                <TextField
                    label="Titre"
                    fullWidth
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                />

                <Stack direction="row" spacing={2}>
                    <TextField
                        label="Début"
                        type="datetime-local"
                        fullWidth
                        value={formData.startAt}
                        onChange={(e) => setFormData({ ...formData, startAt: e.target.value })}
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        label="Fin"
                        type="datetime-local"
                        fullWidth
                        value={formData.endAt}
                        onChange={(e) => setFormData({ ...formData, endAt: e.target.value })}
                        InputLabelProps={{ shrink: true }}
                    />
                </Stack>

                <TextField
                    select
                    label="Catégorie"
                    fullWidth
                    value={formData.type}
                    onChange={(e) =>
                        setFormData({ ...formData, type: e.target.value as AppointmentType })
                    }
                >
                    <MenuItem value="Professional">Professionnel</MenuItem>
                    <MenuItem value="Personal">Personnel</MenuItem>
                    <MenuItem value="Medical">Médical</MenuItem>
                </TextField>

                <TextField
                    label="Lieu"
                    fullWidth
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
            </Stack>
        </BaseModal>
    );
}
