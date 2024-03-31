import React from 'react';
import Modal from 'react-modal';
import OffreForm from './OffreForm'; // Importez OffreForm depuis votre fichier

Modal.setAppElement('#root');

function UpdateOffreModal({ isOpen, onRequestClose, onSuccess, offreId }) {
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
      contentLabel="Modifier Offre"
    >
      <div>
        <h2>Modifier Offre</h2>
        <OffreForm
          onRequestClose={onRequestClose}
          onSuccess={handleAddOrUpdateSuccess}
          isUpdate={true} // Indique que c'est une mise à jour
          offreId={offreId} // Passe l'ID de l'offre à modifier
        />
      </div>
    </Modal>
  );
}

export default UpdateOffreModal;
