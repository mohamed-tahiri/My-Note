import { Link as RouterLink } from 'react-router-dom';
import {
    Card,
    CardContent,
    Typography,
    CardActions,
    IconButton,
    Box,
    Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import type { NoteItemProps } from '@/types/props';

export function NoteItem({ note, onEdit, onDelete }: NoteItemProps) {
    return (
        <Card
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0px 12px 24px rgba(15, 23, 42, 0.08)',
                    borderColor: 'primary.light',
                },
                position: 'relative',
                borderLeft: '4px solid',
                borderColor: 'primary.main',
            }}
        >
            <CardContent
                component={RouterLink}
                to={`/notes/${note.id}`}
                sx={{
                    flexGrow: 1,
                    textDecoration: 'none',
                    color: 'inherit',
                    pb: 1,
                }}
            >
                <Typography
                    variant="h6"
                    component="h3"
                    sx={{
                        fontWeight: 700,
                        mb: 1,
                        color: 'primary.main',
                        display: '-webkit-box',
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                    }}
                >
                    {note.title}
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        lineHeight: 1.6,
                    }}
                >
                    {note.content}
                </Typography>
            </CardContent>

            <Box
                sx={{
                    px: 2,
                    pb: 1,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <Typography variant="caption" color="text.disabled">
                    {/* Formatage de date optionnel */}
                    {new Date().toLocaleDateString()}
                </Typography>

                <CardActions disableSpacing>
                    <Tooltip title="Modifier">
                        <IconButton
                            size="small"
                            onClick={(e) => {
                                e.preventDefault();
                                onEdit();
                            }}
                            sx={{
                                color: 'primary.light',
                                '&:hover': { color: 'primary.main', bgcolor: 'background.default' },
                            }}
                        >
                            <EditIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Supprimer">
                        <IconButton
                            size="small"
                            onClick={(e) => {
                                e.preventDefault();
                                onDelete();
                            }}
                            sx={{
                                color: 'error.light',
                                '&:hover': { color: 'error.main', bgcolor: 'error.light' + '20' },
                            }}
                        >
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </CardActions>
            </Box>
        </Card>
    );
}
