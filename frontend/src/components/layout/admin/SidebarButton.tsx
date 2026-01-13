import type { MenuButtonProps } from "@/types/admin";
import { Button } from "@mui/material";

export function MenuButton({ icon, label, active = false }: MenuButtonProps) {
    return (
        <Button 
            fullWidth 
            startIcon={icon}
            sx={{ 
            justifyContent: 'flex-start', 
            textTransform: 'none',
            color: active ? 'primary.main' : 'text.secondary',
            bgcolor: active ? 'rgba(15, 23, 42, 0.04)' : 'transparent',
            fontWeight: active ? 700 : 500,
            '&:hover': { bgcolor: 'rgba(15, 23, 42, 0.04)' }
            }}
        >
            {label}
        </Button>
    )
}