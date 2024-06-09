import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import Post from '../post/post';
import { useParams, useNavigate } from 'react-router-dom'; 

Modal.setAppElement('#root'); 

const PostLink = () => {
  const [postDetails, setPostDetails] = useState(null);
  const { postId } = useParams(); 
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchPostDetails = async () => {
      if (postId) {
        try {
          const response = await axios.get(`http://localhost:5000/getPostById/${postId}`);
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
    navigate(-1); 
  };

  return (
    <Modal
      isOpen={!!postId} 
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
