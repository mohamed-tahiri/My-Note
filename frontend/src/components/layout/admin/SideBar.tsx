import { Box, Typography, Stack } from '@mui/material';
import { LayoutDashboard, Activity, Database, Shield, Settings } from 'lucide-react';
import { MenuButton } from './SidebarButton';
import { Link, useLocation } from 'react-router-dom';

export default function SideBar() {
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    return (
        <Box sx={{ 
            width: 280, 
            minWidth: 280, 
            borderRight: '1px solid #E2E8F0', 
            p: 3, 
            display: 'flex',
            flexDirection: 'column',
            bgcolor: 'white',
            height: '95vh',
            position: 'sticky',
            top: 0
        }}>
            <Typography variant="h6" sx={{ mb: 4, fontWeight: 800, color: 'primary.main' }}>
                CORE_SYSTEM
            </Typography>
            
            <Stack spacing={1} sx={{ flexGrow: 1 }}>
                <Link to="/admin/overview" style={{ textDecoration: 'none' }}>
                    <MenuButton 
                        icon={<LayoutDashboard size={18}/>} 
                        label="Overview" 
                        active={isActive('/overview')} 
                    />
                </Link>
                <Link to="/admin/infrastructure" style={{ textDecoration: 'none' }}>
                    <MenuButton 
                        icon={<Database size={18}/>} 
                        label="Infrastructure" 
                        active={isActive('/infrastructure')} 
                    />
                </Link>
                <Link to="/admin/analytics" style={{ textDecoration: 'none' }}>
                    <MenuButton 
                        icon={<Activity size={18}/>} 
                        label="Analytics" 
                        active={isActive('/analytics')} 
                    />
                </Link>
                <Link to="/admin/security" style={{ textDecoration: 'none' }}>
                    <MenuButton 
                        icon={<Shield size={18}/>} 
                        label="Security" 
                        active={isActive('/security')} 
                    />
                </Link>
            </Stack>

            <Link to="/admin/settings" style={{ textDecoration: 'none' }}>    
                <MenuButton 
                    icon={<Settings size={18}/>} 
                    label="Settings" 
                    active={isActive('/settings')} 
                />
            </Link>
        </Box>
    );
}