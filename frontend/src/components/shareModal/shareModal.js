import React from 'react';
import Modal from 'react-modal';
import PostShare from '../postShare/postShare';


// This line is important for accessibility reasons.
// It binds your app and allows the screen readers to correctly announce the modal content.
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
      contentLabel="Share Modal" // This is important for accessibility reasons
    >
      {/* Modal content goes here */}
      <PostShare />
    </Modal>
  );
}

export default ShareModal;
