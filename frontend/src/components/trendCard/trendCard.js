import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './trendCard.css';
import Posts from '../posts/posts'; // Adjust the import path as needed
import Modal from 'react-modal'; // Import Modal
import { useTranslation } from 'react-i18next';

const TrendCard = () => {
  const [trends, setTrends] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPosts, setSelectedPosts] = useState([]);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    const token = localStorage.getItem('login');

    const fetchTrends = async () => {
      try {
        const response = await axios.get('http://54.242.240.123/hashtags', {
          headers: { Authorization: `Bearer ${JSON.parse(token).token}` },
        });
        setTrends(response.data.hashtags);
      } catch (error) {
        console.error('Error fetching trend data:', error);
      }
    };

    fetchTrends();
  }, []);

  const openModalForPosts = (posts) => {
    setSelectedPosts(posts);
    setIsModalOpen(true);
  };
  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      borderRadius: '10px',
      transform: 'translate(-50%, -50%)',
      maxHeight: '80vh', // Example max height
      overflow: 'auto', // Enable scrolling
      // Further customization as needed
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(3px)',
    },
  };

  const openModalForPost = (postId) => {
    setSelectedPostId(postId);
    setIsModalOpen(true);
  };
  return (
    <div className="TrendCard">
      <h3>{t('Tendances')}</h3>
      {trends.map((trend, index) => (
        <div
          key={index}
          onClick={() => openModalForPosts(trend.posts)}
          className="trend"
        >
          <span>#{trend.hachtag}</span>
          <span>
            {trend.nbr_hachtag} {t('partage(s)')}
          </span>
        </div>
      ))}

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        style={customStyles}
      >
        <Posts posts={selectedPosts} openModalForPost={openModalForPost} />
      </Modal>
    </div>
  );
};

export default TrendCard;
