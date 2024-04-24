import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Dialog, IconButton, Typography, Button, DialogContent, Box, Avatar } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CloseIcon from '@mui/icons-material/Close';

const DetailPostModal = ({ isOpen, onRequestClose, postId, commentId, responseId }) => {
    const [postDetails, setPostDetails] = useState(null);
    const [commentDetails, setCommentDetails] = useState(null);
    const [responseDetails, setResponseDetails] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const token = JSON.parse(localStorage.getItem('login'))?.token;

    useEffect(() => {
        if (postId) {
            fetchPostDetails();
        }
    }, [postId]);

    useEffect(() => {
        if (commentId) {
            fetchCommentDetails();
        }
    }, [commentId]);

    useEffect(() => {
        if (responseId) {
            fetchResponseDetails();
        }
    }, [responseId]);

    const fetchPostDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/getPostById/${postId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPostDetails(response.data);
        } catch (error) {
            console.error('Error fetching post details:', error);
        }
    };

    const fetchCommentDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/comment/${commentId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCommentDetails(response.data);
        } catch (error) {
            console.error('Error fetching comment details:', error);
        }
    };

    const fetchResponseDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/comment/${commentId}`, { // Using the comment endpoint to fetch the response
                headers: { Authorization: `Bearer ${token}` },
            });
            const specificResponse = response.data.responses.find(r => r.id_reponse === responseId);
            setResponseDetails(specificResponse);
        } catch (error) {
            console.error('Error fetching response details:', error);
        }
    };

    const showNextImage = () => {
        setCurrentImageIndex(prev => (prev + 1) % postDetails.lesImages.length);
    };

    const showPreviousImage = () => {
        setCurrentImageIndex(prev => (prev - 1 + postDetails.lesImages.length) % postDetails.lesImages.length);
    };

    return (
        <Dialog open={isOpen} onClose={onRequestClose} maxWidth="md" fullWidth>
            <IconButton onClick={onRequestClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
                <CloseIcon />
            </IconButton>
            {postDetails ? (
                <DialogContent dividers>
                    <Typography variant="h6" gutterBottom>
                        Post Details
                    </Typography>
                    <Box display="flex" alignItems="center" gap={2} marginBottom={2}>
                        <Avatar src={`http://localhost:5000/${postDetails.utilisateur.photo}`} alt="User" />
                        <Typography variant="subtitle1">{postDetails.utilisateur.prenom} {postDetails.utilisateur.nom}</Typography>
                    </Box>
                    <Typography variant="body1" paragraph>
                        {postDetails.contenu}
                    </Typography>
                    {commentDetails && (
                        <Box display="flex" alignItems="center" gap={2} marginBottom={2}>
                            <Avatar src={`http://localhost:5000/${commentDetails.utilisateur.photo}`} alt="Comment User" />
                            <Typography variant="body2" paragraph>
                                Comment by {commentDetails.utilisateur.prenom}: {commentDetails.cmntr}
                            </Typography>
                        </Box>
                    )}
                    {responseDetails && (
                        <Box display="flex" alignItems="center" gap={2} marginBottom={2}>
                            <Avatar src={`http://localhost:5000/${responseDetails.utilisateur.photo}`} alt="Response User" />
                            <Typography variant="body2" paragraph>
                                Response by {responseDetails.utilisateur.prenom}: {responseDetails.contenu}
                            </Typography>
                        </Box>
                    )}
                    {postDetails.lesImages && postDetails.lesImages.length > 0 && (
                        <Box display="flex" alignItems="center" justifyContent="center">
                            <IconButton onClick={showPreviousImage} disabled={postDetails.lesImages.length <= 1}>
                                <ArrowBackIosIcon />
                            </IconButton>
                            <img
                                src={`http://localhost:5000/${postDetails.lesImages[currentImageIndex].pathImage}`}
                                alt="Post"
                                style={{ maxHeight: 300, maxWidth: '100%' }}
                            />
                            <IconButton onClick={showNextImage} disabled={postDetails.lesImages.length <= 1}>
                                <ArrowForwardIosIcon />
                            </IconButton>
                        </Box>
                    )}
                </DialogContent>
            ) : (
                <DialogContent>
                    <Typography>Loading...</Typography>
                </DialogContent>
            )}
        </Dialog>
    );
    
};

export default DetailPostModal;
