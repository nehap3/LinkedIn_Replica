import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Paper, Avatar, Button } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuthStore } from '../store/useAuthStore';

const Search = () => {
    const [searchParams] = useSearchParams();
    const queryTerm = searchParams.get('q') || '';
    const user = useAuthStore((state) => state.user);
    const [results, setResults] = useState([]);

    useEffect(() => {
        if (!queryTerm) {
            setResults([]);
            return;
        }

        const fetchResults = async () => {
            const usersQ = query(collection(db, 'users'));
            const uSnap = await getDocs(usersQ);
            const userResults = [];
            uSnap.forEach(doc => {
                const data = doc.data();
                if (data.displayName?.toLowerCase().includes(queryTerm.toLowerCase()) && doc.id !== user?.uid) {
                    userResults.push({ type: 'user', id: doc.id, ...data });
                }
            });

            const jobsQ = query(collection(db, 'jobs'));
            const jSnap = await getDocs(jobsQ);
            const jobResults = [];
            jSnap.forEach(doc => {
                const data = doc.data();
                if (data.title?.toLowerCase().includes(queryTerm.toLowerCase()) || data.company?.toLowerCase().includes(queryTerm.toLowerCase())) {
                    jobResults.push({ type: 'job', id: doc.id, ...data });
                }
            });

            setResults([...userResults, ...jobResults]);
        };
        fetchResults();
    }, [queryTerm, user]);

    return (
        <Box sx={{ pb: 5 }}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
                        <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>Search Results for "{queryTerm}"</Typography>
                        {results.length === 0 ? (
                            <Typography variant="body2" color="text.secondary">No results found.</Typography>
                        ) : (
                            results.map(res => (
                                <Box key={res.id} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                                    {res.type === 'user' ? (
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Avatar src={res.photoURL} sx={{ width: 48, height: 48, mr: 2 }} />
                                            <Box flexGrow={1}>
                                                <Typography variant="subtitle1" fontWeight="bold">{res.displayName}</Typography>
                                                <Typography variant="body2" color="text.secondary">{res.headline}</Typography>
                                            </Box>
                                            <Button variant="outlined" sx={{ borderRadius: 20, fontWeight: 'bold' }}>Connect</Button>
                                        </Box>
                                    ) : (
                                        <Box>
                                            <Typography variant="subtitle1" color="primary" fontWeight="bold">{res.title}</Typography>
                                            <Typography variant="body2" fontWeight="bold">{res.company}</Typography>
                                            <Typography variant="caption" color="text.secondary" display="block">{res.description}</Typography>
                                            <Button variant="contained" size="small" sx={{ mt: 1, borderRadius: 20, fontWeight: 'bold' }}>Apply</Button>
                                        </Box>
                                    )}
                                </Box>
                            ))
                        )}
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
                        <Typography variant="subtitle1" fontWeight="bold">Filters</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>People</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Jobs</Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Search;
