import React from 'react';
import OffreAdmin from './offreAdmin';

function OffreCollab({ collaborateurId }) {
  
  return (
    <OffreAdmin
      isCollabMode={true}
      collaborateurId={collaborateurId}
      onOffreAddedOrUpdated={() => {
      }}
      
    />
  );
}

export default OffreCollab;
