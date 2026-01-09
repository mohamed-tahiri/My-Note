import React, { useEffect, useEffectEvent, useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, IconButton, Typography, Box, Stack, MenuItem,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from '@/hooks/useAuth';
import type { Appointment, CreateAppointmentDto, AppointmentType, UpdateAppointmentDto } from '@/types/appointment';

interface Props {
  isOpen: boolean;
  onSubmit: (data: CreateAppointmentDto) => void;
  onClose: () => void;
  editingAppointment?: Appointment;
}

export function AppointmentFormModal({ isOpen, onSubmit, editingAppointment, onClose }: Props) {
    const { user } = useAuth();

    const [formData, setFormData] = useState({
        title: '',
        startAt: '',
        endAt: '',
        location: '',
        type: 'Personal' as AppointmentType,
    });

    const updateDate = useEffectEvent((appointment: UpdateAppointmentDto) => {
        setFormData({
            title: appointment.title ?? '',
            startAt: appointment.startAt ? new Date(appointment.startAt).toISOString().slice(0, 16) : '',
            endAt: appointment.endAt ? new Date(appointment.endAt).toISOString().slice(0, 16) : '',
            location: appointment.location || '' ,
            type: appointment.type ?? 'Personal',
        });
    });

    useEffect(() => {
        if (isOpen) {
        if (editingAppointment) {
            updateDate(editingAppointment);
        } else {
            const now = new Date().toISOString().slice(0, 16);
            updateDate({ title: '', startAt: now, endAt: now, location: '', type: 'Personal' });
        }
        }
    }, [editingAppointment, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.startAt) return;

        onSubmit({
        ...formData,
        userId: user?.id || 0,
        // Conversion des dates locales en ISO pour le backend
        startAt: new Date(formData.startAt).toISOString(),
        endAt: new Date(formData.endAt).toISOString(),
        });
        onClose();
    };

    return (
        <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: '16px' } }}>
            <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" fontWeight={800} color="primary.main">
                {editingAppointment ? 'Modifier le rendez-vous' : 'Nouveau rendez-vous'}
                </Typography>
                <IconButton onClick={onClose} sx={{ color: 'text.secondary' }}><CloseIcon /></IconButton>
            </DialogTitle>

            <Box component="form" onSubmit={handleSubmit}>
                <DialogContent dividers sx={{ py: 3, borderBottom: 'none' }}>
                <Stack spacing={3}>
                    <TextField
                    name="title"
                    label="Titre du rendez-vous"
                    fullWidth
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                    />

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <TextField
                        label="Début"
                        type="datetime-local"
                        fullWidth
                        value={formData.startAt}
                        onChange={(e) => setFormData({ ...formData, startAt: e.target.value })}
                        InputLabelProps={{ shrink: true }}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                    />
                    <TextField
                        label="Fin"
                        type="datetime-local"
                        fullWidth
                        value={formData.endAt}
                        onChange={(e) => setFormData({ ...formData, endAt: e.target.value })}
                        InputLabelProps={{ shrink: true }}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                    />
                    </Stack>

                    <TextField
                    select
                    label="Type"
                    fullWidth
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as AppointmentType })}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
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
                    placeholder="Ex: Bureau, Zoom, Paris..."
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                    />
                </Stack>
                </DialogContent>

                <DialogActions sx={{ p: 3, pt: 1 }}>
                <Button onClick={onClose} color="inherit" sx={{ fontWeight: 600 }}>Annuler</Button>
                <Button type="submit" variant="contained" sx={{ fontWeight: 700, borderRadius: '10px', px: 4 }}>
                    {editingAppointment ? 'Mettre à jour' : 'Enregistrer'}
                </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
}