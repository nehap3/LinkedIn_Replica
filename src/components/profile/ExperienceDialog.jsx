import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { doc, setDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuthStore } from '../../store/useAuthStore';

const ExperienceDialog = ({ open, onClose, user }) => {
    const [title, setTitle] = useState('');
    const [company, setCompany] = useState('');
    const [duration, setDuration] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!title || !company) return;
        setLoading(true);
        try {
            const newExp = { title, company, duration };
            const userRef = doc(db, 'users', user.uid);
            await setDoc(userRef, {
                experience: arrayUnion(newExp)
            }, { merge: true });

            const updatedExp = [...(user.experience || []), newExp];
            useAuthStore.setState((state) => ({
                user: { ...state.user, experience: updatedExp }
            }));
            onClose();
        } catch (error) {
            console.error("Error adding experience:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                Add Experience
                <IconButton onClick={onClose}><CloseIcon /></IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Title (e.g. Software Engineer)"
                    fullWidth
                    variant="outlined"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    sx={{ mb: 2 }}
                />
                <TextField
                    margin="dense"
                    label="Company (e.g. Google)"
                    fullWidth
                    variant="outlined"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    sx={{ mb: 2 }}
                />
                <TextField
                    margin="dense"
                    label="Duration (e.g. Jan 2023 - Present)"
                    fullWidth
                    variant="outlined"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                />
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={handleSave} variant="contained" disabled={loading || !title || !company} sx={{ borderRadius: '20px', fontWeight: 'bold' }}>
                    {loading ? 'Saving...' : 'Save'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ExperienceDialog;
