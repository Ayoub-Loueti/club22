import React from 'react';
import { useSearchParams } from 'react-router-dom';

function Fail() {
  const [searchParams] = useSearchParams();
  const errorMessage =
    searchParams.get('error_message') || 'Erreur de paiement';

  return (
    <div>
      <div>Échec du paiement</div>
      <div>{errorMessage}</div>
    </div>
  );
}

export default Fail;
