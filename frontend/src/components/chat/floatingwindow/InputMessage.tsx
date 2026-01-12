import { alpha, Box, IconButton, InputBase,  } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';

interface InputMessageProps {
    message: string,
    setMessage: (value: string) => void,
    handleSend: (e: React.FormEvent) => void
}

export default function InputMessage({ message, setMessage, handleSend }: InputMessageProps) {
    return (
        <Box sx={{ p: 1.5, display: 'flex', alignItems: 'center', gap: 1, bgcolor: 'white' }}>
            <InputBase
                fullWidth
                multiline
                maxRows={3}
                placeholder="Écrire un message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                sx={{ 
                    fontSize: '0.85rem', 
                    bgcolor: alpha('#64748b', 0.08), 
                    borderRadius: '20px', 
                    px: 2, py: 0.8 
                }}
            />
            <IconButton onClick={handleSend} size="small" color="primary" sx={{ bgcolor: alpha('#2563eb', 0.1) }}>
                <SendIcon fontSize="small" />
            </IconButton>
        </Box>
    )
}