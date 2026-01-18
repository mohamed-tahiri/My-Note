import { Box, Typography, Grid, Stack, Chip } from '@mui/material';
import { NoteItem } from './NoteItem';
import type { NotesListProps } from '@/types/props';

export function NotesList({ notes, onEdit, onDelete }: NotesListProps) {
    if (notes.length === 0) {
        return (
            <Box
                sx={{
                    textAlign: 'center',
                    py: 10,
                    bgcolor: 'background.paper',
                    borderRadius: 4,
                    border: '1px dashed',
                    borderColor: 'divider',
                }}
            >
                <Typography variant="h6" color="text.secondary">
                    Vous n'avez pas encore de notes.
                </Typography>
                <Typography variant="body2" color="text.disabled">
                    Cliquez sur le bouton + pour commencer.
                </Typography>
            </Box>
        );
    }

    const priorities = [
        { key: 'low', label: 'Priorité Basse', color: '#10b981' },
        { key: 'medium', label: 'Priorité Moyenne', color: '#f59e0b' },
        { key: 'high', label: 'Priorité Haute', color: '#ef4444' },
    ];

    return (
        <Grid container spacing={3} alignItems="flex-start">
            {priorities.map((p) => {
                const filteredNotes = notes.filter((n) => n.priority === p.key);

                return (
                    <Grid size={{ xs: 12, md: 4 }} key={p.key}>
                        {/* Header de la colonne */}
                        <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            sx={{ mb: 2, px: 1 }}
                        >
                            <Box
                                sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: p.color }}
                            />
                            <Typography
                                variant="subtitle1"
                                sx={{
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    letterSpacing: 1,
                                    fontSize: '0.75rem',
                                }}
                            >
                                {p.label}
                            </Typography>
                            <Chip
                                label={filteredNotes.length}
                                size="small"
                                sx={{
                                    height: 20,
                                    fontSize: '0.7rem',
                                    fontWeight: 600,
                                    bgcolor: 'action.hover',
                                }}
                            />
                        </Stack>

                        {/* Conteneur des notes de la colonne */}
                        <Stack spacing={2} sx={{ minHeight: 200 }}>
                            {filteredNotes.length > 0 ? (
                                filteredNotes.map((note) => (
                                    <NoteItem
                                        key={note.id}
                                        note={note}
                                        onEdit={() => onEdit(note)}
                                        onDelete={() => onDelete(note.id)}
                                    />
                                ))
                            ) : (
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: 'text.disabled',
                                        fontStyle: 'italic',
                                        textAlign: 'center',
                                        py: 2,
                                    }}
                                >
                                    Aucune note
                                </Typography>
                            )}
                        </Stack>
                    </Grid>
                );
            })}
        </Grid>
    );
}
