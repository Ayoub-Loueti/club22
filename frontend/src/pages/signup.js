import React, { useState } from 'react';
import '../assets/signup.css';
import ooredoo1Image from '../assets/ooredoo1.png';
import ooredoo3Image from '../assets/ooredoo3.png';
import axios from 'axios';
import {  useNavigate } from 'react-router-dom';

function Signup() {
 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmationMessage, setShowConfirmationMessage] = useState(false);
  const navigate = useNavigate(); 


  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      alert('Les mots de passe ne correspondent pas.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/signup', {

        email: email,
        motDePasse: password,
      });

      console.log(response.data); // Afficher la réponse du backend
      setShowConfirmationMessage(true);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // If the user already exists, show the alert message
        alert('Un utilisateur avec cet e-mail existe déjà.');
      } else {
        console.error("Erreur lors de l'inscription:", error.response?.data?.error || error.message);
      }
      // Optionally handle other error statuses or show a generic error message
    }
  };

  const handleResendEmail = async () => {
    try {
      await axios.post('http://localhost:5000/resendEmail', {
        email: email,
      });
      alert('Email de verification renvoyé. Veuillez vérifier votre boite email.');
    } catch (error) {
      console.error("Erreur lors du renvoi de l'email:", error.response.data.error);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-green-square">
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
          Vous avez déjà un compte ?
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
            window.location.href = '/';
          }}
        >
          Se connecter
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
        <img
          src={ooredoo1Image}
          alt="logo ooredoo"
          style={{
            width: '160px',
            top: '-650px',
            left: '-240px',
            position: 'relative',
          }}
        />
        <div className="signup-gray-rectangle">
          <div className="form-column ">
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
              Inscription
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <h3 className="signup-input-label">Email</h3>
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  className="signup-input-field"
                  required
                />
              </div>
              <div className="form-group">
                <h3 className="signup-input-label">Mot de passe</h3>
                <input
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  className="signup-input-field"
                  required
                />
              </div>
              <div className="form-group">
                <h3 className="signup-input-label">
                  Confirmer votre mot de passe
                </h3>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  className="signup-input-field"
                  required
                />
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
                  top: '71%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: '1',
                }}
              >
                S'inscrire
              </button>
              <p
                style={{
                  fontFamily: 'inherit',
                  fontSize: '18px',
                  color: '#4F5475',
                  textAlign: 'center',
                  position: 'absolute',
                  top: '76%',
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
                  top: '85%',
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
      <a
        href="#resend"
        onClick={(e) => {
          e.preventDefault(); // Prevent the default anchor action
          handleResendEmail();
        }}
        style={{
          color: '#007bff',  // Bootstrap primary link color
          fontWeight: 'bold',
          textDecoration: 'underline',
          marginLeft: '5px',  // Space out the link from the text
        }}
      >
        renvoyer l'email.
      </a>
    </p>
  </div>
)}

            </form>
          </div>
        </div>
      </div>
      <div className="signup-white-square"></div>{' '}
    </div>
  );
}

export default Signup;
