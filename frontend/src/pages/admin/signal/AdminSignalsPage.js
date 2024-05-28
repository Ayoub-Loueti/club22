import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import {
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Link,
  Avatar,
} from '@mui/material';
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
      // Trier les données: non lus en premier
      const sortedSignals = response.data.sort((a, b) => a.isRead - b.isRead);
      setSignals(sortedSignals);
    } catch (error) {
      console.error('Erreur lors de la récupération des signalements:', error);
      Swal.fire(
        'Erreur',
        'Échec de la récupération des signalements.',
        'error'
      );
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
      await axios.patch(
        `http://localhost:5000/signaler/${id}`,
        { isRead },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Mise à jour de l'état local des signaux après modification du statut
      setSignals((prevSignals) => {
        return prevSignals
          .map((signal) =>
            signal.id_signaler === id ? { ...signal, isRead: isRead } : signal
          )
          .sort((a, b) => a.isRead - b.isRead); // Assurer que les non lus sont toujours en haut
      });
    } catch (error) {
      console.error(
        'Erreur lors de la mise à jour du statut du signalement:',
        error
      );
    }
  };

  const blockUser = async (userId) => {
    try {
      await axios.put(
        `http://localhost:5000/block/${userId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      Swal.fire(
        'Succès',
        "L'auteur du contenu signalé a été bloqué.",
        'success'
      );
    } catch (error) {
      console.error(
        "Erreur lors du blocage de L'auteur du contenu signalé :",
        error
      );
      Swal.fire(
        'Erreur',
        "Impossible de bloquer L'auteur du contenu signalé.",
        'error'
      );
    }
  };

  const handleBlockUser = async (signal) => {
    if (signal.id_reponse) {
      const replyData = await axios.get(
        `http://localhost:5000/replies/${signal.id_reponse}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      blockUser(replyData.data.utilisateur.id_utilisateur);
    } else if (signal.id_cmntr) {
      const commentData = await axios.get(
        `http://localhost:5000/comment/${signal.id_cmntr}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      blockUser(commentData.data.utilisateur.id_utilisateur);
    } else {
      blockUser(signal.post.utilisateur.id_utilisateur);
    }
  };
  // Fonction pour demander confirmation avant de bloquer un utilisateur
  const confirmBlockUser = async (signal) => {
    Swal.fire({
      title: `Êtes-vous sûr de vouloir bloquer L'auteur du contenu signalé  ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, bloquez-le!',
    }).then((result) => {
      if (result.isConfirmed) {
        handleBlockUser(signal);
      }
    });
  };

  const handleDeleteContent = async (signal) => {
    try {
      if (signal.id_reponse) {
        await axios.delete(
          `http://localhost:5000/response/${signal.id_reponse}/admin`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else if (signal.id_cmntr) {
        await axios.delete(
          `http://localhost:5000/comment/${signal.id_cmntr}/admin`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        await axios.delete(
          `http://localhost:5000/post/${signal.id_post}/admin`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }
      Swal.fire('Succès', 'Le contenu a été supprimé.', 'success');
      fetchSignals(); // Refresh the list after deletion
    } catch (error) {
      console.error('Erreur lors de la suppression du contenu :', error);
      Swal.fire('Erreur', 'Échec de la suppression du contenu.', 'error');
    }
  };
  const confirmDelete = async (signal) => {
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: 'Vous ne pourrez pas revenir en arrière!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimez-le!',
    }).then((result) => {
      if (result.isConfirmed) {
        handleDeleteContent(signal);
      }
    });
  };

  const handleViewOriginalPost = (signal) => {
    setSelectedPostId(signal.id_post);
    setIsPostModalOpenD(true);
  };

  const buttonStyles = {
    viewContent: {
      backgroundColor: '#003366', // Dark Blue
      color: 'white',
      padding: '4px 10px', // Reduced padding
      fontSize: '0.75rem', // Reduced font size
      '&:hover': {
        backgroundColor: '#002244', // Darker shade on hover
      },
    },
    viewOriginalPost: {
      backgroundColor: '#DAA520', // Muted Gold
      color: 'white',
      padding: '4px 10px',
      fontSize: '0.75rem',
      '&:hover': {
        backgroundColor: '#B8860B', // Darker Gold on hover
      },
    },
    deleteContent: {
      backgroundColor: '#CD5C5C', // Soft Red
      color: 'white',
      padding: '4px 10px',
      fontSize: '0.75rem',
      '&:hover': {
        backgroundColor: '#B22222', // Darker Red on hover
      },
    },
    blockUser: {
      backgroundColor: '#FFB6C1', // Soft Pink
      color: 'white',
      padding: '4px 10px',
      fontSize: '0.75rem',
      '&:hover': {
        backgroundColor: '#FFC0CB', // Darker Pink on hover
      },
    },
    markAsUnread: {
      backgroundColor: '#FF7F50', // Light Coral
      color: 'white',
      padding: '4px 10px',
      fontSize: '0.75rem',
      '&:hover': {
        backgroundColor: '#FF6347', // Darker Coral on hover
      },
    },
  };
const confirmBlockSignalant = async (signal) => {
  Swal.fire({
    title: 'Êtes-vous sûr?',
    text: "Vous êtes sur le point de bloquer l'utilisateur qui a effectué ce signalement.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Oui, bloquez-le!',
  }).then((result) => {
    if (result.isConfirmed) {
      blockSignalant(signal.id_utilisateur);
    }
  });
};const blockSignalant = async (userId) => {
  try {
    await axios.put(
      `http://localhost:5000/block/${userId}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    Swal.fire('Bloqué!', 'Le signalant a été bloqué avec succès.', 'success');
    fetchSignals(); // Refresh the list to reflect the change
  } catch (error) {
    console.error('Erreur lors du blocage du signalant:', error);
    Swal.fire('Erreur', 'Impossible de bloquer le signalant.', 'error');
  }
}; 

const confirmBlockReporting = async (userId) => {
  const { value: days } = await Swal.fire({
    title: 'Nombre de jours de blocage',
    input: 'number',
    inputPlaceholder: 'Entrez le nombre de jours',
    confirmButtonText: 'Bloquer',
    cancelButtonText: 'Annuler',
    showCancelButton: true,
  });

  if (days) {
    try {
      await axios.put(
        `http://localhost:5000/block-reporting/${userId}`,
        { days },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Swal.fire(
        'Bloqué!',
        `L'utilisateur est bloqué de faire des signalements pour ${days} jours.`,
        'success'
      );
    } catch (error) {
      console.error('Erreur lors du blocage du signalant:', error);
      Swal.fire('Erreur', 'Impossible de bloquer le signalant.', 'error');
    }
  }
};
  return (
    <>
      <NavAdmin />
      <div   style={{
          background: 'linear-gradient(to right, #91EAE4, #86A8E7, #7F7FD5)',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        }}>
      <Container maxWidth="md">
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          style={{
            color: '#191f43',
            marginBottom: '50px',
            marginTop: '50px',
          }}
        >
          GESTION DES CONTENUS SIGNALÉS{' '}
        </Typography>

        {signals.length > 0 ? (
          signals.map((signal, index) => (
            <Card
              key={`${signal.id_signaler}-${index}`}
              sx={{
                mb: 4, // Increased bottom margin for more space between cards
                padding: '28px', // Increased padding inside the card for a larger appearance
                boxShadow: '0 14px 18px rgba(0,0,0,0.1)', // Optional: adding a subtle shadow for depth
                '&:hover': {
                  boxShadow: '0 18px 16px rgba(0,0,0,0.2)', // Deeper shadow on hover for a dynamic effect
                },
                backgroundColor: signal.isRead ? '#F8F8F8' : '#D6D6D6', // Keeping your color scheme
                maxWidth: 'none',
                width: '100%',
              }}
            >
              <CardContent>
                <Typography variant="button">
                  <Typography
                    display="flex"
                    alignItems="center"
                    gap={2}
                    marginBottom={2}
                    component="div"
                  >
                    Signalé par:{' '}
                    <Link
                      color="#6b85a4"
                      component={NavLink}
                      to={`/profil/${signal.utilisateur.id_utilisateur}`}
                      underline="hover"
                      style={{ display: 'flex', alignItems: 'center' }}
                    >
                      <Avatar
                        src={
                          signal.utilisateur.photo
                            ? `http://localhost:5000/${signal.utilisateur.photo}`
                            : 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'
                        }
                        alt={signal.utilisateur.prenom}
                        sx={{ width: 38, height: 38 }}
                      />
                      <Typography
                        variant="body1"
                        sx={{ marginLeft: 1 }}
                        color="#6b85a4"
                        underline="hover"
                        component="span"
                      >
                        {' '}
                        {signal.utilisateur.prenom} {signal.utilisateur.nom}
                      </Typography>{' '}
                    </Link>{' '}
                    <Button
                      variant="contained"
                      sx={buttonStyles.blockUser}
                      onClick={() => confirmBlockSignalant(signal)}
                    >
                      Bloquer le signalant
                    </Button>
                    <Button
                      variant="contained"
                      sx={buttonStyles.blockUser}
                      onClick={() =>
                        confirmBlockReporting(signal.utilisateur.id_utilisateur)
                      }
                    >
                      Bloquer les signalements
                    </Button>
                  </Typography>
                </Typography>
                <Typography variant="body2">
                  TYPE DE CONTENU :{' '}
                  {signal.id_reponse
                    ? 'Response'
                    : signal.id_cmntr
                    ? 'Comment'
                    : 'Post'}
                </Typography>
                <Typography variant="body2" color="error">
                  Raison: {signal.cause}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  sx={buttonStyles.viewContent}
                  onClick={() => openPostModal(signal)}
                >
                  Voir le contenu
                </Button>
                <Button
                  onClick={() => handleViewOriginalPost(signal)}
                  sx={buttonStyles.viewOriginalPost}
                >
                  Voir post
                </Button>

                <Button
                  variant="contained"
                  sx={buttonStyles.deleteContent}
                  onClick={() => confirmDelete(signal)}
                >
                  Supprimer le contenu
                </Button>
                <Button
                  variant="contained"
                  sx={buttonStyles.blockUser}
                  onClick={() => confirmBlockUser(signal)}
                >
                  Bloquer L'auteur du contenu signalé
                </Button>
                {!signal.isRead ? null : (
                  <Button
                    variant="outlined"
                    sx={buttonStyles.markAsUnread}
                    onClick={() =>
                      updateSignalStatus(signal.id_signaler, false)
                    }
                  >
                    Marquer comme non lu
                  </Button>
                )}
              </CardActions>
            </Card>
          ))
        ) : (
          <Typography>Aucun signalement à afficher.</Typography>
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
      </Container></div>
    </>
  );
};

export default AdminSignalsPage;
