import React, { useState, useEffect } from 'react';
import './post.css';
import CommentIcon from '../../img/comment.png';
import ShareIcon from '../../img/share.png';
import HeartIcon from '../../img/like.png';
import NotLikeIcon from '../../img/notlike.png';
import axios from 'axios';
import CommentForm from '../comments/commentForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';



const Post = ({ data }) => {
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
const [editCommentContent, setEditCommentContent] = useState("");
const [currentImageIndex, setCurrentImageIndex] = useState(0);


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

  const handleLike = async () => {
    const newLikedStatus = !liked;
    setLiked(newLikedStatus);
    setLikes(likes + (newLikedStatus ? 1 : -1));

    try {
      await axios.post(
        `http://localhost:5000/post/${data.id_post}/toggle-like`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (error) {
      console.error("Error toggling the post's like", error);
      setLiked(!newLikedStatus);
      setLikes(likes - (newLikedStatus ? 1 : -1));
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
const deletePost = async () => {
  try {
    await axios.delete(`http://localhost:5000/posts/${data.id_post}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    Swal.fire('Supprimé!', 'Votre post a été supprimé.', 'success');
window.location.reload();  } catch (error) {
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
  // Vérifier si le contenu a été modifié
  if (editContent !== data.contenu) {
    try {
      const response = await axios.put(
        `http://localhost:5000/posts/${data.id_post}`,
        {
          contenu: editContent,
          // Ajoutez d'autres champs ici si nécessaire
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response.data);
      // Sortir du mode édition après la mise à jour
      setIsEditing(false);
      // Optionnellement, vous pouvez choisir de ne pas recharger la page
      // et plutôt mettre à jour l'état local pour refléter les changements
       window.location.reload(); // Considérez une approche plus réactive sans recharger
    } catch (error) {
      console.error('Error updating the post:', error);
    }
  } else {
    // Aucune modification n'a été détectée
    // Ici, vous pouvez choisir de fermer simplement le mode d'édition
    // ou d'informer l'utilisateur qu'aucune modification n'a été détectée.
    setIsEditing(false);
    console.log("Aucune modification détectée, enregistrement annulé.");
    // Optionnel : Afficher une notification ou une alerte à l'utilisateur
  }
};

const handleDeleteComment = async (commentId) => {
  try {
    await axios.delete(`http://localhost:5000/deleteComment/${commentId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    // Remove the comment from the comments state or refresh the comments list
    Swal.fire('Deleted!', 'Your comment has been deleted.', 'success');
    // Optionally refresh comments list or remove the deleted comment from state
  } catch (error) {
    console.error('Error deleting the comment:', error);
    Swal.fire('Error!', 'An error occurred while deleting the comment.', 'error');
  }
};

const handleEditComment = (commentId, currentContent) => {
  setEditingCommentId(commentId);
  setEditCommentContent(currentContent);
};

const handleSaveEditComment = async () => {
  try {
    await axios.put(
      `http://localhost:5000/modifyComment/${editingCommentId}`,
      { newContent: editCommentContent },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    // Exit editing mode
    setEditingCommentId(null);
    setEditCommentContent("");
    // Refresh comments list to show updated comment
  } catch (error) {
    console.error("Error updating the comment:", error);
    // Handle error (e.g., show error message)
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


  return (
    <div className="Post">
       {userInfo && data.utilisateur.id_utilisateur.toString() === userId.toString() && (
    <div className="postManagementButtons">
      {!isEditing ? (
        <>
          <button onClick={toggleEditForm} className="iconButton">
            <FontAwesomeIcon icon={faEdit} /> {/* Icon Edit */}
          </button>
          <button onClick={handleDeletePost} className="iconButton">
            <FontAwesomeIcon icon={faTrashAlt} /> {/* Icon Delete */}
          </button>
        </>
      ) : (
        <button onClick={handleSaveEdit}>Save</button> // You might also want an icon for "Save"
      )}
    </div>
  )}

      <div className="postHeader">
        <img
          src={
            data.utilisateur.photo
              ? `http://localhost:5000/${data.utilisateur.photo}`
              : 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'
          }
          alt="Profil"
          className="userPhoto"
        />
        <span className="userName">{`${data.utilisateur.prenom} ${data.utilisateur.nom}`}</span>
      </div>
      <div className="postContent">
        {!isEditing ? (
          <span>{data.contenu}</span>
        ) : (
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
          />
        )}
      </div>
      <div className="postImages">
  {data.lesImages && data.lesImages.length > 0 && (
    <>
      <button onClick={showPreviousImage} className="navigationButton">&#9664;</button> {/* Left arrow */}
      <img
        src={`http://localhost:5000/${data.lesImages[currentImageIndex].pathImage}`}
        alt="Post"
        className="postImage"
      />
      <button onClick={showNextImage} className="navigationButton">&#9654;</button> {/* Right arrow */}
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
      <span className="likesCount">{likes} likes</span>
      {showCommentForm && <CommentForm postId={data.id_post} />}
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
            <span className="userNameComment">{`${comment.utilisateur.prenom} ${comment.utilisateur.nom}`}</span>
            <div className="commentContent">
              {editingCommentId === comment.id_cmntr ? (
                <textarea
                  value={editCommentContent}
                  onChange={(e) => setEditCommentContent(e.target.value)}
                />
              ) : (
                <p className="commentText">{comment.cmntr}</p>
              )}
            </div>
            {comment.utilisateur.id_utilisateur.toString() === userId.toString() && (
              editingCommentId === comment.id_cmntr ? (
                <button onClick={handleSaveEditComment}>Save</button>
              ) : (
                <div className="commentActions">
                  <button className="iconButton" onClick={() => handleEditComment(comment.id_cmntr, comment.cmntr)}>
                    <FontAwesomeIcon icon={faEdit} /> {/* Edit Icon */}
                  </button>
                  <button className="iconButton" onClick={() => handleDeleteComment(comment.id_cmntr)}>
                    <FontAwesomeIcon icon={faTrashAlt} /> {/* Delete Icon */}
                  </button>
                </div>
              )
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
);
};

export default Post;
