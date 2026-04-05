import React, { useState } from 'react';
import { Box, Typography, Button, Avatar, Paper, Divider, IconButton, Grid, Chip } from '@mui/material';
import { Edit as EditIcon, Add as AddIcon, CameraAlt as CameraAltIcon } from '@mui/icons-material';
import { useAuthStore } from '../store/useAuthStore';
import EditProfileDialog from '../components/profile/EditProfileDialog';

const Profile = () => {
    const user = useAuthStore((state) => state.user);
    const [editDialogOpen, setEditDialogOpen] = useState(false);

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
                                <Avatar src={user.photoURL} sx={{ width: 140, height: 140, border: '4px solid white', cursor: 'pointer' }} />
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

                    {/* Experience Section */}
                    <Paper elevation={1} sx={{ borderRadius: 2, p: 3, mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Experience</Typography>
                            <Box>
                                <IconButton><AddIcon /></IconButton>
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
        </Box>
    );
};

export default Profile;
