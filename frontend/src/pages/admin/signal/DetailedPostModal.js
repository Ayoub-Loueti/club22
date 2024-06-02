import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Dialog,
  IconButton,
  Typography,
  DialogContent,
  Box,
  Avatar,
} from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CloseIcon from '@mui/icons-material/Close';

const DetailPostModal = ({
  isOpen,
  onRequestClose,
  postId,
  commentId,
  responseId,
}) => {
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
      const response = await axios.get(
        `http://54.242.240.123/getPostById/${postId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPostDetails(response.data);
    } catch (error) {
      console.error('Error fetching post details:', error);
    }
  };

  const fetchCommentDetails = async () => {
    try {
      const response = await axios.get(
        `http://54.242.240.123/comment/${commentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCommentDetails(response.data);
    } catch (error) {
      console.error(
        'Erreur lors de la récupération des détails du commentaire :',
        error
      );
    }
  };

  const fetchResponseDetails = async () => {
    try {
      const response = await axios.get(
        `http://54.242.240.123/comment/${commentId}`,
        {
          // Using the comment endpoint to fetch the response
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const specificResponse = response.data.responses.find(
        (r) => r.id_reponse === responseId
      );
      setResponseDetails(specificResponse);
    } catch (error) {
      console.error(
        'Erreur lors de la récupération des détails de la réponse :',
        error
      );
    }
  };

  const showNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % postDetails.lesImages.length);
  };

  const showPreviousImage = () => {
    setCurrentImageIndex(
      (prev) =>
        (prev - 1 + postDetails.lesImages.length) % postDetails.lesImages.length
    );
  };

  return (
    <Dialog open={isOpen} onClose={onRequestClose} maxWidth="md" fullWidth>
      <IconButton
        onClick={onRequestClose}
        sx={{ position: 'absolute', right: 8, top: 8 }}
      >
        <CloseIcon />
      </IconButton>
      {postDetails ? (
        <DialogContent dividers>
          <Typography variant="h6" gutterBottom>
            Détails de la publication
          </Typography>
          <Box display="flex" alignItems="center" gap={2} marginBottom={2}>
            <Avatar
              src={
                postDetails.utilisateur.photo
                  ? `http://54.242.240.123/${postDetails.utilisateur.photo}`
                  : 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'
              }
              alt="User"
            />

            <Typography variant="subtitle1">
              {postDetails.utilisateur.prenom} {postDetails.utilisateur.nom}
            </Typography>
          </Box>
          <Typography variant="body1" paragraph>
            {postDetails.contenu}
          </Typography>
          {commentDetails && (
            <Box display="flex" alignItems="center" gap={2} marginBottom={2}>
              <Avatar
                src={
                  commentDetails.utilisateur.photo
                    ? `http://54.242.240.123/${commentDetails.utilisateur.photo}`
                    : 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'
                }
                alt="CommentUser"
              />
              <Typography variant="body2" paragraph>
                Commentaire de {commentDetails.utilisateur.prenom}:{' '}
                {commentDetails.cmntr}
              </Typography>
            </Box>
          )}
          {responseDetails && (
            <Box display="flex" alignItems="center" gap={2} marginBottom={2}>
              <Avatar
                src={
                  responseDetails.utilisateur.photo
                    ? `http://54.242.240.123/${responseDetails.utilisateur.photo}`
                    : 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'
                }
                alt="Response USER"
              />
              <Typography variant="body2" paragraph>
                Réponse de {responseDetails.utilisateur.prenom}:{' '}
                {responseDetails.contenu}
              </Typography>
            </Box>
          )}
          {postDetails.lesImages && postDetails.lesImages.length > 0 && (
            <Box display="flex" alignItems="center" justifyContent="center">
              <IconButton
                onClick={showPreviousImage}
                disabled={postDetails.lesImages.length <= 1}
              >
                <ArrowBackIosIcon />
              </IconButton>
              <img
                src={`http://54.242.240.123/${postDetails.lesImages[currentImageIndex].pathImage}`}
                alt="Post"
                style={{ maxHeight: 300, maxWidth: '100%' }}
              />
              <IconButton
                onClick={showNextImage}
                disabled={postDetails.lesImages.length <= 1}
              >
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
