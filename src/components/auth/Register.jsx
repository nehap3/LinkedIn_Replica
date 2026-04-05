import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Container, Paper } from '@mui/material';
import { useAuthStore } from '../../store/useAuthStore';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');

    const register = useAuthStore((state) => state.register);
    const error = useAuthStore((state) => state.error);
    const loading = useAuthStore((state) => state.loading);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        await register(email, password, displayName);
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h3" color="primary" sx={{ fontWeight: 'bold', mb: 3 }}>
                    Linked<span style={{ color: '#0a66c2' }}>In</span>
                </Typography>
                <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
                    <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
                        Make the most of your professional life
                    </Typography>

                    <Box component="form" onSubmit={handleRegister} noValidate>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="displayName"
                            label="Full Name"
                            name="displayName"
                            autoComplete="name"
                            autoFocus
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password (6 or more characters)"
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {error && <Typography color="error" variant="body2" sx={{ mt: 1 }}>{error}</Typography>}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={loading}
                            sx={{ mt: 3, mb: 2, borderRadius: '20px', py: 1.5, fontSize: '1rem', fontWeight: 'bold' }}
                        >
                            {loading ? 'Joining...' : 'Agree & Join'}
                        </Button>
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="body2">
                                Already on LinkedIn?{' '}
                                <Link to="/login" style={{ textDecoration: 'none', fontWeight: 'bold', color: '#0a66c2' }}>
                                    Sign in
                                </Link>
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default Register;
