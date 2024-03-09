import React, { useState ,useEffect} from 'react';
import './post.css';
import CommentIcon from '../../img/comment.png';
import ShareIcon from '../../img/share.png';
import HeartIcon from '../../img/like.png';
import NotLikeIcon from '../../img/notlike.png';
import axios from 'axios';
import CommentForm from '../comments/commentForm';
const Post = ({ data }) => {
  const token = JSON.parse(localStorage.getItem('login'))?.token;
  // Gestion locale de l'état de "like"
  const [liked, setLiked] = useState(data.isLikedByCurrentUser);
  const [likes, setLikes] = useState(data.likesCount || 0);
  const [userInfo, setUserInfo] = useState(null);
  const [userId, setUserId] = useState(null); 
  const [comments, setComments] = useState([]);
 const [showCommentForm, setShowCommentForm] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem('login');
    const storedUserId = JSON.parse(localStorage.getItem('userId')); // Rename for clarity
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
   // Optimistically update the likes count
   setLikes(likes + (newLikedStatus ? 1 : -1));

   try {
     await axios.post(
       `http://localhost:5000/post/${data.id_post}/toggle-like`,
       {},
       {
         headers: { Authorization: `Bearer ${token}` },
       }
     );
     // If the backend sends back the updated count, you can update it here
     // Otherwise, the optimistic update remains
   } catch (error) {
     console.error("Error toggling the post's like", error);
     // Revert back to original state if there's an error
     setLiked(!newLikedStatus);
     setLikes(likes - (newLikedStatus ? 1 : -1));
   }
 };
  
 const toggleCommentForm = () => {
   setShowCommentForm(!showCommentForm);
 };

  return (
    <div className="Post">
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
      <div className="postContent">{data.contenu}</div>
      <div className="postReact">
        <img
          src={liked ? HeartIcon : NotLikeIcon}
          alt="like"
          onClick={handleLike}
        />
        <img src={CommentIcon} alt="comment" onClick={toggleCommentForm} />
        <img src={ShareIcon} alt="share" />
      </div>
      <span style={{ color: 'var(--gray)', fontSize: '12px' }}>
        {likes} likes
      </span>
      {showCommentForm && <CommentForm postId={data.id_post} />}
      <div className="comments">
        {comments.map((comment, index) => (
          <div key={comment.id || index}>{comment.cmntr}</div>
        ))}
      </div>
    </div>
  );
};

export default Post;
