import React, { useState , useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

import '../assets/login.css';
import ooredoo1Image from '../assets/ooredoo1.png';
import ooredoo3Image from '../assets/ooredoo3.png';

function Login() {
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false); // New state for managing resend button disabled state
  const [countdown, setCountdown] = useState(30); 
  const [showConfirmationMessage, setShowConfirmationMessage] = useState(false);
  const navigate = useNavigate();

const handleForgotPassword = async (email) => {
  try {
    const response = await axios.post('http://localhost:5000/forgot-password', { email });
    alert('Email de réinitialisation du mot de passe envoyé !');
    navigate(`/verificationToken/${email}`);
  } catch (error) {
    if (error.response) {
      switch (error.response.data.message) {
        case 'Utilisateur non trouvé.':
          alert('Utilisateur non trouvé. Veuillez vérifier l"adresse e-mail et réessayer.');
          break;
        case 'Les utilisateurs qui se sont inscrits via Google doivent utiliser la réinitialisation de mot de passe de Google.':
          alert('Les utilisateurs qui se sont inscrits via Google doivent utiliser la réinitialisation de mot de passe de Google.');
          break;
        case 'Votre compte doit être autorisé pour réinitialiser le mot de passe.':
          alert('Votre compte doit être autorisé pour réinitialiser le mot de passe. Veuillez contacter l"administrateur.');
          break;
        default:
          alert('Échec de l"envoi de l"email de réinitialisation du mot de passe. Veuillez réessayer.');
      }
    } else {
      alert('Une erreur est survenue. Veuillez réessayer.');
    }
  }
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/login', {
        email,
        motDePasse,
      });

      const token = response.data.token;
      const shouldUpdateProfile = response.data.shouldUpdateProfile;
      localStorage.setItem(
        'login',
        JSON.stringify({
          isAuthenticated: true,
          token: token,
        })
      );
      if (shouldUpdateProfile) {
        navigate('/insererNom');
      } else {
        alert('Login successful!');
        navigate('/profil');
      }
    } catch (error) {
      if (error.response) {
        if (
          error.response.data.error ===
          'User account is not authorized to log in'
        ) {
          alert('Le compte utilisateur n"est pas autorisé à se connecter.');
          setShowConfirmationMessage(true);
        } else if (
          error.response.data.error ===
          'Your account is blocked. Please contact the administrator.'
        ) {
          alert('Votre compte est bloqué. Veuillez contacter l"administrateur.');
        } else {
          alert('Email ou mot de passe invalide.');
        }
      } else if (error.request) {
        alert('Erreur réseau. Veuillez réessayer plus tard.');
      } else {
        alert('Une erreur s"est produite. Veuillez réessayer plus tard.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let interval;
    if (resendDisabled && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((currentCountdown) => currentCountdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      setResendDisabled(false);
      setCountdown(30); // Reset countdown
    }
    return () => clearInterval(interval);
  }, [resendDisabled, countdown]);

  const handleResendEmail = async () => {
    setResendDisabled(true); // Disable the button immediately when clicked
    try {
      await axios.post('http://localhost:5000/resendEmail', {
        email: email,
      });
      alert('Email de verification renvoyé. Veuillez vérifier votre boite email.');
    } catch (error) {
      console.error("Erreur lors du renvoi de l'email:", error.response?.data?.error || error.message);
    }
  };

  return (
    <div className="login-page">
      <div className="white-square">
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
        <div className="gray-rectangle">
          <div className="form-column">
            <h2
              style={{
                position: 'absolute',
                top: '1px',
                left: '30px',
                color: '#2B3467',
                fontFamily: 'inherit',
                fontWeight: '800',
                fontSize: '40px',
              }}
            >
              Connexion
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <h3 className="input-label">Email</h3>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  required
                />
              </div>
              <div className="form-group">
                <h3 className="input-label">Mot de passe</h3>
                <input
                  type="password"
                  value={motDePasse}
                  onChange={(e) => setMotDePasse(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <div className="form-group">
  <button
    onClick={(e) => {
      e.preventDefault();
      if (!email) {
        alert('Veuillez entrer une adresse e-mail.');
        return;
      }
      handleForgotPassword(email);
    }}
    style={{
      background: 'none',
      border: 'none',
      padding: '0',
      color: email ? '#4F5475' : '#BDBDBB',
      fontWeight: 'bold',
      fontFamily: 'inherit',
      fontSize: '12px',
      marginLeft: '-100px',
      textDecoration: 'underline',
      cursor: email ? 'pointer' : 'not-allowed',
    }}
  >
    Mot de passe oublié ?
  </button>
</div>


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
                  top: '75%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: '1',
                }}
              >
                Se connecter
              </button>
              <p
                style={{
                  fontFamily: 'inherit',
                  fontSize: '18px',
                  color: '#4F5475',
                  textAlign: 'center',
                  position: 'absolute',
                  top: '82%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: '1',
                  fontWeight: 'bold',
                }}
              >
                OU
              </p>
              <a
                href="http://localhost:5000/auth/google"
                className="google-auth-link"
                style={{
                  position: 'absolute',
                  top: '93%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: '1',
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1.2em"
                  height="1.2em"
                  viewBox="0 0 1024 1024"
                  style={{
                    textAlign: 'center',
                    fontSize: '30',
                  }}
                >
                  <path
                    fill="#191F43"
                    d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448s448-200.6 448-448S759.4 64 512 64m167 633.6C638.4 735 583 757 516.9 757c-95.7 0-178.5-54.9-218.8-134.9C281.5 589 272 551.6 272 512s9.5-77 26.1-110.1c40.3-80.1 123.1-135 218.8-135c66 0 121.4 24.3 163.9 63.8L610.6 401c-25.4-24.3-57.7-36.6-93.6-36.6c-63.8 0-117.8 43.1-137.1 101c-4.9 14.7-7.7 30.4-7.7 46.6s2.8 31.9 7.7 46.6c19.3 57.9 73.3 101 137 101c33 0 61-8.7 82.9-23.4c26-17.4 43.2-43.3 48.9-74H516.9v-94.8h230.7c2.9 16.1 4.4 32.8 4.4 50.1c0 74.7-26.7 137.4-73 180.1"
                  ></path>
                </svg>
              </a>
              {showConfirmationMessage && (
  <div style={{
    textAlign: 'center',
    marginTop: '40px',
    backgroundColor: '#f8f9fa',  // Light grey background for subtle contrast
    padding: '30px 40px',
    borderRadius: '15px',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.12)',
    color: '#343a40',  // Dark grey text for readability
    fontSize: '1rem',  // 16px font size for readability
    lineHeight: '1.5',
    width: '200px',  // Use a percentage to control width
    margin: '150px auto',  // Center the container
    border: '1px solid #ced4da'  // Light grey border to define the box edges
  }}>
    <p style={{ margin: '0 auto', width: '80%' }}>
       activer votre compte.
       <button
              onClick={handleResendEmail}
              disabled={resendDisabled}
              style={{ /* Your button styles */ }}
            >
              {resendDisabled ? `Renvoyer l'email (${countdown})` : 'Renvoyer l\'email'}
            </button>
    </p>
  </div>
)}
            </form>
          </div>
        </div>
      </div>
      <div className="green-square">
        <h3
          style={{
            fontFamily: 'inherit',
            fontSize: '37px',
            lineHeight: '1.5',
            fontWeight: '300px',
            color: '#fff',
            textAlign: 'center',
            position: 'absolute',
            top: '40%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: '1',
          }}
        >
          DECOUVREZ DES <br /> BONS PLANS
        </h3>
        <p
          style={{
            fontFamily: 'inherit',
            fontSize: '17px',
            lineHeight: '35.1px',
            color: '#fff',
            textAlign: 'center',
            position: 'absolute',
            top: '60%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: '1',
          }}
        >
          Vous n'avez pas de compte ?
        </p>
        <button
          style={{
            backgroundColor: '#C50F10',
            color: '#fff',
            padding: '14px 35px',
            border: 'none',
            borderRadius: '14px',
            boxShadow: '0px 4px 12px 4px rgba(255, 255, 255, 0.5)',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            position: 'absolute',
            top: '70%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: '1',
          }}
          onClick={() => {
            window.location.href = '/signup';
          }}
        >
          S'inscrire
        </button>

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

export default Login;
