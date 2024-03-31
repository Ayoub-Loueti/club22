import React, { useState } from 'react';
import Modal from 'react-modal';
import OffreForm from './OffreForm'; // Importez OffreForm depuis votre fichier

Modal.setAppElement('#root');

function AddOffreModal({ isOpen, onRequestClose, onSuccess }) {
  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      borderRadius: '10px',
      width: '50%',
      maxHeight: '90vh',
      overflow: 'auto',
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(3px)',
    },
  };

  const handleAddOrUpdateSuccess = () => {
    onSuccess(); // Appel onSuccess pour rafraîchir la liste des offres
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
      contentLabel="Ajouter Offre"
    >
      <div>
        <h2>Ajouter Offre</h2>
        <OffreForm
          onRequestClose={onRequestClose}
          onSuccess={handleAddOrUpdateSuccess}
        />
      </div>
    </Modal>
  );
}

export default AddOffreModal;
