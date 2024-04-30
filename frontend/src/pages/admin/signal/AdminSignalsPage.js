import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Container, Typography, Button, Card, CardContent, CardActions, Link } from '@mui/material';
import DetailPostModal from './DetailedPostModal';
import { NavLink } from 'react-router-dom'; 
import NavAdmin from '../NavAdmin/navAdmin';
import PostModal from '../../../components/postModal/postModal';

const AdminSignalsPage = () => {
  const [signals, setSignals] = useState([]);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const [selectedResponseId, setSelectedResponseId] = useState(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isPostModalOpenD, setIsPostModalOpenD] = useState(false);
  const token = JSON.parse(localStorage.getItem('login'))?.token;

  useEffect(() => {
    fetchSignals();
  }, []);

  const fetchSignals = async () => {
    try {
      const response = await axios.get('http://localhost:5000/signals', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSignals(response.data);
    } catch (error) {
      console.error('Error fetching signals:', error);
      Swal.fire('Error', 'Failed to fetch signals.', 'error');
    }
  };

  const openPostModal = async (signal) => {
    setSelectedPostId(signal.id_post);
    setSelectedCommentId(signal.id_cmntr !== 0 ? signal.id_cmntr : null);
    setSelectedResponseId(signal.id_reponse !== 0 ? signal.id_reponse : null);
    setIsPostModalOpen(true);

    if (!signal.isRead) {
      await updateSignalStatus(signal.id_signaler, true);
    }
  };

  const updateSignalStatus = async (id, isRead) => {
    try {
      await axios.patch(`http://localhost:5000/signaler/${id}`, { isRead }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchSignals();  // Refresh the list to reflect the updated isRead status
    } catch (error) {
      console.error('Error updating signal status:', error);
    }
  };

  const blockUser = async (userId) => {
    try {
      await axios.put(`http://localhost:5000/block/${userId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Swal.fire('Success', 'User has been blocked.', 'success');
    } catch (error) {
      console.error('Error blocking user:', error);
      Swal.fire('Error', 'Failed to block user.', 'error');
    }
  };

  const handleBlockUser = async (signal) => {
    if (signal.id_reponse) {
      const replyData = await axios.get(`http://localhost:5000/replies/${signal.id_reponse}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      blockUser(replyData.data.utilisateur.id_utilisateur);
    } else if (signal.id_cmntr) {
      const commentData = await axios.get(`http://localhost:5000/comment/${signal.id_cmntr}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      blockUser(commentData.data.utilisateur.id_utilisateur);
    } else {
      blockUser(signal.post.utilisateur.id_utilisateur);
    }
  };

  const handleDeleteContent = async (signal) => {
    try {
      if (signal.id_reponse) {
        await axios.delete(`http://localhost:5000/response/${signal.id_reponse}/admin`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else if (signal.id_cmntr) {
        await axios.delete(`http://localhost:5000/comment/${signal.id_cmntr}/admin`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.delete(`http://localhost:5000/post/${signal.id_post}/admin`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      Swal.fire('Success', 'Content has been deleted.', 'success');
      fetchSignals(); // Refresh the list after deletion
    } catch (error) {
      console.error('Error deleting content:', error);
      Swal.fire('Error', 'Failed to delete content.', 'error');
    }
  };

  const handleViewOriginalPost = (signal) => {
    setSelectedPostId(signal.id_post);
    setIsPostModalOpenD(true);
};


  return (
    <>
    <NavAdmin />
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        Reported Content Management
      </Typography>
      {signals.length > 0 ? (
        signals.map((signal, index) => (
          <Card key={`${signal.id_signaler}-${index}`} sx={{ mb: 2, backgroundColor: signal.isRead ? '#F4F4F4' : '#FFFFFF' }}>
            <CardContent>
              <Typography variant="body1">
                Reported by: <Link component={NavLink} to={`/profil/${signal.utilisateur.id_utilisateur}`} underline="hover">
                  {signal.utilisateur.prenom} {signal.utilisateur.nom}
                </Link>
              </Typography>
              <Typography variant="body2">
                Type: {signal.id_reponse ? 'Response' : signal.id_cmntr ? 'Comment' : 'Post'}
              </Typography>
            </CardContent>
            <CardActions>
              <Button variant="outlined" onClick={() => openPostModal(signal)}>
                View Content
              </Button>
              <Button variant="outlined" onClick={() => handleBlockUser(signal)}>
                Block User
              </Button>
              <Button variant="outlined" onClick={() => handleDeleteContent(signal)} color="error">
                Delete Content
              </Button>
              <Button onClick={() => handleViewOriginalPost(signal)} color="primary">
                Voir Original Post
              </Button>
              {!signal.isRead ? null : (
                <Button variant="outlined" onClick={() => updateSignalStatus(signal.id_signaler, false)} color="primary">
                  Mark as Unread
                </Button>
              )}
            </CardActions>
          </Card>
        ))
      ) : (
        <Typography>No reports to show.</Typography>
      )}
      {isPostModalOpen && (
        <DetailPostModal
          isOpen={isPostModalOpen}
          onRequestClose={() => setIsPostModalOpen(false)}
          postId={selectedPostId}
          commentId={selectedCommentId}
          responseId={selectedResponseId}
        />
      )}
          <PostModal
                isOpen={isPostModalOpenD}
                onRequestClose={() => setIsPostModalOpenD(false)}
                postId={selectedPostId}
            />
    </Container>
    </>
  );
};

export default AdminSignalsPage;
