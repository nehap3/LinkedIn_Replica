import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Paper, Avatar, Button } from '@mui/material';
import { collection, query, getDocs, addDoc, onSnapshot, doc, updateDoc, setDoc, deleteDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuthStore } from '../store/useAuthStore';

const Connections = () => {
    const user = useAuthStore((state) => state.user);
    const [users, setUsers] = useState([]);
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        if (!user) return;

        const fetchUsers = async () => {
            const q = query(collection(db, 'users'));
            const querySnapshot = await getDocs(q);
            const userList = [];
            querySnapshot.forEach((doc) => {
                if (doc.id !== user.uid) {
                    userList.push({ ...doc.data(), id: doc.id });
                }
            });
            setUsers(userList);
        };
        fetchUsers();

        const reqQuery = query(collection(db, 'connections'));
        const unsubscribe = onSnapshot(reqQuery, (snapshot) => {
            const reqData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
                .filter(req => req.senderId === user.uid || req.receiverId === user.uid);
            setRequests(reqData);
        });

        return () => unsubscribe();
    }, [user]);

    const handleConnect = async (targetUserId) => {
        await addDoc(collection(db, 'connections'), {
            senderId: user.uid,
            receiverId: targetUserId,
            status: 'pending'
        });
    };

    const handleAccept = async (requestId) => {
        const req = requests.find(r => r.id === requestId);
        if (!req) return;

        await updateDoc(doc(db, 'connections', requestId), {
            status: 'accepted'
        });

        await setDoc(doc(db, 'users', req.senderId), {
            connections: arrayUnion(req.receiverId)
        }, { merge: true });
        await setDoc(doc(db, 'users', req.receiverId), {
            connections: arrayUnion(req.senderId)
        }, { merge: true });
    };

    const handleReject = async (requestId) => {
        await deleteDoc(doc(db, 'connections', requestId));
    };

    const getStatus = (targetUserId) => {
        const req = requests.find(r =>
            (r.senderId === user?.uid && r.receiverId === targetUserId) ||
            (r.receiverId === user?.uid && r.senderId === targetUserId)
        );
        if (!req) return 'none';
        if (req.status === 'accepted') return 'connected';
        if (req.senderId === user?.uid) return 'sent';
        return { status: 'received', id: req.id };
    };

    const pendingReceived = requests.filter(r => r.receiverId === user?.uid && r.status === 'pending');

    return (
        <Box sx={{ pb: 5 }}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                    <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
                        <Typography variant="subtitle1" fontWeight="bold">Manage my network</Typography>
                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" color="text.secondary">Connections</Typography>
                            <Typography variant="body2">{requests.filter(r => r.status === 'accepted').length}</Typography>
                        </Box>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={9}>
                    {/* Pending Invitations */}
                    {pendingReceived.length > 0 && (
                        <Paper elevation={1} sx={{ p: 2, borderRadius: 2, mb: 3 }}>
                            <Typography variant="h6" sx={{ mb: 2 }}>Invitations</Typography>
                            {pendingReceived.map(req => {
                                const sender = users.find(u => u.uid === req.senderId);
                                return (
                                    <Box key={req.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Avatar src={sender?.photoURL} sx={{ width: 48, height: 48, mr: 2 }} />
                                            <Box>
                                                <Typography variant="subtitle1" fontWeight="bold">{sender?.displayName || 'Unknown'}</Typography>
                                                <Typography variant="body2" color="text.secondary">{sender?.headline}</Typography>
                                            </Box>
                                        </Box>
                                        <Box>
                                            <Button onClick={() => handleReject(req.id)} sx={{ color: 'text.secondary', mr: 1, borderRadius: 20 }}>Ignore</Button>
                                            <Button onClick={() => handleAccept(req.id)} variant="outlined" sx={{ borderRadius: 20 }}>Accept</Button>
                                        </Box>
                                    </Box>
                                )
                            })}
                        </Paper>
                    )}

                    {/* Discover People */}
                    <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
                        <Typography variant="h6" sx={{ mb: 3 }}>Suggested for you</Typography>
                        <Grid container spacing={2}>
                            {users.map(u => {
                                const statusInfo = getStatus(u.uid);
                                if (statusInfo === 'connected' || (statusInfo.status === 'received')) return null;

                                return (
                                    <Grid item xs={12} sm={6} md={4} key={u.id}>
                                        <Paper variant="outlined" sx={{ borderRadius: 2, textAlign: 'center', p: 2, height: '100%' }}>
                                            <Avatar src={u.photoURL} sx={{ width: 80, height: 80, mx: 'auto', mb: 1 }} />
                                            <Typography variant="subtitle1" fontWeight="bold">{u.displayName}</Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, height: 40, overflow: 'hidden' }}>{u.headline}</Typography>

                                            {statusInfo === 'sent' ? (
                                                <Button disabled variant="outlined" fullWidth sx={{ borderRadius: 20 }}>Pending</Button>
                                            ) : (
                                                <Button onClick={() => handleConnect(u.uid)} variant="outlined" fullWidth sx={{ borderRadius: 20 }}>Connect</Button>
                                            )}
                                        </Paper>
                                    </Grid>
                                )
                            })}
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Connections;
