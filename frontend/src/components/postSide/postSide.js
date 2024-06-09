import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Posts from '../posts/posts';
import PostShare from '../postShare/postShare';
import PostModal from '../postModal/postModal';
import { useTranslation } from 'react-i18next';

import './postSide.css';

const PostSide = () => {
  const [posts, setPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [postType, setPostType] = useState('tous');
    const { t } = useTranslation();

  const token = JSON.parse(localStorage.getItem('login'))?.token;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        let url = 'http://localhost:5000/posts';
        if (postType !== 'tous') {
          url += `/${postType}`; 
        }
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPosts(response.data);
      } catch (error) {
        console.error('Error loading posts', error);
      }
    };

    fetchPosts();
  }, [token, postType]);

  const openModalForPost = (postId) => {
    setSelectedPostId(postId);
    setIsModalOpen(true);
  };

  const handlePostTypeChange = (type) => {
    setPostType(type);
  };

  return (
    <div className="PostSide">
      <PostShare />
      {/* Mini navbar */}
      <div className="mini-navbar">
        <button
          className={postType === 'tous' ? 'active' : ''}
          onClick={() => handlePostTypeChange('tous')}
        >
          {t('Tous')}
        </button>
        <button
          className={postType === 'hotel' ? 'active' : ''}
          onClick={() => handlePostTypeChange('hotel')}
        >
          Hotels
        </button>
        <button
          className={postType === 'voyage' ? 'active' : ''}
          onClick={() => handlePostTypeChange('voyage')}
        >
          {t('Voyages')}
        </button>
        <button
          className={postType === 'activité' ? 'active' : ''}
          onClick={() => handlePostTypeChange('activité')}
        >
          {t('Activités')}
        </button>
      </div>
      <Posts posts={posts} openModalForPost={openModalForPost} />
      <PostModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        postId={selectedPostId}
      />
    </div>
  );
};

export default PostSide;
