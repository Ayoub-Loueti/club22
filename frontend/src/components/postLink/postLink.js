import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import Post from '../post/post';
import { useParams, useNavigate } from 'react-router-dom'; // Import useParams and useNavigate

Modal.setAppElement('#root'); // Properly set the app element for accessibility

const PostLink = () => {
  const [postDetails, setPostDetails] = useState(null);
  const { postId } = useParams(); // Get postId from URL parameters
  const navigate = useNavigate(); // Hook to perform navigation

  useEffect(() => {
    const fetchPostDetails = async () => {
      if (postId) {
        try {
          const response = await axios.get(
            `http://54.242.240.123/getPostById/${postId}`
          );
          setPostDetails(response.data);
        } catch (error) {
          console.error("Couldn't fetch post details", error);
        }
      }
    };

    fetchPostDetails();
  }, [postId]);

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: '40%',
      maxHeight: '90vh',
      border: '1px solid white',
      background: '#fff',
      overflow: 'auto',
      WebkitOverflowScrolling: 'touch',
      borderRadius: '14px',
      outline: 'none',
      padding: '20px',
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(3px)',
    },
  };

  const onRequestClose = () => {
    navigate(-1); // Go back to the previous page or history state
  };

  return (
    <Modal
      isOpen={!!postId} // Modal is open if there's a postId
      onRequestClose={onRequestClose}
      style={customStyles}
    >
      {postDetails ? (
        <Post data={postDetails} isModalView={true} />
      ) : (
        <p>Loading...</p>
      )}
    </Modal>
  );
};

export default PostLink;
