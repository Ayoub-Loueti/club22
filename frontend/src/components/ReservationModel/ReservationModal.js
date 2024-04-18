import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import './ReservationModal.css';

Modal.setAppElement('#root');

const RoomDetails = ({ room, updateRoom, deleteRoom, canDelete, isAdherant, remise }) => {
    const incrementAdults = () => {
        if (room.adults < 4) {
            updateRoom(room.id, 'adults', room.adults + 1);
        }
    };

    const decrementAdults = () => {
        updateRoom(room.id, 'adults', Math.max(1, room.adults - 1));
    };

    const incrementChildren = () => {
        if (room.children < 3) {
            updateRoom(room.id, 'children', room.children + 1);
        }
    };

    const decrementChildren = () => {
        updateRoom(room.id, 'children', Math.max(0, room.children - 1));
    };

    const calculateDisplayPrice = (price) => {
        if (isAdherant) {
            return (price * (1 - remise / 100)).toFixed(2);
        }
        return price.toFixed(2);
    };

    return (
        <div className="room-details">
            <h3>Room {room.id}</h3>
            <p>Adult(s): <button onClick={decrementAdults} disabled={room.adults <= 1}>-</button> {room.adults} <button onClick={incrementAdults} disabled={room.adults >= 4}>+</button></p>
            <p>Child(ren): <button onClick={decrementChildren} disabled={room.children <= 0}>-</button> {room.children} <button onClick={incrementChildren} disabled={room.children >= 3}>+</button></p>
            <p>Room price: {calculateDisplayPrice(room.prix)} DT</p>
            {canDelete && <button onClick={() => deleteRoom(room.id)}>Remove Room</button>}
        </div>
    );
};

const ReservationModal = ({ isOpen, onRequestClose, offreId, prix, remise, type, isAdherant }) => {
    const calculateRoomPrice = (adults, children, basePrice, isAdherant) => {
        let priceIncrease = 0;
        if (adults > 1) {
            priceIncrease += (adults - 1) * (basePrice * 0.4);
        }
        priceIncrease += children * (basePrice * 0.2);

        let totalCost = basePrice + priceIncrease;
        if (isAdherant) {
            totalCost -= totalCost * (remise / 100);
        }

        return totalCost;
    };

    const initialRoomPrice = calculateRoomPrice(1, 0, prix, isAdherant);

    const [userInfo, setUserInfo] = useState(null);
    const [rooms, setRooms] = useState([{ id: 1, adults: 1, children: 0, prix: initialRoomPrice }]);
    const [nombre, setNombre] = useState(1);

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

    const handleAddRoom = () => {
        const newRoomId = rooms.length ? rooms[rooms.length - 1].id + 1 : 1;
        const newRoom = { id: newRoomId, adults: 1, children: 0, prix: calculateRoomPrice(1, 0, prix, isAdherant) };
        setRooms([...rooms, newRoom]);
    };

    const handleRemoveRoom = (roomId) => {
        setRooms(rooms.filter(room => room.id !== roomId).map((room, index) => ({ ...room, id: index + 1 })));
    };

    const updateRoom = (roomId, field, value) => {
        const room = rooms.find(room => room.id === roomId);
        const updatedRoom = { ...room, [field]: value };
        updatedRoom.prix = calculateRoomPrice(updatedRoom.adults, updatedRoom.children, prix, isAdherant);
        setRooms(rooms.map(room => room.id === roomId ? updatedRoom : room));
    };

    const handleReservation = async () => {
        const token = JSON.parse(localStorage.getItem('login'))?.token;
        const reservationData = {
            id_offre: offreId,
            hotels: type === 'hotel' ? rooms.map(room => ({
                id: room.id,
                nbr_adults: room.adults,
                nbr_enfants: room.children,
                prix: room.prix
            })) : [],
            nombre: type !== 'hotel' ? nombre : undefined,
            prix_totale: type === 'hotel' ? rooms.reduce((acc, room) => acc + room.prix, 0).toFixed(2) : (nombre * calculateRoomPrice(1, 0, prix, isAdherant)).toFixed(2)
        };

        try {
            await axios.post(
                'http://localhost:5000/reservation',
                reservationData,
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            console.log("Reservation successful");
            onRequestClose();
        } catch (error) {
            console.error("Reservation failed:", error.response?.data || error.message);
        }
    };

    const incrementNombre = () => setNombre(nombre + 1);
    const decrementNombre = () => setNombre(Math.max(1, nombre - 1));

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
            {type === 'hotel' ? (
                rooms.map((room, index) => (
                    <RoomDetails
                        key={room.id}
                        room={room}
                        updateRoom={updateRoom}
                        deleteRoom={handleRemoveRoom}
                        canDelete={rooms.length > 1}
                    />
                ))
            ) : (
                <div className="nombre-people">
                    <p>Nombre de personnes: <button onClick={decrementNombre}>-</button> {nombre} <button onClick={incrementNombre}>+</button></p>
                </div>
            )}
            {type === 'hotel' && <button onClick={handleAddRoom}>+ Add another room</button>}
            <p>Total Price: {type === 'hotel' ? rooms.reduce((acc, room) => acc + room.prix, 0).toFixed(2) : (nombre * calculateRoomPrice(1, 0, prix, isAdherant)).toFixed(2)} DT</p>
            <div className="modal-actions">
                <button onClick={onRequestClose}>Cancel</button>
                <button onClick={handleReservation}>Reserve</button>
            </div>
        </Modal>
    );
};

export default ReservationModal;
