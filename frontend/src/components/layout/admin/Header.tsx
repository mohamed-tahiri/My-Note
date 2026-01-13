import { Box, Stack, InputBase, Paper, IconButton } from '@mui/material';
import { Search, Bell, Menu as MenuIcon } from 'lucide-react';

interface HeaderProps {
    onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
    return (   
        <Box sx={{ 
            p: 2, px: { xs: 2, md: 4 }, 
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
            bgcolor: 'white', borderBottom: '1px solid #E2E8F0' 
        }}>
            
            <IconButton 
                onClick={onMenuClick}
                sx={{ display: { xs: 'flex', md: 'none' }, mr: 1, color: 'primary.main' }}
            >
                <MenuIcon size={22} />
            </IconButton>

            <Paper sx={{ 
                px: 2, py: 0.5, display: 'flex', alignItems: 'center', 
                width: { xs: '100%', sm: 400 }, // S'adapte à la largeur
                borderRadius: '8px', bgcolor: '#F8FAFC' 
            }} elevation={0}>
                <Search size={16} color="#64748B" />
                <InputBase placeholder="Recherche..." sx={{ ml: 2, flex: 1, fontSize: '14px' }} />
            </Paper>
        
            <Stack direction="row" spacing={2} alignItems="center" sx={{ ml: 2 }}>
                <Bell size={20} color="#64748B" style={{ cursor: 'pointer' }} />
            </Stack>
        </Box>
    )
}