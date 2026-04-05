import React from 'react';
import { AppBar, Toolbar, Box, InputBase, IconButton, Typography, Avatar, Menu, MenuItem } from '@mui/material';
import { Search as SearchIcon, Home, SupervisorAccount, Work, Message, Notifications } from '@mui/icons-material';
import { useAuthStore } from '../../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const navigate = useNavigate();

    const handleMenu = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const onLogout = () => {
        handleClose();
        logout();
    };

    return (
        <AppBar position="sticky" sx={{ backgroundColor: 'white', color: 'text.secondary', borderBottom: '1px solid #e0e0e0', boxShadow: 'none' }}>
            <Toolbar sx={{ justifyContent: 'space-between', maxWidth: 1128, width: '100%', margin: '0 auto', minHeight: '52px !important' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ bgcolor: '#0a66c2', color: 'white', borderRadius: 1, p: '0 6px', mr: 1, fontWeight: 'bold', fontSize: '20px' }}>in</Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', backgroundColor: '#eef3f8', borderRadius: 1, px: 2, padding: '4px' }}>
                        <SearchIcon sx={{ color: 'action.active', mr: 1, fontSize: 20 }} />
                        <InputBase
                            placeholder="Search"
                            inputProps={{ 'aria-label': 'search' }}
                            sx={{ fontSize: '14px' }}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter' && e.target.value.trim()) {
                                    navigate(`/search?q=${encodeURIComponent(e.target.value.trim())}`);
                                }
                            }}
                        />
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 3 } }}>
                    <IconButton onClick={() => navigate('/feed')} sx={{ flexDirection: 'column', p: 0, '&:hover': { color: 'text.primary' } }}><Home /><Typography variant="caption" sx={{ display: { xs: 'none', md: 'block' } }}>Home</Typography></IconButton>
                    <IconButton onClick={() => navigate('/connections')} sx={{ flexDirection: 'column', p: 0, '&:hover': { color: 'text.primary' } }}><SupervisorAccount /><Typography variant="caption" sx={{ display: { xs: 'none', md: 'block' } }}>My Network</Typography></IconButton>
                    <IconButton onClick={() => navigate('/jobs')} sx={{ flexDirection: 'column', p: 0, '&:hover': { color: 'text.primary' } }}><Work /><Typography variant="caption" sx={{ display: { xs: 'none', md: 'block' } }}>Jobs</Typography></IconButton>
                    <IconButton onClick={() => navigate('/messaging')} sx={{ flexDirection: 'column', p: 0, '&:hover': { color: 'text.primary' } }}><Message /><Typography variant="caption" sx={{ display: { xs: 'none', md: 'block' } }}>Messaging</Typography></IconButton>
                    <IconButton onClick={() => navigate('/notifications')} sx={{ flexDirection: 'column', p: 0, '&:hover': { color: 'text.primary' } }}><Notifications /><Typography variant="caption" sx={{ display: { xs: 'none', md: 'block' } }}>Notifications</Typography></IconButton>

                    <Box onClick={handleMenu} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', ml: { xs: 1, md: 2 } }}>
                        <Avatar src={user?.photoURL} sx={{ width: 24, height: 24 }} />
                        <Typography variant="caption" sx={{ display: { xs: 'none', md: 'block' }, display: 'flex', alignItems: 'center' }}>Me ▼</Typography>
                    </Box>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={() => { handleClose(); navigate('/profile'); }}>View Profile</MenuItem>
                        <MenuItem onClick={onLogout}>Sign Out</MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
};
export default Header;
