import React from 'react';
import Modal from 'react-modal';
import CollaborateurForm from './CollaborateurForm';

Modal.setAppElement('#root');

function UpdateCollaborateurModal({
  isOpen,
  onRequestClose,
  onSuccess,
  collaborateurId,
}) {
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: '10px',
    width: '40%', // Ajout d'une largeur de 80% pour la modal
    maxHeight: '80vh',
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
    onSuccess(); // Call the onSuccess prop passed from ListCollaborateur
  };
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
      contentLabel="Modifier Collaborateur"
    >
      <div>
        <h2 style={titleStyle}>MODIFIER LE COLLABORATEUR</h2>
        <CollaborateurForm
          onRequestClose={onRequestClose}
          onSuccess={handleAddOrUpdateSuccess}
          isUpdate={true}
          collaborateurId={collaborateurId} // Pass the collaborateurId prop to CollaborateurForm
        />
      </div>
    </Modal>
  );
}

export default UpdateCollaborateurModal;
