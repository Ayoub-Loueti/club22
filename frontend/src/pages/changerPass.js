import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../assets/changerPass.css';
import ooredoo1Image from '../assets/ooredoo1.png';
import ooredoo3Image from '../assets/ooredoo3.png';

function ChangerPass() {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);

    try {
      const response = await axios.post(`http://localhost:5000/reset-password/${token}`, {
        newPassword: newPassword
      });

      alert(response.data.message); 
      // Redirect or perform any other actions upon successful password reset

    } catch (error) {
      // Handle error
      console.error('Error:', error);
      alert('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="changerPass-page">
      <div className="whitee-square">
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
        <div className="grayy-rectangle">
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
            > CHANGER VOTRE MOT DE PASSE            </h2>
            <form onSubmit={handleResetPasswordSubmit}>
              <div className="form-group">
                <input
                  type="password"
                  className="inputt-field"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Entrez un nouveau mot de passe"
                  required
                />
                <input
                  type="password"
                  className="inputt-field"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirmer le nouveau mot de passe"
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
                  Changer
                </button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="greenn-square">
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

export default ChangerPass;
