import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';

Modal.setAppElement('#root');

const PhoneNumberModal = ({ isOpen, onRequestClose }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const token = JSON.parse(localStorage.getItem('login'))?.token;
      await axios.post(
        'http://localhost:5000/send-sms',
        { phoneNumber },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Handle success, close the modal or show a success message
      onRequestClose();
    } catch (error) {
      console.error('Error sending SMS:', error);
      setError('Failed to send SMS. Please try again.');
    }
  };

  const handlePhoneNumberChange = (event) => {
    setPhoneNumber(event.target.value);
    setError(''); // Clear any previous error message when the phone number changes
  };

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: '60%', // Adjusted width
      border: '1px solid white',
      background: '#fff',
      overflow: 'auto', // Enables scrolling for overflow
      WebkitOverflowScrolling: 'touch', // Smooth scrolling on touch devices
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
      <h2>Phone Number Modal</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="phoneNumber">Phone Number:</label>
        <input
          type="text"
          id="phoneNumber"
          value={phoneNumber}
          onChange={handlePhoneNumberChange}
        />
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <button type="submit">Send SMS</button>
      </form>
    </Modal>
  );
};

export default PhoneNumberModal;
