import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Paper, Button, Divider, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuthStore } from '../store/useAuthStore';

const Jobs = () => {
    const user = useAuthStore((state) => state.user);
    const [jobs, setJobs] = useState([]);
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [company, setCompany] = useState('');
    const [description, setDescription] = useState('');
    const [applyLink, setApplyLink] = useState('');

    useEffect(() => {
        const q = query(collection(db, 'jobs'), orderBy('timestamp', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setJobs(fetched);
        });
        return () => unsubscribe();
    }, []);

    const handlePostJob = async () => {
        if (!title.trim() || !company.trim()) return;
        await addDoc(collection(db, 'jobs'), {
            title,
            company,
            description,
            applyLink,
            postedBy: user.uid,
            timestamp: serverTimestamp()
        });
        setOpen(false);
        setTitle('');
        setCompany('');
        setDescription('');
        setApplyLink('');
    };

    return (
        <Box sx={{ pb: 5 }}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                    <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
                        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>My jobs</Typography>
                        <Button
                            variant="outlined"
                            fullWidth
                            sx={{ borderRadius: 20, mb: 1, fontWeight: 'bold' }}
                            onClick={() => setOpen(true)}
                        >
                            Post a free job
                        </Button>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={9}>
                    <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
                        <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>Recommended for you</Typography>
                        {jobs.length === 0 ? (
                            <Typography variant="body2" color="text.secondary">No jobs posted yet.</Typography>
                        ) : (
                            jobs.map((job, idx) => (
                                <Box key={job.id} sx={{ mb: 3 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <Box>
                                            <Typography variant="subtitle1" color="primary" fontWeight="bold" sx={{ '&:hover': { textDecoration: 'underline', cursor: 'pointer' } }}>
                                                {job.title}
                                            </Typography>
                                            <Typography variant="body2">{job.company}</Typography>
                                            <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>{job.description}</Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {job.timestamp ? new Date(job.timestamp.toDate()).toLocaleDateString() : 'Just now'}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    {job.applyLink && (
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            size="small"
                                            sx={{ mt: 2, borderRadius: 20 }}
                                            href={job.applyLink.startsWith('http') ? job.applyLink : `https://${job.applyLink}`}
                                            target="_blank"
                                        >
                                            Apply
                                        </Button>
                                    )}
                                    {idx !== jobs.length - 1 && <Divider sx={{ mt: 3 }} />}
                                </Box>
                            ))
                        )}
                    </Paper>
                </Grid>
            </Grid>

            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>Post a Job</DialogTitle>
                <DialogContent dividers>
                    <TextField fullWidth margin="dense" label="Job Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                    <TextField fullWidth margin="dense" label="Company" value={company} onChange={(e) => setCompany(e.target.value)} />
                    <TextField fullWidth margin="dense" label="Description" multiline rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
                    <TextField fullWidth margin="dense" label="Apply Link (URL)" value={applyLink} onChange={(e) => setApplyLink(e.target.value)} />
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setOpen(false)} sx={{ borderRadius: 20, fontWeight: 'bold' }}>Cancel</Button>
                    <Button onClick={handlePostJob} variant="contained" disabled={!title || !company} sx={{ borderRadius: 20, fontWeight: 'bold' }}>Post</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Jobs;
