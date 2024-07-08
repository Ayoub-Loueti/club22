import React from 'react';
import Modal from 'react-modal';
import PostShare from '../postShare/postShare';


Modal.setAppElement('#root');

function ShareModal({ modalOpened, setModalOpened }) {
  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      // Add more styles as needed
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
      contentLabel="Share Modal" 
    >
      <PostShare />
    </Modal>
  );
}

export default ShareModal;
