import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../assets/verificationToken.css';
import ooredoo1Image from '../assets/ooredoo1.png';
import ooredoo3Image from '../assets/ooredoo3.png';

function VerificationToken() {
  const [resetToken, setResetToken] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleResetTokenSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        'http://localhost:5000/check-reset-token',
        {
          resetPasswordToken: resetToken,
        }
      );

      if (response.data.isValid) {
        // Token is valid, navigate to the next page
        navigate(`/changerPass/${resetToken}`);
      } else {
        // Token is invalid, display an alert
        alert('Invalid reset password token. Please try again.');
      }
    } catch (error) {
      // Handle error
      console.error('Error:', error);
      alert('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verificationToken-page">
      <div className="whitevt-square">
        <img
          src={ooredoo1Image}
          alt="logo ooredoo"
          style={{
            width: '160px',
            top: '10px',
            left: '-160px',
            position: 'relative',
          }}
        />
        <div className="grayvt-rectangle">
          <div className="form-column">
            <h2
              style={{
                position: 'absolute',
                top: '1px',
                left: '80px',
                color: '#2B3467',
                fontFamily: 'inherit',
                fontWeight: '800',
                fontSize: '25px',
              }}
            >
              {' '}
              JETON DE RÉINITIALISATION{' '}
            </h2>
            <form onSubmit={handleResetTokenSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  className="inputvt-field"
                  value={resetToken}
                  onChange={(e) => setResetToken(e.target.value)}
                  placeholder="Entrez le Token de Réinitialisation du mot de passe"
                  required
                />

                <button
                  type="submit"
                  style={{
                    backgroundColor: '#191F43',
                    color: '#fff',
                    padding: '14px 55px',
                    border: 'none',
                    borderRadius: '14px',
                    boxShadow: '0px 4px 12px 4px rgba(43, 52, 103, 0.5)',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    position: 'absolute',
                    top: '80%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: '1',
                  }}
                  disabled={loading}
                >
                  OK
                </button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="greenvt-square">
        <img
          src={ooredoo3Image}
          alt="background image"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </div>
    </div>
  );
}

export default VerificationToken;
