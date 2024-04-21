import React, { useState, useEffect } from 'react';
import './post.css';
import CommentIcon from '../../img/comment.png';
import ShareIcon from '../../img/share.png';
import HeartIcon from '../../img/like.png';
import NotLikeIcon from '../../img/notlike.png';
import axios from 'axios';
import CommentForm from '../comments/commentForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSave,
  faBookmark,
  faPen,
  faTrash,
  faHeart,
  faComment,
  faFlag,
  faEllipsisV,
} from '@fortawesome/free-solid-svg-icons';
import { faBookmark as farBookmark } from '@fortawesome/free-regular-svg-icons'; // Importing the regular (outline) bookmark icon

import Swal from 'sweetalert2';
import { NavLink } from 'react-router-dom';
import LikesModal from '../likesModal/likesModal';
const Post = (props) => {
  const { data, onPostDeleted, onPostUpdated, isModalView, openModalForPost } =
    props;

  const token = JSON.parse(localStorage.getItem('login'))?.token;
  const [liked, setLiked] = useState(data.isLikedByCurrentUser);
  const [comLiked, setComLiked] = useState(data.isComLikedByCurrentUser);
  const [repLiked, setRepLiked] = useState(data.isRepLikedByCurrentUser);
  const [likes, setLikes] = useState(data.likesCount || 0);
  const [userInfo, setUserInfo] = useState(null);
  const [userId, setUserId] = useState(null);
  const [comments, setComments] = useState([]);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(data.contenu);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentContent, setEditCommentContent] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPostSaved, setIsPostSaved] = useState(false);
  const [editingResponseId, setEditingResponseId] = useState(null);
  const [editedContent, setEditedContent] = useState('');
  const [responseContent, setResponseContent] = useState('');
  const [commentIdToRespondTo, setCommentIdToRespondTo] = useState(null);
  const [showReplyInputForCommentId, setShowReplyInputForCommentId] =
    useState(null);
  const [visibleReplies, setVisibleReplies] = useState({});
  const [likesModalVisible, setLikesModalVisible] = useState(false);
  const [likesData, setLikesData] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('login');
    const storedUserId = JSON.parse(localStorage.getItem('userId'));
    setUserId(storedUserId);

    if (token && storedUserId) {
      const fetchUserData = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/profil/${storedUserId}`,
            {
              headers: {
                Authorization: `Bearer ${JSON.parse(token).token}`,
              },
            }
          );
          setUserInfo(response.data.user);
        } catch (error) {
          console.error(
            "Erreur lors de la récupération des données de l'utilisateur",
            error
          );
        }
      };
      fetchUserData();
    }
  }, []);

  useEffect(() => {
    const fetchLikesCount = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/post/${data.id_post}/likesCount`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setLikes(response.data.likesCount);
      } catch (error) {
        console.error("Error fetching post's likes count:", error);
      }
    };

    fetchLikesCount();
  }, [liked]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/post/${data.id_post}/comment`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setComments(response.data.comments);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments();
  }, []);

  useEffect(() => {
    // Assuming this endpoint checks if a post is saved and returns { isSaved: true/false }
    const checkIfPostIsSaved = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/posts/${data.id_post}/is-saved`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setIsPostSaved(response.data.isSaved);
      } catch (error) {
        console.error('Error checking if post is saved:', error);
      }
    };
    checkIfPostIsSaved();
  }, [data.id_post, token]);

  const handleLike = async () => {
    const newLikedStatus = !liked;
    try {
      await axios.post(
        `http://localhost:5000/post/${data.id_post}/toggle-like`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setLiked(newLikedStatus);

      // Mettre à jour le nombre de likes est correct, mais nous devons aussi mettre à jour la liste des likes
      if (newLikedStatus) {
        // Ajouter l'utilisateur actuel à la liste des likes si le post est liké
        const newUserLike = {
          utilisateur: {
            id_utilisateur: userId, // Assurez-vous que userId est défini correctement dans votre état
            nom: userInfo.nom,
            prenom: userInfo.prenom,
            photo: userInfo.photo,
          },
        };
        onPostUpdated({ ...data, likes: [...data.likes, newUserLike] });
      } else {
        // Retirer l'utilisateur actuel de la liste des likes si le post est unliké
        const filteredLikes = data.likes.filter(
          (like) => like.utilisateur.id_utilisateur !== userId
        );
        onPostUpdated({ ...data, likes: filteredLikes });
      }
      setLikes((prev) => prev + (newLikedStatus ? 1 : -1));
    } catch (error) {
      console.error("Error toggling the post's like", error);
    }
  };

  const toggleCommentForm = () => {
    setShowCommentForm(!showCommentForm);
  };
  const handleDeletePost = () => {
    // Demande de confirmation à l'utilisateur
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
        // L'utilisateur a confirmé la suppression, appelez deletePost
        deletePost();
      }
      // Sinon, si l'utilisateur annule, rien ne se passe
    });
  };

  // Fonction asynchrone séparée pour effectuer la suppression
  // Dans Post.js, remplacez window.location.reload(); par une fonction de rappel
  const deletePost = async () => {
    try {
      await axios.delete(`http://localhost:5000/posts/${data.id_post}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Swal.fire('Supprimé!', 'Votre post a été supprimé.', 'success');
      props.onPostDeleted(data.id_post);
    } catch (error) {
      console.error('Error deleting the post:', error);
      Swal.fire(
        'Erreur!',
        'Une erreur est survenue lors de la suppression du post.',
        'error'
      );
    }
  };

  const toggleEditForm = () => {
    setIsEditing(!isEditing);
  };
  const handleSaveEdit = async () => {
    if (editContent !== data.contenu) {
      try {
        const response = await axios.put(
          `http://localhost:5000/posts/${data.id_post}`,
          { contenu: editContent },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log(response.data);
        setIsEditing(false);

        // Appeler onPostUpdated avec les nouvelles données du post
        onPostUpdated({ ...data, contenu: editContent }); // Mettre à jour avec les changements
      } catch (error) {
        console.error('Error updating the post:', error);
      }
    } else {
      setIsEditing(false);
      console.log('Aucune modification détectée, enregistrement annulé.');
    }
  };

  const handleDeleteComment = async (commentId) => {
    // Afficher la boîte de dialogue de confirmation SweetAlert
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: 'Vous ne pourrez pas revenir en arrière!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimez-le!',
      cancelButtonText: 'Annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        // L'utilisateur a confirmé la suppression
        performCommentDeletion(commentId);
      }
    });
  };

  // Extraire la logique de suppression dans une fonction séparée
  const performCommentDeletion = async (commentId) => {
    try {
      await axios.delete(`http://localhost:5000/deleteComment/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Notifier l'utilisateur de la suppression réussie
      Swal.fire('Supprimé!', 'Votre commentaire a été supprimé.', 'success');
      // Optionnellement rafraîchir la liste des commentaires ou retirer le commentaire supprimé de l'état
      // Par exemple, vous pouvez filtrer le commentaire supprimé de la manière suivante :
      setComments((prevComments) =>
        prevComments.filter((comment) => comment.id_cmntr !== commentId)
      );
    } catch (error) {
      console.error('Erreur lors de la suppression du commentaire :', error);
      Swal.fire(
        'Erreur!',
        "Une erreur s'est produite lors de la suppression du commentaire.",
        'error'
      );
    }
  };

  const handleEditComment = (commentId, currentContent) => {
    setEditingCommentId(commentId);
    setEditCommentContent(currentContent);
  };

  const handleSaveEditComment = async () => {
    if (editCommentContent && editingCommentId) {
      try {
        await axios.put(
          `http://localhost:5000/modifyComment/${editingCommentId}`,
          { newContent: editCommentContent },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        // Mise à jour de l'état local après la mise à jour réussie
        setComments((currentComments) =>
          currentComments.map((comment) =>
            comment.id_cmntr === editingCommentId
              ? { ...comment, cmntr: editCommentContent }
              : comment
          )
        );
        setEditingCommentId(null);
        setEditCommentContent('');
      } catch (error) {
        console.error('Error updating the comment:', error);
        // Gestion de l'erreur
      }
    }
  };

  const showNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === data.lesImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const showPreviousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? data.lesImages.length - 1 : prevIndex - 1
    );
  };

  const reloadComments = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/post/${data.id_post}/comment`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setComments(response.data.comments);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const [isLikesModalOpen, setIsLikesModalOpen] = useState(false);
  const showLikesModal = () => {
    setIsLikesModalOpen(true);
  };

  const handleToggleSave = async () => {
    try {
      if (isPostSaved) {
        // Unsave post
        await axios.delete(
          `http://localhost:5000/posts/${data.id_post}/enregistrement`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIsPostSaved(false);
        Swal.fire(
          'Supprimée !',
          'La publication a été supprimée des publications enregistrées.',
          'success'
        );
      } else {
        // Save post
        await axios.post(
          `http://localhost:5000/posts/${data.id_post}/enregistrement`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIsPostSaved(true);
        Swal.fire(
          'Enregistrée !',
          'La publication a été enregistrée.',
          'success'
        );
      }
    } catch (error) {
      console.error(
        "Erreur lors de la bascule de l'enregistrement de la publication :",
        error
      );
      Swal.fire(
        'Erreur !',
        "Il y a eu un problème lors de l'enregistrement ou de la désenregistrement de la publication.",
        'error'
      );
    }
  };
  // Fonction pour mettre en majuscule le premier caractère d'une chaîne
  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // Dans votre composant React, utilisez cette fonction pour formater les noms d'utilisateur
  <span className="userName">
    <NavLink
      to={`/profil/${data.utilisateur.id_utilisateur}`}
      className="userLink"
    >
      {`${capitalizeFirstLetter(
        data.utilisateur.prenom
      )} ${capitalizeFirstLetter(data.utilisateur.nom)}`}
    </NavLink>
  </span>;

  const toggleLikeComment = async (commentId) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/comment/${commentId}/toggle-like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      reloadComments();
    } catch (error) {
      console.error('Error toggling like for comment:', error);
    }
  };

  const toggleLikeResponse = async (commentId, responseId) => {
    try {
      // Toggle the like status in the backend
      await axios.post(
        `http://localhost:5000/reponse/${responseId}/toggle-like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Fetch the updated likes count for the response
      const likesCountResponse = await axios.get(
        `http://localhost:5000/reponse/${responseId}/likesCount`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update the state to reflect the change in the frontend
      setComments(
        comments.map((comment) => {
          if (comment.id_cmntr === commentId) {
            return {
              ...comment,
              reponses: comment.reponses.map((response) => {
                if (response.id_reponse === responseId) {
                  return {
                    ...response,
                    // Toggle based on the assumption the backend toggles the like status correctly
                    isRepLikedByCurrentUser: !response.isRepLikedByCurrentUser,
                    // Update with the new likes count fetched from the backend
                    nbr_likeRep: likesCountResponse.data.likesCount,
                  };
                }
                return response;
              }),
            };
          }
          return comment;
        })
      );
    } catch (error) {
      console.error('Error toggling like on response:', error);
    }
  };

  const startEditing = (response) => {
    setEditingResponseId(response.id_reponse);
    setEditedContent(response.contenu);
  };

  // Function to save the edited response
  const saveEditedResponse = async (responseId) => {
    // Ensure that there is content to save
    if (!editedContent.trim()) return;

    try {
      // Retrieve the token
      const token = JSON.parse(localStorage.getItem('login'))?.token;
      if (!token) {
        console.error('Authentication token is not available.');
        // You might want to handle the redirection to the login page here
        return;
      }

      // Make the PUT request to the server with the edited content
      const response = await axios.put(
        `http://localhost:5000/replies/${responseId}`, // Ensure this is the correct endpoint for updating a response
        { contenu: editedContent }, // Make sure to send the updated content in the format expected by the server
        { headers: { Authorization: `Bearer ${token}` } } // Include the Authorization header with the token
      );
      setComments(
        comments.map((comment) => {
          return {
            ...comment,
            reponses: comment.reponses.map((response) => {
              if (response.id_reponse === responseId) {
                return { ...response, contenu: editedContent };
              }
              return response;
            }),
          };
        })
      );
      // If the server responds without errors, update the state accordingly
      console.log(response.data);
      setEditingResponseId(null);
      setEditedContent('');
    } catch (error) {
      console.error('Error updating the response:', error.response || error);
      // If there's an error response from the server, you might want to handle it here
    }
  };

  const handleResponseSubmit = async (e, commentId) => {
    e.preventDefault(); // Prevent the default form submission behavior
    try {
      const response = await axios.post(
        `http://localhost:5000/comments/${commentId}/responses`,
        { contenu: responseContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResponseContent(''); // Clear the response input field
      setCommentIdToRespondTo(null); // Reset the comment ID being responded to
      reloadComments(); // Reload comments to include the new response
    } catch (error) {
      console.error('Error submitting the response:', error);
      // Handle submission error (e.g., show an error message to the user)
    }
  };

  const handleDeleteResponse = async (responseId) => {
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: 'Vous ne pourrez pas revenir en arrière!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimez-le!',
      cancelButtonText: 'Annuler',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = JSON.parse(localStorage.getItem('login'))?.token;
          await axios.delete(`http://localhost:5000/replies/${responseId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          // Update comments state to remove the deleted reply
          setComments(
            comments.map((comment) => ({
              ...comment,
              reponses: comment.reponses.filter(
                (response) => response.id_reponse !== responseId
              ),
            }))
          );

          Swal.fire('Supprimé!', 'Votre réponse a été supprimée.', 'success');
        } catch (error) {
          console.error('Error deleting the response:', error);
          Swal.fire(
            'Échec!',
            'Un problème est survenu lors de la suppression de votre réponse.',
            'error'
          );
        }
      }
    });
  };

  const toggleReplyInput = (commentId) => {
    if (showReplyInputForCommentId === commentId) {
      setShowReplyInputForCommentId(null); // Hide if already visible
    } else {
      setShowReplyInputForCommentId(commentId); // Show if not visible
    }
  };

  const toggleRepliesVisibility = (commentId) => {
    setVisibleReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const fetchLikesAndOpenModal = async (id, type) => {
    // Endpoint selection based on type (comment or response)
    const endpoint =
      type === 'comment'
        ? `/comment/${id}/afficherLikes`
        : `/reponse/${id}/afficherLikes`;

    try {
      const response = await axios.get(`http://localhost:5000${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` }, // Assuming 'token' is defined in your component's scope
      });
      setLikesData(response.data.likes); // Update the state with the fetched likes
      setLikesModalVisible(true); // Open the modal
    } catch (error) {
      console.error('Error fetching likes:', error);
    }
  };

  const commentsToShow = isModalView ? comments : comments.slice(0, 2);

  const handleReportPost = async () => {
    const { value: result } = await Swal.fire({
      title: 'Êtes-vous sûr?',
      text: 'Voulez-vous vraiment signaler ce post?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, signaler!',
      cancelButtonText: 'Annuler',
    });
  
    if (result) {
      try {
        const response = await axios.post(
          `http://localhost:5000/signals`, // Verify the correct API endpoint
          { id_post: data.id_post, id_cmntr: 0, id_reponse: 0 },
          { headers: { Authorization: `Bearer ${token}` } }
        );
  
        Swal.fire('Signalé!', 'Le post a été signalé avec succès.', 'success');
      } catch (error) {
        if (error.response && error.response.status === 409) {
          Swal.fire('Attention!', 'Ce post a déjà été signalé.', 'warning');
        } else {
          console.error('Error reporting the post:', error);
          Swal.fire('Échec!', 'Problème lors du signalement du post.', 'error');
        }
      }
    }
  };  

  const handleReportComment = async (commentId) => {
    const { value: result } = await Swal.fire({
      title: 'Êtes-vous sûr?',
      text: 'Voulez-vous vraiment signaler ce commentaire?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, signaler!',
      cancelButtonText: 'Annuler',
    });
  
    if (result) {
      try {
        const response = await axios.post(
          `http://localhost:5000/signals`,
          { id_post: data.id_post, id_cmntr: commentId, id_reponse: 0 },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        Swal.fire('Signalé!', 'Le commentaire a été signalé avec succès.', 'success');
      } catch (error) {
        if (error.response && error.response.status === 409) {
          Swal.fire('Attention!', 'Ce commentaire a déjà été signalé.', 'warning');
        } else {
          console.error('Error reporting the comment:', error);
          Swal.fire('Échec!', 'Problème lors du signalement du commentaire.', 'error');
        }
      }
    }
  };  

  const handleReportResponse = async (commentId, responseId) => {
    const { value: result } = await Swal.fire({
      title: 'Êtes-vous sûr?',
      text: 'Voulez-vous vraiment signaler cette réponse?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, signaler!',
      cancelButtonText: 'Annuler',
    });
  
    if (result) {
      try {
        const response = await axios.post(
          `http://localhost:5000/signals`,
          { id_post: data.id_post, id_cmntr: commentId, id_reponse: responseId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        Swal.fire('Signalé!', 'La réponse a été signalée avec succès.', 'success');
      } catch (error) {
        if (error.response && error.response.status === 409) {
          Swal.fire('Attention!', 'Cette réponse a déjà été signalée.', 'warning');
        } else {
          console.error('Error reporting the response:', error);
          Swal.fire('Échec!', 'Problème lors du signalement de la réponse.', 'error');
        }
      }
    }
  };  

  return (
    <div className="Post">
      <div className="postHeader">
        <div className="userDetails">
          <img
            src={
              data.utilisateur.photo
                ? `http://localhost:5000/${data.utilisateur.photo}`
                : 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'
            }
            alt="Profil"
            className="userPhoto"
          />
          <span className="userName">
            <NavLink
              to={`/profil/${data.utilisateur.id_utilisateur}`}
              className="userLink"
            >
              {`${capitalizeFirstLetter(
                data.utilisateur.prenom
              )} ${capitalizeFirstLetter(data.utilisateur.nom)}`}
            </NavLink>
          </span>{' '}
        </div>
        {userInfo &&
          data.utilisateur.id_utilisateur.toString() === userId.toString() && (
            <div className="postManagementButtons">
              {!isEditing ? (
                <>
                  <button onClick={toggleEditForm} className="iconButton">
                    <FontAwesomeIcon icon={faPen} />
                  </button>
                  <button onClick={handleDeletePost} className="iconButton">
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </>
              ) : (
                <button onClick={handleSaveEdit} className="iconButton">
                  <FontAwesomeIcon icon={faSave} />
                </button>
              )}
            </div>
          )}
        <button
          className="iconButton"
          style={{ marginLeft: isEditing ? '0px' : 'auto' }}
          onClick={handleToggleSave}
        >
          <FontAwesomeIcon icon={isPostSaved ? faBookmark : farBookmark} />
        </button>
        {userInfo &&
          data.utilisateur.id_utilisateur.toString() != userId.toString() && (
            <button onClick={handleReportPost} className="iconButton">
              <FontAwesomeIcon icon={faFlag} />
            </button>
          )}
      </div>
      <div className="postContent">
        {!isEditing ? (
          <span>{data.contenu}</span>
        ) : (
          <textarea
            className="editContent"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
          />
        )}
        {userInfo &&
          userInfo.type === 'employe' &&
          data.lesCollab.length > 0 && (
            <div className="lesCollab">
              <p>Les cordonnees du collaborateur : </p>
              {data.lesCollab && data.lesCollab.length > 0 && (
                <div className="postOffers">
                  {data.lesCollab.map((mention, index) => (
                    <div key={index} className="postOffer">
                      <hr></hr>
                      <strong>Collaborateur:</strong>{' '}
                      {mention.offre.collaborateur.nom}
                      {mention.offre && (
                        <>
                          <p>
                            <strong>Offre:</strong> {mention.offre.titre}
                          </p>
                          <NavLink
                            to={`/OffrePageDetails/${mention.offre.id_offre}`}
                          >
                            Voir l'offre
                          </NavLink>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
      </div>
      <div className="postImages">
        {data.lesImages && data.lesImages.length > 0 && (
          <>
            <button onClick={showPreviousImage} className="navigationButton">
              &#9664; {/* Left arrow */}
            </button>

            {/* Check the file extension to determine whether to render an image or a video */}
            {data.lesImages[currentImageIndex].pathImage.endsWith('.mp4') ? (
              <video controls className="postImage">
                <source
                  src={`http://localhost:5000/${data.lesImages[currentImageIndex].pathImage}`}
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            ) : (
              <img
                src={`http://localhost:5000/${data.lesImages[currentImageIndex].pathImage}`}
                alt="Post"
                className="postImage"
              />
            )}

            <button onClick={showNextImage} className="navigationButton">
              &#9654; {/* Right arrow */}
            </button>
          </>
        )}
      </div>
      <div className="postReact">
        <img
          src={liked ? HeartIcon : NotLikeIcon}
          alt="like"
          className="reactionIcon"
          onClick={handleLike}
        />
        <img
          src={CommentIcon}
          alt="comment"
          className="reactionIcon"
          onClick={toggleCommentForm}
        />
        <img src={ShareIcon} alt="share" className="reactionIcon" />
      </div>
      <div className="likesCount">
        <span onClick={showLikesModal} title="Voir qui a aimé ce post">
          {likes} J'aime
        </span>
      </div>

      <LikesModal
        isOpen={isLikesModalOpen}
        onRequestClose={() => setIsLikesModalOpen(false)}
        likes={data.likes}
      />
      <LikesModal
        isOpen={likesModalVisible}
        onRequestClose={() => setLikesModalVisible(false)}
        likes={likesData}
      />
      {showCommentForm && (
        <CommentForm
          postId={data.id_post}
          onCommentSubmitted={reloadComments}
        />
      )}

      <div className="comments">
        {commentsToShow.map((comment, index) => (
          <div key={index} className="comment">
            <img
              src={
                comment.utilisateur.photo
                  ? `http://localhost:5000/${comment.utilisateur.photo}`
                  : 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'
              }
              alt="Profile"
              className="commentUserPhoto"
            />
            <div className="commentDetails">
              <span className="userNameComment">
                <NavLink
                  to={`/profil/${comment.utilisateur.id_utilisateur}`}
                  className="userNameLink"
                >
                  <span>{`${capitalizeFirstLetter(
                    comment.utilisateur.prenom
                  )} ${capitalizeFirstLetter(comment.utilisateur.nom)}`}</span>
                </NavLink>
              </span>

              <div>
                {editingCommentId === comment.id_cmntr ? (
                  <textarea
                    className="commentEdit"
                    value={editCommentContent}
                    onChange={(e) => setEditCommentContent(e.target.value)}
                  />
                ) : (
                  <div className="commentContent">
                    <p className="commentText">{comment.cmntr}</p>
                  </div>
                )}
              </div>
              <div className="commentActionsContainer">
                <div className="likesCountReact">
                  <span
                    onClick={() => toggleLikeComment(comment.id_cmntr)}
                    style={{ cursor: 'pointer' }}
                  >
                    {comment.isComLikedByCurrentUser ? (
                      <FontAwesomeIcon
                        icon={faHeart}
                        className="heartIconlove"
                      />
                    ) : (
                      <FontAwesomeIcon
                        icon={faHeart}
                        className="heartIconUnliked"
                      />
                    )}
                  </span>
                  <span
                    onClick={() =>
                      fetchLikesAndOpenModal(comment.id_cmntr, 'comment')
                    }
                  >
                    {''} {comment.nbr_likeCom} J'aime
                  </span>
                  <button
                    onClick={() => toggleReplyInput(comment.id_cmntr)}
                    className="commentIcon"
                  >
                    <FontAwesomeIcon icon={faComment} />
                  </button>
                  {comment.utilisateur.id_utilisateur.toString() !=
                    userId.toString() && (
                    <FontAwesomeIcon
                      icon={faFlag}
                      className="reportCommentIcon"
                      onClick={() => handleReportComment(comment.id_cmntr)}
                    />
                  )}
                </div>
                <div className="commentActionButtons">
                  {comment.utilisateur.id_utilisateur.toString() ===
                    userId.toString() &&
                    (editingCommentId === comment.id_cmntr ? (
                      <button
                        onClick={handleSaveEditComment}
                        className="iconButton"
                      >
                        <FontAwesomeIcon icon={faSave} />
                      </button>
                    ) : (
                      <div className="commentActions">
                        <button
                          className="iconButton"
                          onClick={() =>
                            handleEditComment(comment.id_cmntr, comment.cmntr)
                          }
                        >
                          <FontAwesomeIcon icon={faPen} />
                        </button>
                        <button
                          className="iconButton"
                          onClick={() => handleDeleteComment(comment.id_cmntr)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    ))}
                </div>
              </div>

              {commentIdToRespondTo === comment.id_cmntr && (
                <form
                  onSubmit={(e) => handleResponseSubmit(e, comment.id_cmntr)}
                  className="responseForm"
                >
                  <input
                    type="text"
                    value={responseContent}
                    onChange={(e) => setResponseContent(e.target.value)}
                    placeholder="Write a response..."
                    className="responseInput"
                    required
                  />
                  <button type="submit" className="responseSubmitButton">
                    Reply
                  </button>
                </form>
              )}

              {showReplyInputForCommentId === comment.id_cmntr && (
                <form
                  onSubmit={(e) => handleResponseSubmit(e, comment.id_cmntr)}
                  className="commentInput"
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      position: 'relative',
                      marginLeft: '20px',
                      marginBottom: '15px',
                      marginTop: '10px',
                    }}
                  >
                    <input
                      type="text"
                      value={responseContent}
                      onChange={(e) => setResponseContent(e.target.value)}
                      placeholder="Écrire une réponse..."
                      className="commentContent"
                      style={{
                        width: '50%',
                        minHeight: '30px',
                        marginRight: '10px',
                      }}
                      required
                    />
                    <button
                      type="submit"
                      className="postShare-button"
                      style={{
                        width: '20%',
                      }}
                    >
                      Répondre
                    </button>
                  </div>
                </form>
              )}

              {comment.reponses && comment.reponses.length > 0 && (
                <div>
                  <button
                    onClick={() => toggleRepliesVisibility(comment.id_cmntr)}
                    className="showRepliesButton"
                  >
                    {visibleReplies[comment.id_cmntr]
                      ? 'Masquer les réponses'
                      : `Afficher les réponses (${comment.reponses.length})`}
                  </button>
                </div>
              )}
              {visibleReplies[comment.id_cmntr] &&
                comment.reponses.map((reponse) => (
                  <div key={reponse.id_reponse} className="response">
                    <div>
                      <img
                        src={`http://localhost:5000/${reponse.utilisateur.photo}`}
                        alt="Profile"
                        className="responseUserPhoto"
                      />
                      <span className="userNameResponse">
                        <NavLink
                          to={`/profil/${reponse.utilisateur.id_utilisateur}`}
                          className="userNameLink"
                        >
                          <span>{`${capitalizeFirstLetter(
                            reponse.utilisateur.prenom
                          )} ${capitalizeFirstLetter(
                            reponse.utilisateur.nom
                          )}`}</span>
                        </NavLink>{' '}
                      </span>
                      <div>
                        {editingResponseId === reponse.id_reponse ? (
                          <input
                            type="text"
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                            className="editResponseInput"
                          />
                        ) : (
                          <div className="responseContent">
                            <p className="responseText">{reponse.contenu}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="responseActionsContainer">
                      <div className="likesCountReactRes">
                        <span
                          onClick={() =>
                            toggleLikeResponse(
                              comment.id_cmntr,
                              reponse.id_reponse
                            )
                          }
                          style={{ cursor: 'pointer' }}
                        >
                          {reponse.isRepLikedByCurrentUser ? (
                            <FontAwesomeIcon
                              icon={faHeart}
                              className="heartIconlove"
                            />
                          ) : (
                            <FontAwesomeIcon
                              icon={faHeart}
                              className="heartIconUnliked"
                            />
                          )}
                        </span>

                        <span
                          onClick={() =>
                            fetchLikesAndOpenModal(
                              reponse.id_reponse,
                              'reponse'
                            )
                          }
                        >
                          {''} {reponse.nbr_likeRep} J'aime
                        </span>
                        {reponse.utilisateur.id_utilisateur.toString() !=
                          userId.toString() && (
                          <FontAwesomeIcon
                            icon={faFlag}
                            className="reportResponseIcon"
                            onClick={() =>
                              handleReportResponse(
                                comment.id_cmntr,
                                reponse.id_reponse
                              )
                            }
                          />
                        )}
                      </div>

                      <div className="responseActions">
                        {reponse.utilisateur.id_utilisateur.toString() ===
                          userId.toString() &&
                          (editingResponseId === reponse.id_reponse ? (
                            <button
                              onClick={() =>
                                saveEditedResponse(reponse.id_reponse)
                              }
                              className="iconButtonRes"
                            >
                              <FontAwesomeIcon icon={faSave} />
                            </button>
                          ) : (
                            <>
                              <button
                                onClick={() => startEditing(reponse)}
                                className="iconButtonRes"
                              >
                                <FontAwesomeIcon icon={faPen} />
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteResponse(reponse.id_reponse)
                                }
                                className="iconButtonRes"
                              >
                                <FontAwesomeIcon icon={faTrash} />
                              </button>
                            </>
                          ))}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
      {!isModalView && (
        <span
          onClick={() => openModalForPost(data.id_post)}
          className="showAllCommentsText"
        >
          Voir tous les commentaires{' '}
        </span>
      )}
    </div>
  );
};
export default Post;
