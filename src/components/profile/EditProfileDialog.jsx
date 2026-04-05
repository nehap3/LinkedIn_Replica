import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuthStore } from '../../store/useAuthStore';

const EditProfileDialog = ({ open, onClose, user }) => {
    const [displayName, setDisplayName] = useState(user.displayName || '');
    const [headline, setHeadline] = useState(user.headline || '');
    const [about, setAbout] = useState(user.about || '');
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        setLoading(true);
        try {
            const userRef = doc(db, 'users', user.uid);
            await updateDoc(userRef, {
                displayName,
                headline,
                about
            });
            useAuthStore.setState((state) => ({
                user: { ...state.user, displayName, headline, about }
            }));
            onClose();
        } catch (error) {
            console.error("Error updating profile:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                Edit intro
                <IconButton onClick={onClose}><CloseIcon /></IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Full Name"
                    fullWidth
                    variant="outlined"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    sx={{ mb: 2 }}
                />
                <TextField
                    margin="dense"
                    label="Headline"
                    fullWidth
                    variant="outlined"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    sx={{ mb: 2 }}
                />
                <TextField
                    margin="dense"
                    label="About"
                    fullWidth
                    multiline
                    rows={4}
                    variant="outlined"
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                />
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={handleSave} variant="contained" disabled={loading} sx={{ borderRadius: '20px', fontWeight: 'bold' }}>
                    {loading ? 'Saving...' : 'Save'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditProfileDialog;
