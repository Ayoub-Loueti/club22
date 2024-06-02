import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
import loa from '../../../assets/loa.gif';

function Success() {
  const navigate = useNavigate();
  const paymentId = new URLSearchParams(window.location.search).get(
    'payment_id'
  );
  const reservationId = localStorage.getItem('reservationId');

  useEffect(() => {
    if (paymentId && reservationId) {
      axios
        .post(`api/payment/${paymentId}`)
        .then((res) => {
          if (res.data.result.status === 'SUCCESS') {
            axios
              .put(
                `http://54.242.240.123/reservations/${reservationId}/payereserv`
              )
              .then(() => {
                Swal.fire({
                  title: 'Succès!',
                  text: 'Le paiement a été effectué avec succès.',
                  icon: 'success',
                  timer: 1500,
                  timerProgressBar: true,
                  showConfirmButton: false, // Suppression du bouton "OK"
                  didClose: () => navigate('/mesReservations'),
                });
                localStorage.removeItem('reservationId');
              })
              .catch((updateErr) => {
                console.error('Error updating payment status:', updateErr);
                Swal.fire(
                  'Échec!',
                  'Échec de la mise à jour du statut de paiement.',
                  'error'
                );
              });
          } else {
            Swal.fire('Échec!', 'Le paiement a échoué.', 'error');
          }
        })
        .catch((err) => {
          console.error(err);
          Swal.fire(
            'Échec!',
            'Erreur lors de la vérification du paiement.',
            'error'
          );
        });
    } else {
      Swal.fire(
        'Attention!',
        'ID de réservation non trouvé dans le stockage local.',
        'warning'
      );
    }
  }, [navigate, paymentId, reservationId]);

  return (
    <div>
      <img src={loa} alt="Redirection en cours..." />
    </div>
  );
}

export default Success;
