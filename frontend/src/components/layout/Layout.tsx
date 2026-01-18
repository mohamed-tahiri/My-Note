import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import Header from './Header';
import Footer from './Footer';

const Layout: React.FC = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
                bgcolor: 'background.default', // Utilise le Slate très clair #F8FAFC
            }}
        >
            <Header />

            <Box
                component="main"
                sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    py: { xs: 3, md: 6 }, // Espacement vertical responsive
                }}
            >
                <Container
                    maxWidth="lg"
                    sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <Outlet />
                </Container>
            </Box>

            <Footer />
        </Box>
    );
};

export default Layout;
