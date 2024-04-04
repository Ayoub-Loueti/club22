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
 const titleStyle = {
   color: '#c50f10', // Bleu pour correspondre au reste du formulaire
   fontWeight: 'bold', // En gras pour attirer l'attention
   textAlign: 'center', // Centré pour un aspect esthétique
   marginBottom: '20px', // Espace au-dessous du titre pour séparer du formulaire
   fontSize: '24px', // Taille de police pour rendre le titre bien visible
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
        <h2 style={titleStyle}>MODIFIER L'OFFRE</h2>
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
