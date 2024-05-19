import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import Post from '../post/post';
Modal.setAppElement('#root'); 

const PostModal = ({ isOpen, onRequestClose, postId }) => {
  const [post, setPost] = useState(null);
  const [postDetails, setPostDetails] = useState(null);

 useEffect(() => {
   setPostDetails(null); // Reset or set to a loading state immediately when postId changes

   const fetchPostDetails = async () => {
     try {
       const response = await axios.get(
         `http://localhost:5000/getPostById/${postId}`
       );
       setPostDetails(response.data);
     } catch (error) {
       console.error("Couldn't fetch post details", error);
     }
   };

   if (postId) {
     fetchPostDetails();
   }
 }, [postId]);

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: '40%', // Adjusted width
      maxHeight: '90vh', // Max height to enable scrolling
      border: '1px solid white',
      background: '#fff',
      overflow: 'auto', // Enables scrolling for overflow
      WebkitOverflowScrolling: 'touch', // Smooth scrolling on touch devices
      borderRadius: '14px',
      outline: 'none',
      padding: '20px',
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(3px)',
    },
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={customStyles}>
      {postDetails ? (
        // Render your Post component with the fetched post details
        <Post data={postDetails} isModalView={true} />
      ) : (
        <p>Loading ...</p>
      )}
    </Modal>
  );
};

export default PostModal;
