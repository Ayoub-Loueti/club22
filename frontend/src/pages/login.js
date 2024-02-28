import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

import '../assets/login.css';
import ooredoo1Image from '../assets/ooredoo1.png';
import ooredoo3Image from '../assets/ooredoo3.png';

function Login() {
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleForgotPassword = async (email) => {
    try {
      await axios.post('http://localhost:5000/forgot-password', { email });
      alert('Password reset email sent!');
    } catch (error) {
      alert('Failed to send password reset email. Please try again.');
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
      localStorage.setItem(
        'login',
        JSON.stringify({
          isAuthenticated: true,
          token: token,
        })
      );
      alert('Login successful!');
      navigate('/signup');
    } catch (error) {
      if (error.response) {
        if (
          error.response.data.error ===
          'User account is not authorized to log in'
        ) {
          alert('User account is not authorized to log in.');
        } else if (
          error.response.data.error ===
          'Your account is blocked. Please contact the administrator.'
        ) {
          alert('Your account is blocked. Please contact the administrator.');
        } else {
          alert('Invalid email or password.');
        }
      } else if (error.request) {
        alert('Network Error. Please try again later.');
      } else {
        alert('An error occurred. Please try again later.');
      }
    } finally {
      setLoading(false);
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
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                />
              </div>
              <div className="form-group">
                <h3 className="input-label">Mot de passe</h3>
                <input
                  type="password"
                  value={motDePasse}
                  onChange={(e) => setMotDePasse(e.target.value)}
                  className="input-field"
                />
              </div>

              <div className="form-group">
                <a
                  href="/verificationToken"
                  onClick={() => handleForgotPassword(email)}
                  style={{
                    color: '#4F5475',
                    fontWeight: 'bold',
                    fontFamily: 'inherit',
                    fontSize: '12px',
                    marginLeft: '-100px',
                    textDecoration: 'underline',
                  }}
                >
                  Mot de passe oublié ?
                </a>
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
