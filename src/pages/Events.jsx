import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Paper, Button, Divider, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuthStore } from '../store/useAuthStore';

const Events = () => {
    const user = useAuthStore((state) => state.user);
    const [events, setEvents] = useState([]);
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        const q = query(collection(db, 'events'), orderBy('timestamp', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setEvents(fetched);
        });
        return () => unsubscribe();
    }, []);

    const handleCreateEvent = async () => {
        if (!title.trim() || !date.trim()) return;
        await addDoc(collection(db, 'events'), {
            title,
            date,
            description,
            hostId: user.uid,
            hostName: user.displayName,
            timestamp: serverTimestamp(),
            attendees: []
        });
        setOpen(false);
        setTitle('');
        setDate('');
        setDescription('');
    };

    return (
        <Box sx={{ pb: 5 }}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                    <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
                        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>Your events</Typography>
                        <Button
                            variant="outlined"
                            fullWidth
                            sx={{ borderRadius: 20, mb: 1, fontWeight: 'bold' }}
                            onClick={() => setOpen(true)}
                        >
                            Create Event
                        </Button>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={9}>
                    <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
                        <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>Upcoming Events</Typography>
                        {events.length === 0 ? (
                            <Typography variant="body2" color="text.secondary">No events created yet.</Typography>
                        ) : (
                            events.map((ev, idx) => (
                                <Box key={ev.id} sx={{ mb: 3 }}>
                                    <Box>
                                        <Typography variant="subtitle1" color="primary" fontWeight="bold">{ev.title}</Typography>
                                        <Typography variant="body2" fontWeight="bold">Date: {ev.date}</Typography>
                                        <Typography variant="caption" color="text.secondary" display="block">Hosted by: {ev.hostName}</Typography>
                                        <Typography variant="body2" sx={{ mt: 1 }}>{ev.description}</Typography>
                                    </Box>
                                    <Button variant="outlined" size="small" sx={{ mt: 2, borderRadius: 20, fontWeight: 'bold' }}>Attend</Button>
                                    {idx !== events.length - 1 && <Divider sx={{ mt: 3 }} />}
                                </Box>
                            ))
                        )}
                    </Paper>
                </Grid>
            </Grid>

            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle sx={{ fontWeight: 'bold' }}>Create an Event</DialogTitle>
                <DialogContent dividers>
                    <TextField fullWidth margin="dense" label="Event Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                    <TextField fullWidth margin="dense" label="Date & Time" placeholder="e.g., Nov 24, 2026 5:00 PM" value={date} onChange={(e) => setDate(e.target.value)} />
                    <TextField fullWidth margin="dense" label="Description" multiline rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setOpen(false)} sx={{ borderRadius: 20, fontWeight: 'bold' }}>Cancel</Button>
                    <Button onClick={handleCreateEvent} variant="contained" disabled={!title || !date} sx={{ borderRadius: 20, fontWeight: 'bold' }}>Create</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Events;
