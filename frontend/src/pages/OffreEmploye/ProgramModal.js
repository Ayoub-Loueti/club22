import React from 'react';
import { useTranslation } from 'react-i18next';

import ReactDOM from 'react-dom';

const ProgramModal = ({ isOpen, onClose, content }) => {
  const { t } = useTranslation(); 

  if (!isOpen) return null;

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
    backdropFilter: 'blur(3px)',
  };

  const contentStyle = {
    background: 'white',
    padding: '20px',
    borderRadius: '5px',
    minWidth: '500px',
    maxWidth: '800px',
    margin: 'auto',
    overflowY: 'auto',
    maxHeight: '80vh',
    position: 'relative',
  };

  return ReactDOM.createPortal(
    <div style={overlayStyle} onClick={() => onClose()}>
      <div style={contentStyle} onClick={(e) => e.stopPropagation()}>
        <h2>{t('Programme')}</h2>
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
         {t('Fermer')}
        </button>
      </div>
    </div>,
    document.body
  );
};

export default ProgramModal;
