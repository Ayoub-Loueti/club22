import React, { useEffect } from 'react';
import axios from 'axios';
import loa from '../../../assets/loa.gif';


function Payment() {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const reservationDetails = JSON.parse(decodeURIComponent(urlParams.get('details')));

    const submitPayment = async () => {
      try {
        const response = await axios.post('api/payment', reservationDetails);
        window.location.href = response.data.result.link; // Redirection vers la page de succès ou d'échec
      } catch (err) {
        console.error(err);
        // Gérer l'affichage d'une erreur à l'utilisateur
      }
    };

    submitPayment();
  }, []);

  return (
    <div>
      <img src={loa} alt="Redirection en cours..." />
    </div>
  );
}

export default Payment;