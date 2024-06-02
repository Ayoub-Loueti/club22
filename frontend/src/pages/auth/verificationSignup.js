import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import backgroundImage from '../../assets/ooredoo3.png'; // Ensure this path is correct

function VerificationSignup() {
  const { userId, token } = useParams();
  const [verificationStatus, setVerificationStatus] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function verifyAccount() {
      try {
        const response = await axios.get(
          `http://54.87.28.4/activateAccount/${userId}/${token}`
        );
        const { message } = response.data;
        setVerificationStatus(message);
      } catch (error) {
        if (error.response) {
          const { data } = error.response;
          setVerificationStatus(data.message);
        } else {
          console.error('Error verifying account:', error.message);
          setVerificationStatus('Error verifying account');
        }
      }
    }

    verifyAccount();
  }, [userId, token]);

  const handleLoginClick = () => {
    if (verificationStatus === 'Compte activé avec succès.') {
      navigate('/');
    }
  };

  const pageStyles = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
  };

  const statusMessageStyles = {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    maxWidth: '600px',
    textAlign: 'center',
    margin: '20px',
    color: '#333',
  };

  const buttonStyles = {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '20px',
    fontSize: '16px',
  };

  return (
    <div style={pageStyles}>
      <div style={statusMessageStyles}>
        <h1>
          {verificationStatus === 'Compte activé avec succès.'
            ? 'Votre compte est maintenant actif !'
            : 'Verification Status'}
        </h1>
        <p>{verificationStatus}</p>
        {verificationStatus === 'Compte activé avec succès.' && (
          <button style={buttonStyles} onClick={handleLoginClick}>
            Aller à la connexion
          </button>
        )}
      </div>
    </div>
  );
}

export default VerificationSignup;
