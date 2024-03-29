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
    width: '50%', // Ajout d'une largeur de 80% pour la modal
    maxHeight: '90vh',
    overflow: 'auto',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(3px)',
  },
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
        <h2>Modifier Collaborateur</h2>
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
