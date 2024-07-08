import React from 'react';
import Modal from 'react-modal';
import TrendCard from './trendCard';

Modal.setAppElement('#root');

function TrendCardModal({ modalOpened, setModalOpened }) {
    const customStyles = {
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          borderRadius: '10px',
          transform: 'translate(-50%, -50%)',
          maxHeight: '80vh', 
          overflow: 'auto', 
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
        <TrendCard />
      </Modal>
    );
  }
  

export default TrendCardModal;
