import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Posts from '../posts/posts'; // Adjust the import path as needed
import './postSaved.css'; // Make sure you have this CSS file for styling
import PostModal from '../postModal/postModal';

const PostSaved = () => {
  const [savedPosts, setSavedPosts] = useState([]);
  const token = JSON.parse(localStorage.getItem('login'))?.token;
  const userId = JSON.parse(localStorage.getItem('userId'));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);

  useEffect(() => {
    const fetchSavedPosts = async () => {
      try {
        // Assuming the endpoint '/user/enregistrements' returns the list of saved posts for the logged-in user
        const response = await axios.get('http://localhost:5000/enregistrements', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSavedPosts(response.data); // Assuming the response contains an array of saved posts
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
    <div className="PostSaved">
      {savedPosts.length > 0 ? (
        <Posts posts={savedPosts} openModalForPost={openModalForPost} />
      ) : (
        <p className="no-posts-message">You have not saved any posts.</p>
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
