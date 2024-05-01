import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Modal from 'react-modal';
import { Button, TextField, Checkbox, FormControlLabel, Avatar, Box } from '@mui/material';
import { Typography } from '@mui/material';

import SignaturePad from '../Signature/signaturePad';
Modal.setAppElement('#root');

const customStyles = {
  content: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    border: '1px solid #ccc',
    background: '#fff',
    overflowY: 'auto', // Ensure vertical scroll is available if content is taller than max height
    borderRadius: '4px',
    outline: 'none',
    padding: '20px',
    width: '620px', // Adjust width as needed
    maxHeight: '80vh',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
};

const DemandeModal = ({ isOpen, onRequestClose, userId }) => {
    const [description, setDescription] = useState('');
    const [userInfo, setUserInfo] = useState(null);
    const [isAdherant, setIsAdherant] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [signatureUrl, setSignatureUrl] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('login');
        const storedUserId = JSON.parse(localStorage.getItem('userId'));

        if (token && storedUserId) {
            const fetchData = async () => {
                try {
                    const headers = { Authorization: `Bearer ${JSON.parse(token).token}` };

                    const userResponse = await axios.get(`http://localhost:5000/profil/${storedUserId}`, { headers });
                    setUserInfo(userResponse.data.user);

                    const adherantResponse = await axios.get(`http://localhost:5000/isAdherant`, { headers });
                    setIsAdherant(adherantResponse.data.adherant);
                } catch (error) {
                 console.error(
                   'Erreur lors de la récupération des données :',
                   error
                 );
                 Swal.fire(
                   'Erreur',
                   'Échec de la récupération des données.',
                   'error'
                 );

                }
            };
            fetchData();
        }
    }, [isOpen]);

    const handleDemande = async () => {
        
        if (!description.trim() || !signatureUrl) {
         Swal.fire(
           'Erreur de validation',
           'Veuillez saisir une description et signer avant de soumettre.',
           'info'
         );

          return;
        }
        if (!acceptedTerms) {
Swal.fire(
  'Conditions générales',
  'Vous devez accepter les conditions générales pour continuer.',
  'warning'
);
            return;
        }

        const token = JSON.parse(localStorage.getItem('login'))?.token;
        try {
            await axios.post(
              'http://localhost:5000/demandes',
              { userId, description, signature: signatureUrl },
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
Swal.fire('Succès', 'Votre demande a été soumise avec succès.', 'success').then(
  (result) => {
    if (result.isConfirmed || result.isDismissed) {
      onRequestClose();
    }
  }
);
        } catch (error) {
          Swal.fire(
            'Échec',
            "Votre demande n'a pas pu être soumise. Veuillez réessayer.",
            'error'
          );
          console.error(
            'Échec de la soumission de la demande :',
            error.response?.data || error.message
          );

        }
    };

    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        style={customStyles}
        contentLabel="Demande Modal"
      >
        <Typography variant="h6" component="h2">
          {isAdherant
            ? 'Annulation du contrat adhérant'
            : 'Demande pour devenir un adhérant'}
        </Typography>

        {userInfo && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginBottom: 2,
            }}
          >
            <Avatar
              src={
                userInfo.photo
                  ? `http://localhost:5000/${userInfo.photo}`
                  : 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'
              }
              alt="User"
              sx={{ width: 56, height: 56, marginBottom: 2 }}
            />
            <Typography variant="subtitle1">
              {userInfo.nom} {userInfo.prenom}
            </Typography>
            <Typography variant="body2">{userInfo.email}</Typography>
          </Box>
        )}
        <TextField
          fullWidth
          multiline
          rows={4}
          placeholder="Entrez la description de votre demande ici"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          margin="normal"
        />
        <Typography
          component="div"
          variant="body2"
          sx={{
            maxHeight: '150px',
            overflowY: 'auto',
            border: '1px solid #ccc',
            padding: 2,
            borderRadius: 1,
            my: 2,
          }}
        >
          <strong>Conditions générales :</strong> En cochant cette case, vous
          acceptez les conditions générales établies par notre plateforme.
          Celles-ci comprennent, mais ne se limitent pas à, ce qui suit :
          <ol>
            <li>Respect des lois locales et internationales.</li>
            <li>Déclaration précise et véridique des informations.</li>
            <li>Compréhension que les termes peuvent changer sans préavis.</li>
            <li>
              Vos données seront traitées conformément à notre politique de
              confidentialité.
            </li>
          </ol>
        </Typography>
        <FormControlLabel
          control={
            <Checkbox
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
            />
          }
          label="J'ai lu et j'accepte les conditions générales."
        />
        <SignaturePad setSignatureUrl={setSignatureUrl} />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button onClick={onRequestClose}>Annuler</Button>
          <Button
            onClick={handleDemande}
            disabled={!acceptedTerms}
            variant="contained"
            color="primary"
          >
            Soumettre{' '}
          </Button>
        </Box>
      </Modal>
    );
};

export default DemandeModal;
