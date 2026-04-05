import React, { useState } from 'react';
import { Paper, Box, Avatar, Typography, Divider, Button, InputBase } from '@mui/material';
import { ThumbUpAltOutlined, ThumbUp, ChatOutlined, ShareOutlined, SendOutlined } from '@mui/icons-material';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuthStore } from '../../store/useAuthStore';

const Post = ({ post }) => {
    const user = useAuthStore((state) => state.user);
    const [showComments, setShowComments] = useState(false);
    const [commentInput, setCommentInput] = useState('');

    const hasLiked = post.likes?.includes(user?.uid);

    const handleLike = async () => {
        if (!user) return;
        const postRef = doc(db, 'posts', post.id);
        if (hasLiked) {
            await updateDoc(postRef, {
                likes: arrayRemove(user.uid)
            });
        } else {
            await updateDoc(postRef, {
                likes: arrayUnion(user.uid)
            });
        }
    };

    const handleComment = async () => {
        if (!commentInput.trim() || !user) return;
        const postRef = doc(db, 'posts', post.id);
        await updateDoc(postRef, {
            comments: arrayUnion({
                userId: user.uid,
                userName: user.displayName,
                userPhoto: user.photoURL || '',
                text: commentInput,
                timestamp: new Date().toISOString()
            })
        });
        setCommentInput('');
    };

    return (
        <Paper elevation={1} sx={{ borderRadius: 2, mb: 2, pt: 2 }}>
            <Box sx={{ px: 2, display: 'flex', alignItems: 'center', mb: 1 }}>
                <Avatar src={post.authorPhoto} sx={{ width: 48, height: 48, mr: 1 }} />
                <Box>
                    <Typography variant="subtitle2" fontWeight="bold">{post.authorName}</Typography>
                    <Typography variant="caption" color="text.secondary" display="block">{post.authorHeadline}</Typography>
                    <Typography variant="caption" color="text.secondary">
                        {post.timestamp ? new Date(post.timestamp?.toDate()).toLocaleDateString() : 'Just now'}
                    </Typography>
                </Box>
            </Box>

            <Box sx={{ px: 2, pb: 1 }}>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>{post.text}</Typography>
            </Box>

            <Box sx={{ px: 2, pb: 1, display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="caption" color="text.secondary">
                    {post.likes?.length || 0} likes
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }} onClick={() => setShowComments(!showComments)}>
                    {post.comments?.length || 0} comments
                </Typography>
            </Box>
            <Divider />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 2, py: 0.5 }}>
                <Button startIcon={hasLiked ? <ThumbUp color="primary" /> : <ThumbUpAltOutlined />} onClick={handleLike} sx={{ color: 'text.secondary', textTransform: 'none', '&:hover': { bgcolor: '#eef3f8' } }}>Like</Button>
                <Button startIcon={<ChatOutlined />} onClick={() => setShowComments(!showComments)} sx={{ color: 'text.secondary', textTransform: 'none', '&:hover': { bgcolor: '#eef3f8' } }}>Comment</Button>
                <Button startIcon={<ShareOutlined />} sx={{ color: 'text.secondary', textTransform: 'none', '&:hover': { bgcolor: '#eef3f8' } }}>Share</Button>
                <Button startIcon={<SendOutlined />} sx={{ color: 'text.secondary', textTransform: 'none', '&:hover': { bgcolor: '#eef3f8' } }}>Send</Button>
            </Box>

            {showComments && (
                <Box sx={{ px: 2, pb: 2, pt: 1, backgroundColor: '#f9f9f9', borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar src={user?.photoURL} sx={{ width: 32, height: 32, mr: 1 }} />
                        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', border: '1px solid #ccc', borderRadius: 5, px: 2, py: 0.5, bgcolor: 'white' }}>
                            <InputBase
                                placeholder="Add a comment..."
                                fullWidth
                                value={commentInput}
                                onChange={(e) => setCommentInput(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') handleComment();
                                }}
                            />
                        </Box>
                    </Box>
                    {post.comments?.map((comment, idx) => (
                        <Box key={idx} sx={{ display: 'flex', mb: 1.5 }}>
                            <Avatar src={comment.userPhoto} sx={{ width: 32, height: 32, mr: 1, mt: 0.5 }} />
                            <Box sx={{ bgcolor: '#ebebeb', p: 1.5, borderRadius: 2, flexGrow: 1 }}>
                                <Typography variant="subtitle2" fontWeight="bold">{comment.userName}</Typography>
                                <Typography variant="body2">{comment.text}</Typography>
                            </Box>
                        </Box>
                    ))}
                </Box>
            )}
        </Paper>
    );
};

export default Post;
