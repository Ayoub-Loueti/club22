import React, { useState , useEffect } from 'react';
import axios from 'axios';
import {useNavigate } from 'react-router-dom';

import '../../assets/login.css';
import ooredoo1Image from '../../assets/ooredoo1.png';
import ooredoo3Image from '../../assets/ooredoo3.png';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { TextField, Button, Container, Box, Typography, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

function Login() {
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false); // New state for managing resend button disabled state
  const [countdown, setCountdown] = useState(30); 
  const [showConfirmationMessage, setShowConfirmationMessage] = useState(false);
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);
  const [showPassword, setShowPassword] = useState(false);
  const theme = useTheme(); // Déplacez useTheme ici
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleForgotPassword = async () => {
    if (!email) {
      MySwal.fire(
        'Attention',
        'Veuillez entrer une adresse e-mail.',
        'warning'
      );
      return;
    }
    try {
      await axios.post('http://localhost:5000/forgot-password', { email });
      MySwal.fire(
        'Succès',
        'Email de réinitialisation du mot de passe envoyé.',
        'success'
      );
      navigate(`/verificationToken/${email}`);
    } catch (error) {
      let message = 'Une erreur est survenue. Veuillez réessayer.';
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        message = error.response.data.message;
      }
      MySwal.fire('Erreur', message, 'error');
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
      const { token, user,shouldUpdateProfile} = response.data;
      localStorage.setItem('login', JSON.stringify({ isAuthenticated: true, token }));
      localStorage.setItem('userId', JSON.stringify(user.id_utilisateur.toString())); // Store user ID upon login
      localStorage.setItem('userType', JSON.stringify(user.type)); // Storing the user type in local storage

      setLoading(false);
      if (shouldUpdateProfile){
navigate ('/insererNom')
      }else 
     { navigate(`/profil/${user.id_utilisateur}`); }
    } catch (error) {
      setLoading(false);
      if (error.response) {
        // Account is temporarily locked
        if (error.response.data.error.includes('temporairement bloqué')) {
          Swal.fire({
            title: 'Compte Temporairement Bloqué',
            text: 'Votre compte est temporairement bloqué. Veuillez réessayer plus tard.',
            icon: 'warning',
            confirmButtonText: 'Ok',
          });
        } 
        // Account is blocked
        else if (error.response.data.error.includes('bloqué')) {
          Swal.fire({
            title: 'Compte Bloqué',
            text: 'Votre compte est bloqué. Veuillez contacter l’administrateur.',
            icon: 'error',
            confirmButtonText: 'Ok',
          });
        }
else if (error.response.data.error.includes('n’est pas autorisé')) {
  Swal.fire({
    title: 'Compte Non Autorisé',
    html: `
      <p>Le compte utilisateur n’est pas autorisé à se connecter.</p>
      <button id="resendEmailBtn" class="swal2-confirm swal2-styled"
        style="border: 0; display: block; margin: 10px auto; padding: 10px 20px;">
        Renvoyer l'email (${countdown})
      </button>
    `,
    icon: 'error',
    showConfirmButton: false,  // Hide the default confirm button
    didOpen: () => {
      const btn = document.getElementById('resendEmailBtn');
      btn.disabled = resendDisabled;
      btn.addEventListener('click', () => {
        handleResendEmail();
        btn.innerText = 'Renvoyer l\'email (' + countdown + ')';
      });
    },
    willClose: () => {
      if (document.getElementById('resendEmailBtn')) {
        document.getElementById('resendEmailBtn').removeEventListener('click', handleResendEmail);
      }
    }
  });
}
        // Incorrect password or other login errors
        else {
          Swal.fire({
            title: 'Échec de la connexion',
            text: error.response.data.error || 'Une erreur est survenue. Veuillez réessayer.',
            icon: 'error',
            confirmButtonText: 'Réessayer',
          });
        }
      } else {
        // Handle errors without a response (like network issues)
        Swal.fire({
          title: 'Erreur Réseau',
          text: 'Veuillez vérifier votre connexion Internet et réessayer.',
          icon: 'error',
          confirmButtonText: 'Ok',
        });
      }
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
     setCountdown(30);
   }
   return () => clearInterval(interval);
 }, [resendDisabled, countdown]);

 const handleResendEmail = async () => {
   setResendDisabled(true);
   try {
     await axios.post('http://localhost:5000/resendEmail', { email });
     MySwal.fire(
       'Email envoyé',
       'Veuillez vérifier votre boîte de réception',
       'success'
     );
   } catch (error) {
     console.error("Erreur lors du renvoi de l'email:", error);
     MySwal.fire('Erreur', "Impossible de renvoyer l'email", 'error');
   }
 };

 const togglePasswordVisibility = () => {
  setShowPassword(!showPassword);
};

if (isMobile) {
  return (
    <Box className="login-page" sx={{
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
      }}>
        <Box sx={{
          height: '54vh',
          backgroundColor: 'white',
          borderRadius: 2,
          p: 4,
          boxShadow: 3,
          position: 'relative',
          minWidth: { md: '500px' },
        }}>
          <img src={ooredoo1Image} alt="logo ooredoo" />
          <Typography variant="h3" component="h1" gutterBottom  style={{
          color: '#2B3467',
             }}>
            Connexion
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
              onChange={(e) => setEmail(e.target.value)}
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
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
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
        marginLeft: '-120px',
        textDecoration: 'underline',
        cursor: email ? 'pointer' : 'not-allowed',
      }}
    >
      Mot de passe oublié ?
    </button>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 1.8, mb: 2 , backgroundColor: '#191F43', // Custom background color
              '&:hover': {
                backgroundColor: '#someDarkerColor', // Darken the color slightly on hover
              },}}
            >
              Se connecter
            </Button>
            <Typography
  sx={{
    textAlign: 'center',
    color: '#4F5475',
    fontWeight: 'bold',
    mt: 1,
  }}
>
  Vous n'avez pas de compte ?&nbsp;
  <a href="/signup" style={{
    color: 'red', // Make the link red
    textDecoration: 'none',
    fontSize: '0.875rem' // Make the font size smaller
  }}>
    Inscrivez-vous
  </a>
</Typography>

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
          </Box>
          {/* Add other elements here */}
        </Box>
        {/* Add the right-side panel here */}
      </Container>
    </Box>
  );
} else {
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
                   type={showPassword ? "text" : "password"}
                   value={motDePasse}
                  onChange={(e) => setMotDePasse(e.target.value)}
                  className="input-field"
                  required
                />
                 <span onClick={togglePasswordVisibility} style={{ cursor: 'pointer', position: 'absolute', right: '60px', top: '257px' }}>
          <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} style={{ color: '#4F5475' }} />
        </span>
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
  <div className="activation-message-container">
    <p>
       activer votre compte.
       <button
              onClick={handleResendEmail}
              disabled={resendDisabled}
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
}

export default Login;
