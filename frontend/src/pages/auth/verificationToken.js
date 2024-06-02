import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom'; // Import useParams
import '../../assets/verificationToken.css';
import ooredoo1Image from '../../assets/ooredoo1.png';
import ooredoo3Image from '../../assets/ooredoo3.png';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
function VerificationToken() {
  const [resetToken, setResetToken] = useState('');
  const [loading, setLoading] = useState(false);
  // Use useParams to get the email from the URL
  const { email } = useParams();
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const MySwal = withReactContent(Swal);

  useEffect(() => {
    let interval;
    if (resendDisabled && countdown !== 0) {
      interval = setInterval(() => {
        setCountdown((currentCountdown) => currentCountdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      setResendDisabled(false);
      setCountdown(30);
    }
    return () => clearInterval(interval);
  }, [resendDisabled, countdown]);

  const handleResetTokenSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        'http://54.242.240.123/check-reset-token',
        {
          resetPasswordToken: resetToken,
        }
      );

      if (response.data.isValid) {
        navigate(`/changerPass/${resetToken}`);
      } else {
        MySwal.fire(
          'Erreur',
          'Jeton de réinitialisation invalide. Veuillez réessayer.',
          'error'
        );
      }
    } catch (error) {
      console.error('Error:', error);
      MySwal.fire(
        'Erreur',
        "Une erreur s'est produite. Veuillez réessayer plus tard.",
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setResendDisabled(true);
    try {
      await axios.post(
        `http://54.242.240.123/resend-forgot-password-email/${email}`
      );
      MySwal.fire(
        'Succès',
        "L'email de réinitialisation a été renvoyé. Veuillez vérifier votre boîte de réception.",
        'success'
      );
    } catch (error) {
      console.error('Error:', error);
      MySwal.fire(
        'Erreur',
        "Une erreur est survenue lors du renvoi de l'email. Veuillez réessayer plus tard.",
        'error'
      );
    }
  };

  const navigateToLogin = () => {
    navigate('/');
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
            cursor: 'pointer',
          }}
          onClick={navigateToLogin}
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
              JETON DE RÉINITIALISATION
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
                <div className="verification-buttons-container">
                  <button
                    type="submit"
                    className="verification-ok-button"
                    disabled={loading}
                  >
                    OK
                  </button>
                  {error && (
                    <p style={{ color: 'red', marginTop: '20px' }}>{error}</p>
                  )}
                </div>
              </div>
            </form>
            <button
              disabled={resendDisabled}
              onClick={handleResendEmail}
              className="verification-resend-email-button"
            >
              {resendDisabled
                ? `Renvoyer l'email (${countdown})`
                : "Renvoyer l'email"}{' '}
            </button>
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
