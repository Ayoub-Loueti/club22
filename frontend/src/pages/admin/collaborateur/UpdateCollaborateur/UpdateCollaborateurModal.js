import React, { useState } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const UpdateCollaborateurModal = ({
  isOpen,
  collaborateur,
  onSave,
  onCancel,
}) => {
  const [updatedCollaborateur, setUpdatedCollaborateur] =
    useState(collaborateur);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedCollaborateur((prevCollab) => ({
      ...prevCollab,
      [name]: value,
    }));
  };

  const handleSave = () => {
    onSave(updatedCollaborateur);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onCancel}
      className="update-collaborateur-modal"
      overlayClassName="update-collaborateur-overlay"
      contentLabel="Modifier Collaborateur Modal"
    >
      <h2>Modifier Collaborateur</h2>
      <form onSubmit={handleSave}>
        <label htmlFor="nom">Nom:</label>
        <input
          type="text"
          id="nom"
          name="nom"
          value={updatedCollaborateur.nom}
          onChange={handleChange}
        />

        {/* Add more input fields for other properties like type, adresse, tel, email, siteWeb, logo */}

        <div className="modal-buttons">
          <button type="submit">Enregistrer</button>
          <button type="button" onClick={onCancel}>
            Annuler
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default UpdateCollaborateurModal;
