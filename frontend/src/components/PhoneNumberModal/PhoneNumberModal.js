// PhoneNumberModal.js
import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import './PhoneNumberModal.css'; // Make sure the path is correct based on your project structure

Modal.setAppElement('#root');

const PhoneNumberModal = ({ isOpen, onRequestClose }) => {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const token = JSON.parse(localStorage.getItem('login'))?.token;
      await axios.post(
        'http://localhost:5000/send-sms', // Adjusted to full URL for consistency with the working snippet
        { phoneNumber: value },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onRequestClose(); // Close the modal on success
    } catch (error) {
      console.error('Error sending SMS:', error);
      setError('Failed to send SMS. Please try again.');
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
      <h2 style={{ textAlign: 'center' }}>Enter Your Phone Number</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <PhoneInput
          international
          defaultCountry="TN"
          value={value}
          onChange={setValue}
          className="PhoneInput" // Here we apply our custom styles
        />
        {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
        <button
          type="submit"
        >
          Send SMS
        </button>
      </form>
    </Modal>
  );
};

export default PhoneNumberModal;
