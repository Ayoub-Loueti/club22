import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../../assets/changerPass.css';
import ooredoo1Image from '../../assets/ooredoo1.png';
import ooredoo3Image from '../../assets/ooredoo3.png';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

function ChangerPass() {
  const { token } = useParams();
  const navigate = useNavigate(); 
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const MySwal = withReactContent(Swal);

  const hasLength = (password) => password.length >= 12;
  const hasUpperAndLower = (password) => /[A-Z]/.test(password) && /[a-z]/.test(password);
  const hasNumber = (password) => /\d/.test(password);

  const updatePasswordValidity = (password) => {
    const isValid = hasLength(password) && hasUpperAndLower(password) && hasNumber(password);
    setIsPasswordValid(isValid);
  };

  const handlePasswordChange = (event) => {
    const newPassword = event.target.value;
    setNewPassword(newPassword);
    updatePasswordValidity(newPassword);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword || !isPasswordValid) {
      MySwal.fire('Erreur', 'Les mots de passe ne correspondent pas ou ne remplissent pas les conditions de sécurité.', 'error');
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
            > CHANGER VOTRE MOT DE PASSE </h2>
            <form onSubmit={handleResetPasswordSubmit}>
              <div className="form-group">
                <input
                  type={showPassword ? "text" : "password"}
                  className="inputt-field"
                  value={newPassword}
                  onChange={handlePasswordChange}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                  placeholder="Entrez un nouveau mot de passe"
                  required
                />
                <span onClick={togglePasswordVisibility} style={{ cursor: 'pointer' , position: 'absolute', right: '14%', top: '32%'}}>
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </span>
                <div style={{ position: 'relative', width: '100%' }}>
                  {isPasswordFocused && (
                    <div className="password-validation-popup" style={{ position: 'absolute', top: '-30px', left: '0', width: '100%' }}>
                    <p>
                      {' '}
                      <FontAwesomeIcon icon={faExclamationCircle} /> Le mot de
                      passe doit avoir:
                    </p>
                    <ul>
                      <li className={hasLength(newPassword) ? 'valid' : 'invalid'}>
                        <span className="icon"></span>12 caractères ou plus
                      </li>
                      <li
                        className={
                          hasUpperAndLower(newPassword) ? 'valid' : 'invalid'
                        }
                      >
                        <span className="icon"></span>des majuscules et des
                        minuscules
                      </li>
                      <li className={hasNumber(newPassword) ? 'valid' : 'invalid'}>
                        <span className="icon"></span>au moins un chiffre
                      </li>
                    </ul>
                  </div>
                )}
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="inputt-field"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirmer le nouveau mot de passe"
                  required
                />
                <span onClick={toggleConfirmPasswordVisibility} style={{ cursor: 'pointer', position: 'absolute', right: '14%', top: '51%' }}>
                  <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                </span>
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