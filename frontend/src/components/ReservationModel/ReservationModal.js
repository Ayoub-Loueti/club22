import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import './ReservationModal.css';

Modal.setAppElement('#root');

const ReservationModal = ({ isOpen, onRequestClose, offreId, prix, remise , type }) => {
    const [userInfo, setUserInfo] = useState(null);
    const [nombre, setNombre] = useState(1); // Start with 1 person as minimum
    
    // Calculate the discounted price
    const discountedPrix = prix - (prix * (remise / 100));
    const prixTotal = discountedPrix * nombre; // Calculate directly in render

    useEffect(() => {
        const token = localStorage.getItem('login');
        const storedUserId = JSON.parse(localStorage.getItem('userId'));

        if (token && storedUserId) {
            const fetchUserData = async () => {
                try {
                    const response = await axios.get(
                        `http://localhost:5000/profil/${storedUserId}`,
                        { headers: { Authorization: `Bearer ${JSON.parse(token).token}` } }
                    );
                    setUserInfo(response.data.user);
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            };
            fetchUserData();
        }
    }, []);

    const handleReservation = async () => {
        const token = JSON.parse(localStorage.getItem('login'))?.token;
        try {
            await axios.post(
                'http://localhost:5000/reservation',
                { id_offre: offreId, nombre, prix_totale: prixTotal },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            console.log("Reservation successful");
            onRequestClose();
        } catch (error) {
            console.error("Reservation failed:", error.response?.data || error.message);
        }
    };

    const increment = () => setNombre(prev => prev + 1);
    const decrement = () => setNombre(prev => (prev > 1 ? prev - 1 : 1));  // Prevent going below 1

    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '40%',
            border: '1px solid #ccc',
            background: '#fff',
            overflow: 'auto',
            borderRadius: '10px',
            outline: 'none',
            padding: '20px',
        },
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(3px)',
        },
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            style={customStyles}
            contentLabel="Reservation Modal"
        >
            <div className="modal-user-info">
                {userInfo && (
                    <>
                        <img
                            src={userInfo.photo ? `http://localhost:5000/${userInfo.photo}` : 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'}
                            alt="User"
                            className="modal-user-photo"
                        />
                        <div className="modal-user-details">
                            <p>Nom: {userInfo.nom}</p>
                            <p>Prénom: {userInfo.prenom}</p>
                            <p>Email: {userInfo.email}</p>
                        </div>
                    </>
                )}
            </div>
            <div className="modal-reservation-details">
                <p>Nombre de personnes: <button onClick={decrement}>-</button> {nombre} <button onClick={increment}>+</button></p>
                <p>Prix total after {remise}% discount: {prixTotal.toFixed(2)} DT</p>
            </div>
            <div className="modal-actions">
                <button type="button" onClick={onRequestClose}>Annuler</button>
                <button type="button" onClick={handleReservation}>Réserver</button>
            </div>
        </Modal>
    );
};

export default ReservationModal;
