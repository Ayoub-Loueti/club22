import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Posts from '../posts/posts'; 
import PostShare from '../postShare/postShare'; 
import { useParams } from 'react-router-dom';
import './postProfil.css';
import PostModal from '../postModal/postModal';
import { useTranslation } from 'react-i18next';

import soc3 from '../../assets/soc3.gif';


const PostProfile = () => {
  const [posts, setPosts] = useState([]);
  const { id } = useParams(); 
  const token = JSON.parse(localStorage.getItem('login'))?.token;
  const loggedInUserId = JSON.parse(localStorage.getItem('userId'));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/getAllPostsByUser/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching user posts:', error);
        if (error.response && error.response.status === 404) {
          setPosts([]);
        }
      }
    };

    fetchUserPosts();
  }, [id, token]);

  const openModalForPost = (postId) => {
    setSelectedPostId(postId);
    setIsModalOpen(true);
  };

  return (
    <div className="PostProfile">
      {loggedInUserId === id && (
        <div className="PostShareContainer">
          <PostShare />
        </div>
      )}
      <div className="PostsContainer">
        {posts.length > 0 ? (
          <Posts
            posts={posts}
            className="PostsProfile"
            openModalForPost={openModalForPost}
          />
        ) : (
          <p className="no-posts-message">
            <img src={soc3} alt="SOC" className="soc1" />

            {t("Cet utilisateur n'a aucune publication.")}
          </p>
        )}
      </div>
      <PostModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        postId={selectedPostId}
      />
    </div>
  );
};

export default PostProfile;
