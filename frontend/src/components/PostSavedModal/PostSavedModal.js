// PostSavedModal.js
import React from 'react';
import Modal from 'react-modal';
import PostSaved from '../postSaved/postSaved'; // Adjust the import path as needed

Modal.setAppElement('#root');

function PostSavedModal({ modalOpened, setModalOpened }) {
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
  
    return (
      <Modal
        isOpen={modalOpened}
        onRequestClose={() => setModalOpened(false)}
        style={customStyles}
        contentLabel="Saved Posts Modal"
      >
        <PostSaved />
      </Modal>
    );
  }
  

export default PostSavedModal;
