import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import Post from '../post/post';
Modal.setAppElement('#root');

const PostModal = ({ postId, closeModal }) => {
  const [post, setPost] = useState(null);

  // Inside PostModal.js
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchPost = async () => {
    setLoading(true);
    setError('');
    const token = JSON.parse(localStorage.getItem('login'))?.token;
    try {
      const response = await axios.get(
        `http://localhost:5000/getPostById/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPost(response.data);
    } catch (error) {
      console.error('Error fetching the post:', error);
      setError('Failed to load post. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (postId) {
      fetchPost();
    }
  }, [postId]); // Ensures fetchPost is called whenever postId changes
  // This ensures fetchPost is called whenever postId changes

  return (
    // Inside the return statement of PostModal.js
    <Modal
      isOpen={!!postId}
      onRequestClose={closeModal}
      contentLabel="Post Details"
    >
      {post ? <Post data={post} /> : <p>Loading...</p>}
    </Modal>
  );
};

export default PostModal;
