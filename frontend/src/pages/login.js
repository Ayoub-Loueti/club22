import React, { useState } from 'react';
import '../assets/login.css';
import ooredoo1Image from '../assets/ooredoo1.png';
import ooredoo3Image from '../assets/ooredoo3.png';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Add your login logic here
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
            left: '23px',
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
              Log In
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <h3 className="input-label">Utilisateur</h3>
                <input
                  type="text"
                  value={username}
                  onChange={handleUsernameChange}
                  className="input-field"
                />
              </div>
              <div className="form-group">
                <h3 className="input-label">Mot de passe</h3>
                <input
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  className="input-field"
                />
              </div>

              <div className="form-group">
                <input
                  type="checkbox"
                  id="remember-me"
                  style={{ marginRight: '10px' }}
                />
                <label htmlFor="remember-me" style={{ color: '#4F5475' }}>
                  Rester connecté
                </label>
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
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  position: 'absolute',
                  top: '80%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: '1',
                }}
              >
                log in
              </button>
            </form>
          </div>
        </div>              <div style={{ textAlign: 'center', marginTop: '20px', color: '#4F5475' }}>OU</div>

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
