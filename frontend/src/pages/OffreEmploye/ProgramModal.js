import React from 'react';
import ReactDOM from 'react-dom';

const ProgramModal = ({ isOpen, onClose, content }) => {
  if (!isOpen) return null;

  // Styles pour l'arrière-plan sombre semi-transparent
  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(3px)', // Flou léger pour l'arrière-plan
  };

  // Styles pour la boîte de contenu du modal
  const contentStyle = {
    background: 'white',
    padding: '20px',
    borderRadius: '5px',
    minWidth: '500px',
    maxWidth: '800px',
    margin: 'auto', // Centre le modal verticalement et horizontalement
    overflowY: 'auto', // Active le défilement vertical si nécessaire
    maxHeight: '80vh', // Hauteur maximale pour permettre le défilement
    position: 'relative', // Position relative pour le positionnement interne
  };

  return ReactDOM.createPortal(
    <div style={overlayStyle} onClick={() => onClose()}>
      <div
        style={contentStyle}
        onClick={(e) => e.stopPropagation()} // Empêche le clic de fermer le modal
      >
        <h2>Programme</h2>
        <div>{content}</div>{' '}
        <button
          onClick={onClose}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            cursor: 'pointer',
            backgroundColor: '#4a5568',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            marginTop: '10px',
            alignSelf: 'flex-end',
          }}
        >
          Fermer
        </button>
      </div>
    </div>,
    document.body
  );
};

export default ProgramModal;
