import { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Autocomplete,
    Avatar,
    Box,
    Stack,
    Typography,
    CircularProgress,
} from '@mui/material';

import { useUsers } from '@/hooks/queries/useUserQueries';
import { useChatMutations } from '@/hooks/queries/useChatQueries';
import type { User } from '@/types/user';
import type { CreateChatDto } from '@/types/chat';
import type { CreateChatModalProps } from '@/types/props';

export function CreateChatModal({ open, onClose }: CreateChatModalProps) {
    // 1. DATA FETCHING (Utilise le cache global des utilisateurs)
    const { data: users = [], isLoading: fetchingUsers } = useUsers();

    // 2. MUTATIONS (Gère l'invalidation du cache 'chats' automatiquement)
    const { createChat } = useChatMutations();

    // UI STATES
    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
    const [chatName, setChatName] = useState('');

    // Reset des champs lors de la fermeture
    const handleInternalClose = () => {
        setSelectedUsers([]);
        setChatName('');
        onClose();
    };

    // Fonction de création
    const handleCreate = () => {
        if (selectedUsers.length === 0) return;

        const isGroup = selectedUsers.length > 1;

        const payload: CreateChatDto = {
            name: isGroup ? chatName || 'Nouveau groupe' : '',
            type: isGroup ? 'task_group' : 'private',
            participantIds: selectedUsers.map((u) => u.id),
        };

        // On utilise mutate pour déclencher la création
        createChat.mutate(payload, {
            onSuccess: () => {
                handleInternalClose();
            },
        });
    };

    return (
        <Dialog
            open={open}
            onClose={handleInternalClose}
            fullWidth
            maxWidth="xs"
            PaperProps={{ sx: { borderRadius: '16px' } }}
        >
            <DialogTitle sx={{ fontWeight: 800, pt: 3 }}>Nouvelle discussion</DialogTitle>

            <DialogContent>
                <Stack spacing={3} sx={{ mt: 1 }}>
                    <Autocomplete
                        multiple
                        options={users}
                        loading={fetchingUsers}
                        getOptionLabel={(option) =>
                            `${option.firstName ?? ''} ${option.lastName ?? ''}`.trim() ||
                            option.email
                        }
                        value={selectedUsers}
                        onChange={(_, value) => setSelectedUsers(value)}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Participants"
                                placeholder="Rechercher..."
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                        <>
                                            {fetchingUsers ? (
                                                <CircularProgress color="inherit" size={20} />
                                            ) : null}
                                            {params.InputProps.endAdornment}
                                        </>
                                    ),
                                }}
                            />
                        )}
                        renderOption={(props, option) => (
                            <Box
                                component="li"
                                {...props}
                                key={option.id}
                                sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
                            >
                                <Avatar
                                    sx={{
                                        width: 28,
                                        height: 28,
                                        fontSize: '0.75rem',
                                        bgcolor: 'primary.light',
                                    }}
                                >
                                    {option.firstName?.charAt(0) || option.email?.charAt(0)}
                                </Avatar>
                                <Box>
                                    <Typography variant="body2" fontWeight={600}>
                                        {option.firstName} {option.lastName}
                                    </Typography>
                                    <Typography variant="caption" color="text.disabled">
                                        {option.email}
                                    </Typography>
                                </Box>
                            </Box>
                        )}
                    />

                    {selectedUsers.length > 1 && (
                        <TextField
                            label="Nom du groupe"
                            fullWidth
                            placeholder="Ex: Projet Slate"
                            value={chatName}
                            onChange={(e) => setChatName(e.target.value)}
                            autoFocus
                        />
                    )}
                </Stack>
            </DialogContent>

            <DialogActions sx={{ p: 3, pt: 1 }}>
                <Button onClick={handleInternalClose} color="inherit" sx={{ fontWeight: 700 }}>
                    Annuler
                </Button>
                <Button
                    onClick={handleCreate}
                    variant="contained"
                    disabled={selectedUsers.length === 0 || createChat.isPending}
                    sx={{
                        borderRadius: '8px',
                        fontWeight: 700,
                        px: 4,
                        boxShadow: 'none',
                    }}
                >
                    {createChat.isPending ? (
                        <CircularProgress size={24} color="inherit" />
                    ) : (
                        'Démarrer'
                    )}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
