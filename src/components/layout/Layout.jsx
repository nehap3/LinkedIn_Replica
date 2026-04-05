import React from 'react';
import Header from './Header';
import { Box } from '@mui/material';

const Layout = ({ children }) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f3f2ef' }}>
            <Header />
            <Box sx={{ flexGrow: 1, maxWidth: 1128, margin: '0 auto', width: '100%', pt: 3, px: { xs: 2, md: 0 } }}>
                {children}
            </Box>
        </Box>
    );
};

export default Layout;
