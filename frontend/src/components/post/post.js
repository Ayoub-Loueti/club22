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
  faEdit,
  faTrashAlt,
  faSave,
  faBookmark,
  faTimesCircle,
  faPen,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { faBookmark as farBookmark } from '@fortawesome/free-regular-svg-icons'; // Importing the regular (outline) bookmark icon

import Swal from 'sweetalert2';
import { NavLink } from 'react-router-dom';
import LikesModal from '../likesModal/likesModal';
const Post = (props) => {
  const { data, onPostDeleted, onPostUpdated, isModalView } = props;

  const token = JSON.parse(localStorage.getItem('login'))?.token;
  const [liked, setLiked] = useState(data.isLikedByCurrentUser);
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
                    <FontAwesomeIcon icon={faTrash} className="fa-solid" />
                  </button>
                </>
              ) : (
                <button onClick={handleSaveEdit} className="iconButton">
                  <FontAwesomeIcon icon={faSave} className="saveIconn" />
                </button>
              )}
            </div>
          )}
        <button
          className="iconButton"
          style={{ marginLeft: '-291px' }}
          onClick={handleToggleSave}
        >
          <FontAwesomeIcon icon={isPostSaved ? faBookmark : farBookmark} />
        </button>
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
      </div>
      <div className="postImages">
        {data.lesImages && data.lesImages.length > 0 && (
          <>
            <button onClick={showPreviousImage} className="navigationButton">
              &#9664; {/* Left arrow */}
            </button>
            <img
              src={`http://localhost:5000/${data.lesImages[currentImageIndex].pathImage}`}
              alt="Post"
              className="postImage"
            />
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

      {showCommentForm && (
        <CommentForm
          postId={data.id_post}
          onCommentSubmitted={reloadComments}
        />
      )}
      <div className="comments">
        {comments.map((comment, index) => (
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

              <div className="commentContent">
                {editingCommentId === comment.id_cmntr ? (
                  <textarea
                    className="commentEdit"
                    value={editCommentContent}
                    onChange={(e) => setEditCommentContent(e.target.value)}
                  />
                ) : (
                  <p className="commentText">{comment.cmntr}</p>
                )}
              </div>
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
                      <FontAwesomeIcon icon={faTrash} className="fa-solid" />
                    </button>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Post;
