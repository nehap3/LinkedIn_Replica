import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Paper, Avatar, Divider } from '@mui/material';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuthStore } from '../store/useAuthStore';

const Notifications = () => {
    const user = useAuthStore((state) => state.user);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        if (!user) return;

        const reqQuery = query(collection(db, 'connections'));
        const unsubscribe = onSnapshot(reqQuery, (snapshot) => {
            const reqs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
                .filter(req => req.receiverId === user.uid && req.status === 'pending');

            const newNotifs = reqs.map(r => ({
                id: r.id,
                text: `Sent you a connection request.`,
                type: 'connection',
                timestamp: new Date()
            }));

            setNotifications(newNotifs);
        });

        return () => unsubscribe();
    }, [user]);

    return (
        <Box sx={{ pb: 5 }}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                    <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
                        <Typography variant="subtitle1" fontWeight="bold">Manage your Notifications</Typography>
                        <Typography variant="body2" color="primary" sx={{ mt: 1, cursor: 'pointer', fontWeight: 'bold' }}>View Settings</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper elevation={1} sx={{ py: 2, borderRadius: 2 }}>
                        {notifications.length === 0 ? (
                            <Typography variant="body1" sx={{ textAlign: 'center', py: 5, color: 'text.secondary' }}>
                                You have no new notifications.
                            </Typography>
                        ) : (
                            notifications.map((notif, idx) => (
                                <Box key={notif.id}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', p: 2, '&:hover': { bgcolor: '#f3f2ef', cursor: 'pointer' } }}>
                                        <Avatar sx={{ mr: 2, bgcolor: '#0a66c2' }}>{notif.type === 'connection' ? 'C' : 'N'}</Avatar>
                                        <Typography variant="body2">
                                            <b>Someone</b> {notif.text}
                                        </Typography>
                                    </Box>
                                    {idx !== notifications.length - 1 && <Divider />}
                                </Box>
                            ))
                        )}
                    </Paper>
                </Grid>
                <Grid item xs={12} md={3} sx={{ display: { xs: 'none', md: 'block' } }}>
                    <Box sx={{ bgcolor: 'white', borderRadius: 2, height: 300, border: '1px solid #e0e0e0' }} />
                </Grid>
            </Grid>
        </Box>
    );
};

export default Notifications;
