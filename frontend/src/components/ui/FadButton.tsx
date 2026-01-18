import { Fab } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';

interface FadButtonProps {
    onHandleFad : () => void;
}

export default function FadButton({ onHandleFad }: FadButtonProps) {
    return (
        <Fab 
            color="primary" 
            onClick={onHandleFad}
            sx={{ 
                position: 'fixed', 
                bottom: { xs: 80, md: 40 }, 
                right: { xs: 20, md: 40 },
                boxShadow: '0px 4px 20px rgba(37, 99, 235, 0.4)'
            }}
        >
            <AddIcon />
        </Fab>
    )
}