import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import loa from '../../../assets/loa.gif';

function Fail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    localStorage.removeItem('reservationId');
    Swal.fire({
      title: 'Échec!',
      text: searchParams.get('error_message') || 'Erreur de paiement',
      icon: 'error',
      timer: 1500,
      timerProgressBar: true,
      showConfirmButton: false,
      didClose: () => navigate('/mesReservations'),
    });
  }, [navigate, searchParams]);

  return (
    <div>
      <img src={loa} alt="Redirection en cours..." />
    </div>
  );
}

export default Fail;
