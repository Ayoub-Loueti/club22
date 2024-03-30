import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ListReservation() {
  const [reservations, setReservations] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('login');

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await axios.get('http://localhost:5000/reservations', {
        headers: {
          Authorization: `Bearer ${JSON.parse(token).token}`,
        },
      });
      setReservations(response.data);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    }
  };

  const downloadPDF = async (reservationId) => {
  try {
    const response = await axios.get(`http://localhost:5000/reservation/pdf/${reservationId}`, {
      responseType: 'blob',
      headers: {
        Authorization: `Bearer ${JSON.parse(token).token}`,
      },
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `reservation_${reservationId}.pdf`);
    document.body.appendChild(link);
    link.click();
  } catch (error) {
    console.error('Error downloading PDF:', error);
  }
};

  return (
    <div className="list-client-container">
      <h1>LISTE DES RÉSERVATIONS</h1>
      <div className="reservations-container">
        {reservations.map((reservation) => (
          <div key={reservation.id_reservation} className="reservation-card">
            <h3>{`Réservation #${reservation.id_reservation}`}</h3>
            <p><strong>Date de réservation:</strong> {new Date(reservation.date_reservation).toLocaleDateString()}</p>
            <p><strong>État:</strong> {reservation.etat}</p>
            <p><strong>Offre:</strong> {reservation.offre.titre}</p>
            <p><strong>Collaborateur:</strong> {reservation.offre.collaborateur.nom}</p>
            <button onClick={() => downloadPDF(reservation.id_reservation)}>Télécharger PDF</button>
          </div>
        ))}
      </div>
      <div className="navigate-container">
        <button className="list-client-navigate-button" onClick={() => navigate('/listEmploye')}>
          Les Employés
        </button>
        <button className="list-client-navigate-button" onClick={() => navigate('/tousLesUtilisateurs')}>
          Tous Les Utilisateurs
        </button>
      </div>
    </div>
  );
}

export default ListReservation;
