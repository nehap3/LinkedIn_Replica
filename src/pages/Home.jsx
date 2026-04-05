import React, { useEffect, useState } from 'react';
import { Box, Grid } from '@mui/material';
import CreatePost from '../components/feed/CreatePost';
import Post from '../components/feed/Post';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

const Home = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const q = query(collection(db, 'posts'), orderBy('timestamp', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchPosts = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setPosts(fetchPosts);
        });

        return () => unsubscribe();
    }, []);

    return (
        <Box sx={{ pb: 5 }}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={3} sx={{ display: { xs: 'none', md: 'block' } }}>
                    {/* Left Sidebar Placeholder for Profile summary */}
                    <Box sx={{ bgcolor: 'white', borderRadius: 2, height: 200, border: '1px solid #e0e0e0', mb: 2 }} />
                </Grid>

                <Grid item xs={12} md={6}>
                    <CreatePost />
                    <Box sx={{ mt: 2 }}>
                        {posts.map(post => (
                            <Post key={post.id} post={post} />
                        ))}
                    </Box>
                </Grid>

                <Grid item xs={12} md={3} sx={{ display: { xs: 'none', md: 'block' } }}>
                    {/* Right Sidebar Placeholder for News recommendations */}
                    <Box sx={{ bgcolor: 'white', borderRadius: 2, height: 300, border: '1px solid #e0e0e0' }} />
                </Grid>
            </Grid>
        </Box>
    );
};

export default Home;
