import React, { useState } from 'react';
import '../../assets/signup.css';
import ooredoo1Image from '../../assets/ooredoo1.png';
import ooredoo3Image from '../../assets/ooredoo3.png';
import axios from 'axios';
import Swal from 'sweetalert2';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

import {  useNavigate } from 'react-router-dom';

import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { TextField, Button, Container, Box, Typography, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

function Signup() {
 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const theme = useTheme(); // Déplacez useTheme ici
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const navigate = useNavigate(); 


  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    const newPassword = event.target.value;
    setPassword(newPassword);
    updatePasswordValidity(newPassword);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

 const handleSubmit = async (event) => {
   event.preventDefault();

   if (password !== confirmPassword || !isPasswordValid) {
    Swal.fire(
      'Erreur',
      'Le mot de passe ne remplit pas toutes les conditions ou les mots de passe ne correspondent pas.',
      'error'
    );
    return;
  }

   try {
     await axios.post('http://localhost:5000/signup', {
       email,
       motDePasse: password,
     });
     Swal.fire(
       'Succès',
       'Email de vérification envoyé. Veuillez vérifier votre boite email.',
       'success'
     );
navigate("/")
   } catch (error) {
     if (error.response && error.response.status === 400) {
       Swal.fire(
         'Erreur',
         'Un utilisateur avec cet e-mail existe déjà.',
         'error'
       );
     } else {
       Swal.fire(
         'Erreur',
         "Erreur lors de l'inscription. Veuillez réessayer.",
         'error'
       );
     }
   }
 };

 const [isPasswordFocused, setIsPasswordFocused] = useState(false);
 const [isPasswordValid, setIsPasswordValid] = useState(false);

 const hasLength = (password) => password.length >= 12;
 const hasUpperAndLower = (password) => /[A-Z]/.test(password) && /[a-z]/.test(password);
 const hasNumber = (password) => /\d/.test(password);

 const updatePasswordValidity = (password) => {
  // Check all conditions and set the password validity
  const isValid =
    hasLength(password) &&
    hasUpperAndLower(password) &&
    hasNumber(password);
  setIsPasswordValid(isValid);
};

const togglePasswordVisibility = () => {
  setShowPassword(!showPassword);
};

const toggleConfirmPasswordVisibility = () => {
  setShowConfirmPassword(!showConfirmPassword);
};

if (isMobile) {
  return (
    <Box className="signup-page" sx={{
      backgroundColor: '#1e1e1e',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      backgroundImage: `url(${ooredoo3Image})`,
      alignItems: 'center',
    }}>
      <Container maxWidth="sm" sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: { xs: 2, sm: 4 },
      }}>
        <Box sx={{
          width: '100%',
          maxWidth: { sm: '500px' },
          backgroundColor: 'white',
          borderRadius: 2,
          p: 3,
          boxShadow: 3,
          position: 'relative',
        }}>
          <img src={ooredoo1Image} alt="logo ooredoo" style={{ width: '100%', maxWidth: '200px', margin: '0 auto' }} />
          <Typography variant="h5" component="h1" gutterBottom sx={{
            color: '#2B3467',
            fontSize: { xs: '1.25rem', sm: '1.5rem' },
          }}>
            Inscription
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={handleEmailChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Mot de passe"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={handlePasswordChange}
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={() => setIsPasswordFocused(false)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={togglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            {isPasswordFocused && (
              <div style={{ marginTop: '0.1rem' }} className="password-validation-popup">
                <p>
                  <FontAwesomeIcon icon={faExclamationCircle} /> Le mot de passe doit avoir:
                </p>
                <ul>
                  <li className={hasLength(password) ? 'valid' : 'invalid'}>
                    <span className="icon"></span>12 caractères ou plus
                  </li>
                  <li className={hasUpperAndLower(password) ? 'valid' : 'invalid'}>
                    <span className="icon"></span>des majuscules et des minuscules
                  </li>
                  <li className={hasNumber(password) ? 'valid' : 'invalid'}>
                    <span className="icon"></span>au moins un chiffre
                  </li>
                </ul>
              </div>
            )}
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirmer votre mot de passe"
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              autoComplete="current-password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={toggleConfirmPasswordVisibility}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 1.8, mb: 2,
                backgroundColor: '#191F43',
                '&:hover': {
                  backgroundColor: '#someDarkerColor',
                },
                fontSize: { xs: '0.875rem', sm: '1rem' },
              }}
            >
              S'inscrire
            </Button>
            <Typography
              sx={{
                textAlign: 'center',
                color: '#4F5475',
                fontWeight: 'bold',
                mt: 1,
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
              }}
            >
              Vous avez déjà un compte ?&nbsp;
              <a href="/" style={{
                color: 'red',
                textDecoration: 'none',
              }}>
                Connectez-vous
              </a>
            </Typography>
            <a
              href="http://localhost:5000/auth/google"
              className="google-auth-link"
              style={{
                display: 'block',
                textAlign: 'center',
                marginTop: '20px',
                textDecoration: 'none',
                color: '#191F43',
                fontWeight: 'bold',
              }}
            >
              Connectez-vous avec Google
            </a>
          </Box>
        </Box>
      </Container>
    </Box>
  );
} else {
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
                  pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
                  title="Veuillez inclure un '@' et un domaine dans l'adresse e-mail. Par exemple : utilisateur@exemple.com"
                  placeholder="utilisateur@exemple.com"
                />
              </div>
              <div className="form-group">
              <h3 className="signup-input-label">Mot de passe</h3>
              <input
               type={showPassword ? "text" : "password"}
                value={password}
                onChange={handlePasswordChange}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
                className="signup-input-field"
                required
              />
               <span onClick={togglePasswordVisibility} style={{ cursor: 'pointer', position: 'absolute', right: '60px', top: '257px' }}>
          <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} style={{ color: '#4F5475' }} />
        </span>
        {isPasswordFocused && (
                  <div className="password-validation-popup">
                    <p>
                      {' '}
                      <FontAwesomeIcon icon={faExclamationCircle} /> Le mot de
                      passe doit avoir:
                    </p>
                    <ul>
                      <li className={hasLength(password) ? 'valid' : 'invalid'}>
                        <span className="icon"></span>12 caractères ou plus
                      </li>
                      <li
                        className={
                          hasUpperAndLower(password) ? 'valid' : 'invalid'
                        }
                      >
                        <span className="icon"></span>des majuscules et des
                        minuscules
                      </li>
                      <li className={hasNumber(password) ? 'valid' : 'invalid'}>
                        <span className="icon"></span>au moins un chiffre
                      </li>
                    </ul>
                  </div>
                )}
              </div>
              <div className="form-group">
                <h3 className="signup-input-label">
                  Confirmer votre mot de passe
                </h3>
                <input
                   type={showConfirmPassword ? "text" : "password"}
                   value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  className="signup-input-field"
                  required
                />
                 <span onClick={toggleConfirmPasswordVisibility} style={{ cursor: 'pointer', position: 'absolute', right: '60px', top: '344px' }}>
          <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} style={{ color: '#4F5475' }} />
        </span>
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
                  top: '77%',
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
                  top: '92%',
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
      <div className="signup-white-square"></div>{' '}
    </div>
  );
}
}

export default Signup;