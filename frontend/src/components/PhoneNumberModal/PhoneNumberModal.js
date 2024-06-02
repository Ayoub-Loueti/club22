// PhoneNumberModal.js
import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import './PhoneNumberModal.css'; // Make sure the path is correct based on your project structure
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useTranslation } from 'react-i18next';

Modal.setAppElement('#root');

const PhoneNumberModal = ({ isOpen, onRequestClose }) => {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const { t } = useTranslation();

  const MySwal = withReactContent(Swal);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const token = JSON.parse(localStorage.getItem('login'))?.token;
      await axios.post(
        'http://54.87.28.4/send-sms', // Adjusted to full URL for consistency with the working snippet
        { phoneNumber: value },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onRequestClose(); // Close the modal on success
      MySwal.fire({
        icon: 'success',
        title: t('SMS envoyé avec succès!'),
        showConfirmButton: false,
        timer: 1500, // Fermer automatiquement après 1.5 secondes
      });
    } catch (error) {
      console.error('Error sending SMS:', error);
      MySwal.fire({
        icon: 'error',
        title: t("Échec de l'envoi du SMS"),
        text: t('Veuillez réessayer.'),
        confirmButtonText: 'OK',
      });
    }
  };

  // Custom styles for the modal as provided by you
  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: '40%',
      border: '1px solid white',
      background: '#fff',
      overflow: 'auto',
      WebkitOverflowScrolling: 'touch',
      borderRadius: '14px',
      outline: 'none',
      padding: '20px',
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(3px)',
    },
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={customStyles}>
      <h2 style={{ textAlign: 'center' }}>
        {t('Entrer votre numero téléphone :')}
      </h2>
      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <PhoneInput
          international
          defaultCountry="TN"
          value={value}
          onChange={setValue}
          className="PhoneInput" // Here we apply our custom styles
        />
        {error && (
          <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>
        )}
        <button type="submit" className="phonenumb-but">
          {t('Envoyer SMS')}
        </button>
      </form>
    </Modal>
  );
};

export default PhoneNumberModal;
