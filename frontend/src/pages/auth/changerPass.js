import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../../assets/changerPass.css';
import ooredoo1Image from '../../assets/ooredoo1.png';
import ooredoo3Image from '../../assets/ooredoo3.png';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
function ChangerPass() {
  const { token } = useParams();
  const navigate = useNavigate(); 
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const MySwal = withReactContent(Swal);

 const handleResetPasswordSubmit = async (e) => {
   e.preventDefault();
   if (newPassword !== confirmPassword) {
     MySwal.fire('Erreur', 'Les mots de passe ne correspondent pas', 'error');
     return;
   }
   setLoading(true);

   try {
     await axios.post(`http://localhost:5000/reset-password/${token}`, {
       newPassword: newPassword,
     });

     MySwal.fire(
       'Succès',
       'Votre mot de passe a été changé avec succès',
       'success'
     ).then(() => navigate('/'));
   } catch (error) {
     console.error('Error:', error);
     MySwal.fire(
       'Erreur',
       'Une erreur est survenue. Veuillez réessayer plus tard.',
       'error'
     );
   } finally {
     setLoading(false);
   }
 };

  return (
    <div className="changerPass-page">
      <div className="whitee-square">
        <div
        style={{ cursor: 'pointer' }}
        onClick={() => navigate('/')}
        >
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
        </div>
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
