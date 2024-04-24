import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Modal from 'react-modal';
import { Button, TextField, Checkbox, FormControlLabel, Typography, Avatar, Box } from '@mui/material';

Modal.setAppElement('#root');

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    border: '1px solid #ccc',
    background: '#fff',
    overflow: 'auto',
    borderRadius: '4px',
    outline: 'none',
    padding: '20px',
    width: '520px',
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
                    console.error("Error fetching data:", error);
                    Swal.fire('Error', 'Failed to fetch data.', 'error');
                }
            };
            fetchData();
        }
    }, [isOpen]);

    const handleDemande = async () => {
        if (!description.trim()) {
            Swal.fire('Validation Error', 'Please enter a description for your demande.', 'info');
            return;
        }
        if (!acceptedTerms) {
            Swal.fire('Terms and Conditions', 'You must accept the terms and conditions to proceed.', 'warning');
            return;
        }

        const token = JSON.parse(localStorage.getItem('login'))?.token;
        try {
            await axios.post('http://localhost:5000/demandes', { userId, description }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            Swal.fire('Success', 'Your demande has been successfully submitted.', 'success').then(result => {
                if (result.isConfirmed || result.isDismissed) {
                    onRequestClose();
                }
            });
        } catch (error) {
            Swal.fire('Failed', 'Your demande could not be submitted. Please try again.', 'error');
            console.error("Failed to submit demande:", error.response?.data || error.message);
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
                {isAdherant ? "Annulation du contrat adhérant" : "Demande pour devenir un adhérant"}
            </Typography>
            {userInfo && (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 2 }}>
                    <Avatar src={userInfo.photo ? `http://localhost:5000/${userInfo.photo}` : 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'} alt="User" sx={{ width: 56, height: 56, marginBottom: 2 }} />
                    <Typography variant="subtitle1">{userInfo.nom} {userInfo.prenom}</Typography>
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
            <Typography component="div" variant="body2" sx={{ maxHeight: '150px', overflowY: 'auto', border: '1px solid #ccc', padding: 2, borderRadius: 1, my: 2 }}>
                <strong>Terms and Conditions:</strong> By checking this box, you agree to the terms and conditions set forth by our platform. These include, but are not limited to, the following:
                <ol>
                    <li>Adherence to local and international laws.</li>
                    <li>Accurate and truthful declaration of information.</li>
                    <li>Understanding that terms may change without notice.</li>
                    <li>Your data will be handled per our privacy policy.</li>
                </ol>
            </Typography>
            <FormControlLabel
                control={<Checkbox checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} />}
                label="I have read and accept the terms and conditions."
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button onClick={onRequestClose}>Cancel</Button>
                <Button onClick={handleDemande} disabled={!acceptedTerms} variant="contained" color="primary">Submit</Button>
            </Box>
        </Modal>
    );
};

export default DemandeModal;
