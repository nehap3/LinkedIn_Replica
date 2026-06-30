import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { doc, setDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuthStore } from '../../store/useAuthStore';

const ExperienceDialog = ({ open, onClose, user, editIndex }) => {
    const [title, setTitle] = useState('');
    const [company, setCompany] = useState('');
    const [duration, setDuration] = useState('');
    const [loading, setLoading] = useState(false);
    const isEditing = editIndex !== null && editIndex !== undefined;

    React.useEffect(() => {
        if (open) {
            if (isEditing && user?.experience?.[editIndex]) {
                const exp = user.experience[editIndex];
                setTitle(exp.title || '');
                setCompany(exp.company || '');
                setDuration(exp.duration || '');
            } else {
                setTitle('');
                setCompany('');
                setDuration('');
            }
        }
    }, [open, isEditing, editIndex, user]);

    const handleSave = async () => {
        if (!title || !company) return;
        setLoading(true);
        try {
            const newExp = { title, company, duration };
            const userRef = doc(db, 'users', user.uid);
            let updatedExp = [...(user.experience || [])];
            
            if (isEditing) {
                updatedExp[editIndex] = newExp;
            } else {
                updatedExp.push(newExp);
            }

            await setDoc(userRef, { experience: updatedExp }, { merge: true });

            useAuthStore.setState((state) => ({
                user: { ...state.user, experience: updatedExp }
            }));
            onClose();
        } catch (error) {
            console.error("Error saving experience:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!isEditing) return;
        setLoading(true);
        try {
            const userRef = doc(db, 'users', user.uid);
            let updatedExp = [...(user.experience || [])];
            updatedExp.splice(editIndex, 1);

            await setDoc(userRef, { experience: updatedExp }, { merge: true });

            useAuthStore.setState((state) => ({
                user: { ...state.user, experience: updatedExp }
            }));
            onClose();
        } catch (error) {
            console.error("Error deleting experience:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {isEditing ? 'Edit Experience' : 'Add Experience'}
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
            <DialogActions sx={{ p: 2, display: 'flex', justifyContent: isEditing ? 'space-between' : 'flex-end' }}>
                {isEditing && (
                    <Button onClick={handleDelete} variant="outlined" color="error" disabled={loading} sx={{ borderRadius: '20px', fontWeight: 'bold' }}>
                        Delete
                    </Button>
                )}
                <Button onClick={handleSave} variant="contained" disabled={loading || !title || !company} sx={{ borderRadius: '20px', fontWeight: 'bold' }}>
                    {loading ? 'Saving...' : 'Save'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ExperienceDialog;
