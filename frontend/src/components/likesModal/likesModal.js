import React from 'react';
import Modal from 'react-modal';
import '../likesModal/likesModal.css';
import { NavLink } from 'react-router-dom'; // Assurez-vous d'importer NavLink de 'react-router-dom'

const LikesModal = ({ isOpen, onRequestClose, likes }) => {
      const defaultPhotoUrl =
        'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg';
const capitalizeFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="likes-modal-content"
      overlayClassName="likes-modal-overlay"
    >
      <button onClick={onRequestClose} className="likes-modal-close-btn">
        &times;
      </button>
      <h2 className="likes-modal-header">Personnes qui ont aimé</h2>
      <ul className="likes-modal-list">
        {likes.map((like, index) => (
          <li key={index} className="likes-modal-list-item">
            <img
              src={
                like.utilisateur.photo
                  ? `http://localhost:5000/${like.utilisateur.photo}`
                  : defaultPhotoUrl
              }
              alt={`${like.utilisateur.nom} ${like.utilisateur.prenom}`}
              className="likes-modal-user-photo"
            />
            <NavLink
              to={`/profil/${like.utilisateur.id_utilisateur}`}
              className="likes-modal-user-link"
            >
              {`${capitalizeFirstLetter(
                like.utilisateur.prenom
              )} ${capitalizeFirstLetter(like.utilisateur.nom)}`}
            </NavLink>
          </li>
        ))}
      </ul>
    </Modal>
  );
};

export default LikesModal;
