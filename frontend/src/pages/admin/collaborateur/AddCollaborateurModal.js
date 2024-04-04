import React, { useState } from 'react';
import Modal from 'react-modal';
import CollaborateurForm from './CollaborateurForm';

Modal.setAppElement('#root');

function AddCollaborateurModal({ isOpen, onRequestClose, onSuccess }) {
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
      contentLabel="Ajouter Collaborateur"
    >
      <div>
        <h2 style={titleStyle}>AJOUTER UN COLLABORATEUR</h2>
        <CollaborateurForm
          onRequestClose={onRequestClose}
          onSuccess={handleAddOrUpdateSuccess}
        />
      </div>
    </Modal>
  );
}

export default AddCollaborateurModal;
