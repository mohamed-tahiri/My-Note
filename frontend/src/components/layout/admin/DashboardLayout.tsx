import { useState } from 'react';
import { Box, Drawer } from '@mui/material';
import SideBar from './SideBar.tsx';
import { Header } from './Header.tsx';
import { Outlet } from 'react-router-dom';


const DashboardLayout = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <Box sx={{ display: 'flex', bgcolor: 'background.default', height: '100vh', width: '100vw', overflow: 'hidden' }}>
            
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                <SideBar />
            </Box>

            <Drawer
                anchor="left"
                open={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
                sx={{ display: { xs: 'block', md: 'none' } }}
                PaperProps={{ sx: { width: '280', border: 'none' } }}
            >
                <SideBar />
            </Drawer>
            
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minWidth: 0, height: '100vh' }}>
                {/* On passe la fonction de toggle au Header */}
                <Header onMenuClick={toggleMobileMenu} />
                
                <Box sx={{ p: { xs: 2, md: 6 }, flexGrow: 1, overflowY: 'auto' }}>
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
};

export default DashboardLayout;