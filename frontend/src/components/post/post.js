import React, { useState ,useEffect} from 'react';
import './post.css';
import CommentIcon from '../../img/comment.png';
import ShareIcon from '../../img/share.png';
import HeartIcon from '../../img/like.png';
import NotLikeIcon from '../../img/notlike.png';
import axios from 'axios';

const Post = ({ data }) => {
  const token = JSON.parse(localStorage.getItem('login'))?.token;
  // Gestion locale de l'état de "like"
  const [liked, setLiked] = useState(data.liked);
  const [likes, setLikes] = useState(data.likes);
  const [userInfo, setUserInfo] = useState(null);
  const [userId, setUserId] = useState(null); // Add this line

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
  const handleLike = async () => {
    try {
      await axios.post(
        `http://localhost:5000/post/${data.id_post}/toggle-like`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Toggle like status optimistically
      if (liked) {
        setLikes(likes - 1);
      } else {
        setLikes(likes + 1);
      }
      setLiked(!liked);
    } catch (error) {
      console.error("Error toggling the post's like", error);
    }
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
        <span className="userName">{`${data.utilisateur.nom} ${data.utilisateur.prenom}`}</span>
      </div>
      <div className="postContent">{data.contenu}</div>
      <div className="postReact">
        <img
          src={liked ? HeartIcon : NotLikeIcon}
          alt="like"
          onClick={handleLike}
        />
        <img src={CommentIcon} alt="comment" />
        <img src={ShareIcon} alt="share" />
      </div>
      <span style={{ color: 'var(--gray)', fontSize: '12px' }}>
        {likes.nbr_likes} likes
      </span>
    </div>
  );
};

export default Post;
