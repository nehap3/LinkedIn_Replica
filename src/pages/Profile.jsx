import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, Button, Avatar, Paper, Divider, IconButton, Grid, Chip, CircularProgress } from '@mui/material';
import { Edit as EditIcon, Add as AddIcon, CameraAlt as CameraAltIcon } from '@mui/icons-material';
import { useAuthStore } from '../store/useAuthStore';
import EditProfileDialog from '../components/profile/EditProfileDialog';
import ExperienceDialog from '../components/profile/ExperienceDialog';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

const Profile = () => {
    const user = useAuthStore((state) => state.user);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [experienceDialogOpen, setExperienceDialogOpen] = useState(false);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const fileInputRef = useRef(null);

    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file || !user) return;

        if (file.size > 800000) {
            alert("File is too large! Please select an image under 800KB.");
            return;
        }

        setUploadingPhoto(true);

        const reader = new FileReader();
        reader.onloadend = async () => {
            try {
                const base64String = reader.result;
                await setDoc(doc(db, 'users', user.uid), { photoURL: base64String }, { merge: true });

                useAuthStore.setState((state) => ({
                    user: { ...state.user, photoURL: base64String }
                }));
            } catch (error) {
                console.error("Upload failed", error);
                alert("Upload failed: " + error.message);
            } finally {
                setUploadingPhoto(false);
            }
        };
        reader.readAsDataURL(file);
    };

    if (!user) return null;

    return (
        <Box sx={{ pb: 5 }}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    {/* Top Profile Card */}
                    <Paper elevation={1} sx={{ borderRadius: 2, overflow: 'hidden', mb: 2 }}>
                        <Box sx={{ height: 160, backgroundColor: '#a0b4b7', position: 'relative' }}>
                            <IconButton sx={{ position: 'absolute', top: 16, right: 16, backgroundColor: 'white', '&:hover': { backgroundColor: '#f3f2ef' } }}>
                                <CameraAltIcon color="action" />
                            </IconButton>
                        </Box>
                        <Box sx={{ px: 3, pb: 3, position: 'relative' }}>
                            <Box sx={{ position: 'absolute', top: -76, left: 24, p: 0.5, backgroundColor: 'white', borderRadius: '50%' }}>
                                <input type="file" hidden ref={fileInputRef} onChange={handlePhotoUpload} accept="image/*" />
                                <Box sx={{ position: 'relative', display: 'inline-block' }}>
                                    <Avatar onClick={() => !uploadingPhoto && fileInputRef.current && fileInputRef.current.click()} src={user.photoURL} sx={{ width: 140, height: 140, border: '4px solid white', cursor: 'pointer', opacity: uploadingPhoto ? 0.5 : 1 }} />
                                    {uploadingPhoto && <CircularProgress size={40} sx={{ position: 'absolute', top: '50%', left: '50%', marginTop: '-20px', marginLeft: '-20px' }} />}
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 }}>
                                <IconButton onClick={() => setEditDialogOpen(true)}>
                                    <EditIcon />
                                </IconButton>
                            </Box>

                            <Box sx={{ mt: 3 }}>
                                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{user.displayName}</Typography>
                                <Typography variant="body1" color="text.primary" sx={{ mt: 0.5 }}>{user.headline || 'Student'}</Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{user.email}</Typography>
                                <Typography variant="body2" color="primary" sx={{ mt: 1, fontWeight: 'bold', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
                                    {user.connections?.length || 0} connections
                                </Typography>
                            </Box>
                        </Box>
                    </Paper>

                    {/* About Section */}
                    <Paper elevation={1} sx={{ borderRadius: 2, p: 3, mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>About</Typography>
                            <IconButton onClick={() => setEditDialogOpen(true)}><EditIcon /></IconButton>
                        </Box>
                        <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                            {user.about || "Write something about yourself..."}
                        </Typography>
                    </Paper>

                    {/* Activity Section removed as requested */}

                    {/* Experience Section */}
                    <Paper elevation={1} sx={{ borderRadius: 2, p: 3, mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Experience</Typography>
                            <Box>
                                <IconButton onClick={() => setExperienceDialogOpen(true)}><AddIcon /></IconButton>
                                <IconButton><EditIcon /></IconButton>
                            </Box>
                        </Box>
                        {user.experience?.length > 0 ? (
                            user.experience.map((exp, idx) => (
                                <Box key={idx} sx={{ mb: 2 }}>
                                    <Typography variant="subtitle1" fontWeight="bold">{exp.title}</Typography>
                                    <Typography variant="body2">{exp.company}</Typography>
                                    <Typography variant="caption" color="text.secondary">{exp.duration}</Typography>
                                    {idx !== user.experience.length - 1 && <Divider sx={{ mt: 2 }} />}
                                </Box>
                            ))
                        ) : (
                            <Typography variant="body2" color="text.secondary">No experience added yet.</Typography>
                        )}
                    </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Paper elevation={1} sx={{ borderRadius: 2, p: 2 }}>
                        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>Profile Language</Typography>
                        <Typography variant="body2" color="text.secondary">English</Typography>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>Public profile & URL</Typography>
                        <Typography variant="body2" color="text.secondary">Edit your public profile URL</Typography>
                    </Paper>
                </Grid>
            </Grid>

            {editDialogOpen && (
                <EditProfileDialog
                    open={editDialogOpen}
                    onClose={() => setEditDialogOpen(false)}
                    user={user}
                />
            )}

            {experienceDialogOpen && (
                <ExperienceDialog
                    open={experienceDialogOpen}
                    onClose={() => setExperienceDialogOpen(false)}
                    user={user}
                />
            )}
        </Box>
    );
};

export default Profile;
