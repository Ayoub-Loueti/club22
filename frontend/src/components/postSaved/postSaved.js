import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Posts from '../posts/posts'; 
import './postSaved.css'; 
import PostModal from '../postModal/postModal';
import { useTranslation } from 'react-i18next';

const PostSaved = () => {
  const [savedPosts, setSavedPosts] = useState([]);
  const token = JSON.parse(localStorage.getItem('login'))?.token;
  const userId = JSON.parse(localStorage.getItem('userId'));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchSavedPosts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/enregistrements', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSavedPosts(response.data); 
      } catch (error) {
        console.error('Error fetching saved posts:', error);
      }
    };

    fetchSavedPosts();
  }, [token]);

  const openModalForPost = (postId) => {
    setSelectedPostId(postId);
    setIsModalOpen(true);
  };

  return (
    <div className="PostSaved custom-scroll">
      
      {savedPosts.length > 0 ? (
        <Posts posts={savedPosts} openModalForPost={openModalForPost} />
      ) : (
        <p className="no-posts-msg">
         { t('Vous n avez enregistré aucune publication.')}
        </p>
      )}
      <PostModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        postId={selectedPostId}
      />
    </div>
  );
};

export default PostSaved;
