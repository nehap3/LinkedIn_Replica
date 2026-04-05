import React, { useState } from 'react';
import { Paper, Box, Avatar, InputBase, Button } from '@mui/material';
import { useAuthStore } from '../../store/useAuthStore';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';

const CreatePost = () => {
    const user = useAuthStore((state) => state.user);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const handlePost = async () => {
        if (!input.trim() || !user) return;
        setLoading(true);
        try {
            await addDoc(collection(db, 'posts'), {
                text: input,
                authorId: user.uid,
                authorName: user.displayName,
                authorPhoto: user.photoURL || '',
                authorHeadline: user.headline || '',
                timestamp: serverTimestamp(),
                likes: [],
                comments: []
            });
            setInput('');
        } catch (error) {
            console.error("Error creating post", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Paper elevation={1} sx={{ borderRadius: 2, p: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Avatar src={user?.photoURL} sx={{ mr: 2 }} />
                <Box sx={{ flexGrow: 1, border: '1px solid #b0b0b0', borderRadius: 5, px: 2, py: 1 }}>
                    <InputBase
                        placeholder="Start a post"
                        fullWidth
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') handlePost();
                        }}
                    />
                </Box>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 1, mt: 1 }}>
                <Button
                    variant="contained"
                    disabled={!input.trim() || loading}
                    onClick={handlePost}
                    sx={{ borderRadius: '20px', fontWeight: 'bold' }}
                >
                    Post
                </Button>
            </Box>
        </Paper>
    );
};

export default CreatePost;
