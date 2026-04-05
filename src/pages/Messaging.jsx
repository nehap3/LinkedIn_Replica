import React, { useEffect, useState, useRef } from 'react';
import { Box, Typography, Grid, Paper, Avatar, TextField, IconButton, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import { collection, query, getDocs, addDoc, onSnapshot, serverTimestamp, doc, setDoc, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuthStore } from '../store/useAuthStore';

const Messaging = () => {
    const user = useAuthStore((state) => state.user);
    const [connections, setConnections] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const scrollRef = useRef(null);

    useEffect(() => {
        if (!user) return;
        const fetchConnections = async () => {
            const reqQuery = query(collection(db, 'connections'));
            const querySnapshot = await getDocs(reqQuery);
            const connectedIds = [];
            querySnapshot.forEach(doc => {
                const data = doc.data();
                if (data.status === 'accepted') {
                    if (data.senderId === user.uid) connectedIds.push(data.receiverId);
                    else if (data.receiverId === user.uid) connectedIds.push(data.senderId);
                }
            });

            const usersQuery = query(collection(db, 'users'));
            const uSnap = await getDocs(usersQuery);
            const myConns = [];
            uSnap.forEach(d => {
                if (connectedIds.includes(d.id)) {
                    myConns.push({ ...d.data(), id: d.id, uid: d.id });
                }
            });
            setConnections(myConns);
        };
        fetchConnections();
    }, [user]);

    useEffect(() => {
        if (!activeChat || !user) return;
        const chatId = [user.uid, activeChat.uid].sort().join('_');
        const q = query(collection(db, 'chats', chatId, 'messages'), orderBy('timestamp', 'asc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        return () => unsubscribe();
    }, [activeChat, user]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || !activeChat) return;
        const chatId = [user.uid, activeChat.uid].sort().join('_');
        await setDoc(doc(db, 'chats', chatId), { participants: [user.uid, activeChat.uid] }, { merge: true });

        await addDoc(collection(db, 'chats', chatId, 'messages'), {
            text: input,
            senderId: user.uid,
            timestamp: serverTimestamp()
        });
        setInput('');
    };

    return (
        <Box sx={{ pb: 5 }}>
            <Paper elevation={1} sx={{ borderRadius: 2, overflow: 'hidden', display: 'flex', height: '70vh' }}>
                <Grid container>
                    {/* Sidebar */}
                    <Grid item xs={12} md={4} sx={{ borderRight: '1px solid #e0e0e0', display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
                            <Typography variant="h6" fontWeight="bold">Messaging</Typography>
                        </Box>
                        <List sx={{ flexGrow: 1, overflowY: 'auto' }}>
                            {connections.length === 0 ? (
                                <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>You need to add connections to message them.</Typography>
                            ) : (
                                connections.map(conn => (
                                    <ListItem
                                        button="true"
                                        key={conn.id}
                                        onClick={() => setActiveChat(conn)}
                                        sx={{ backgroundColor: activeChat?.uid === conn.uid ? '#eef3f8' : 'white' }}
                                    >
                                        <ListItemAvatar>
                                            <Avatar src={conn.photoURL} />
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={<Typography fontWeight="bold">{conn.displayName}</Typography>}
                                            secondary={conn.headline}
                                            primaryTypographyProps={{ variant: 'subtitle2' }}
                                            secondaryTypographyProps={{ variant: 'caption', noWrap: true }}
                                        />
                                    </ListItem>
                                ))
                            )}
                        </List>
                    </Grid>

                    {/* Chat Area */}
                    <Grid item xs={12} md={8} sx={{ display: 'flex', flexDirection: 'column', height: '70vh' }}>
                        {activeChat ? (
                            <>
                                <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0', display: 'flex', alignItems: 'center' }}>
                                    <Typography variant="subtitle1" fontWeight="bold">{activeChat.displayName}</Typography>
                                </Box>
                                <Box ref={scrollRef} sx={{ p: 2, flexGrow: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                                    {messages.map(msg => (
                                        <Box key={msg.id} sx={{ mb: 2, alignSelf: msg.senderId === user.uid ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
                                            <Paper elevation={0} sx={{
                                                p: 1.5,
                                                borderRadius: 2,
                                                borderBottomRightRadius: msg.senderId === user.uid ? 0 : 2,
                                                borderBottomLeftRadius: msg.senderId === user.uid ? 2 : 0,
                                                backgroundColor: msg.senderId === user.uid ? '#0a66c2' : '#f3f2ef',
                                                color: msg.senderId === user.uid ? 'white' : 'black'
                                            }}>
                                                <Typography variant="body2">{msg.text}</Typography>
                                            </Paper>
                                        </Box>
                                    ))}
                                </Box>
                                <Box sx={{ borderTop: '1px solid #e0e0e0', p: 2, backgroundColor: '#f9f9f9', display: 'flex', alignItems: 'center' }}>
                                    <TextField
                                        fullWidth
                                        placeholder="Write a message..."
                                        variant="outlined"
                                        size="small"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyPress={(e) => { if (e.key === 'Enter') handleSend(); }}
                                        sx={{ backgroundColor: 'white', borderRadius: 2, mr: 1 }}
                                    />
                                    <IconButton onClick={handleSend} color="primary" disabled={!input.trim()}>
                                        <SendIcon />
                                    </IconButton>
                                </Box>
                            </>
                        ) : (
                            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Typography variant="body1" color="text.secondary">Select a connection to start messaging</Typography>
                            </Box>
                        )}
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};

export default Messaging;
