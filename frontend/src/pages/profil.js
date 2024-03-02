import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../assets/profil.css';
function Profil() {
  const token = localStorage.getItem('login');
    const [utilisateur, setUtilisateur] = useState([]);


   useEffect(() => {
     const fetchUserData = async () => {
       try {
         const response = await axios.get('http://localhost:5000/profil', {
           headers: {
            Authorization: `Bearer ${JSON.parse(token).token}`,
           },
         });
         setUtilisateur(response.data.user); 
       } catch (error) {
         console.error(
           "Erreur lors de la récupération des données de l'utilisateur",
           error
         );
       }
     };
 if (token) {
     fetchUserData();
 }
   }, [token]);

  return (
    <div className="profile-container">
      <div className="profile-header">
        {utilisateur.photo ? (
          <img
            src={utilisateur.photo}
            alt="Profil"
            className="profile-picture"
          />
        ) : (
          <div className="profile-picture"></div>
        )}
        <h1>{`${utilisateur.nom} ${utilisateur.prenom}`}</h1>
        <p>{utilisateur.email}</p>{' '}
      </div>
      <div className="profile-stats">
        <div className="stat">
          <h3>Followers</h3>
          <p>1000</p>
        </div>
        <div className="stat">
          <h3>Following</h3>
          <p>500</p>
        </div>
        <div className="stat">
          <h3>Posts</h3>
          <p>500</p>
        </div>
      </div>
      <div className="profile-bio">
        <h2>Biographie</h2>
        <p>Description de l'utilisateur.</p>
      </div>
      <div className="profile-info">
        <div className="info-item">
          <span className="info-label">Nom:</span>
          <span className="info-value">{utilisateur.nom}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Prénom:</span>
          <span className="info-value">{utilisateur.prenom}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Email:</span>
          <span className="info-value">{utilisateur.email}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Genre:</span>
          <span className="info-value">{utilisateur.genre}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Vous êtes:</span>
          <span className="info-value">{utilisateur.type}</span>
        </div>
        {/* Ajoutez d'autres informations ici */}
      </div>
      {/* Ajout d'un séparateur */}
      <div className="separator"></div>
    </div>
  );
}

export default Profil;
