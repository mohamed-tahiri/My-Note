import { useState, useEffect } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, TextField, Autocomplete, Avatar, Box, 
  Stack, Typography, CircularProgress
} from '@mui/material';
import { getAll as getAllUsers } from '@/api/userService';
import { create as createChat } from '@/api/chatService';
import type { User } from '@/types/user';
import type { Chat, CreateChatDto } from '@/types/chat';
import { logger } from '@/utils/logger';

interface CreateChatModalProps {
  open: boolean;
  onClose: () => void;
  onChatCreated: (chat: Chat) => void;
}

export function CreateChatModal({ open, onClose, onChatCreated }: CreateChatModalProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [chatName, setChatName] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingUsers, setFetchingUsers] = useState(false);

  // Charger les utilisateurs à l'ouverture du modal
  useEffect(() => {
    const loadUsers = async () => {
      setFetchingUsers(true);
      try {
        const res = await getAllUsers();
        setUsers(res.data);
      } catch (err) {
        logger.error("Erreur chargement utilisateurs:", err);
      } finally {
        setFetchingUsers(false);
      }
    };
    if (open) loadUsers();
  }, [open]);

  // Fonction de création
  const handleCreate = async () => {
    if (selectedUsers.length === 0) return;
    setLoading(true);
    
    try {
      const isGroup = selectedUsers.length > 1;

      const payload: CreateChatDto = {
        name: isGroup ? (chatName || 'Nouveau groupe') : '',
        type: isGroup ? 'task_group' : 'private',
        participantIds: selectedUsers.map(u => u.id),
      };

      const res = await createChat(payload);
      onChatCreated(res.data);
      handleInternalClose();
    } catch (err) {
      logger.error("Erreur lors de la création du chat:", err);
    } finally {
      setLoading(false);
    }
  };

  // Reset des champs lors de la fermeture
  const handleInternalClose = () => {
    setSelectedUsers([]);
    setChatName('');
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleInternalClose} 
      fullWidth 
      maxWidth="xs" 
      PaperProps={{ sx: { borderRadius: '16px' } }}
    >
      <DialogTitle sx={{ fontWeight: 800, pt: 3 }}>
        Nouvelle discussion
      </DialogTitle>
      
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <Autocomplete
            multiple
            options={users}
            loading={fetchingUsers}
            // Sécurité contre les prénoms/noms indéfinis
            getOptionLabel={(option) => 
              `${option.firstName ?? ''} ${option.lastName ?? ''}`.trim() || option.email
            }
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
                      {fetchingUsers ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
            renderOption={(props, option) => (
              <Box component="li" {...props} key={option.id} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ width: 28, height: 28, fontSize: '0.75rem', bgcolor: 'primary.light' }}>
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
          disabled={selectedUsers.length === 0 || loading}
          sx={{ 
            borderRadius: '8px', 
            fontWeight: 700, 
            px: 4,
            boxShadow: 'none',
            '&:hover': { boxShadow: 'none' }
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Démarrer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}