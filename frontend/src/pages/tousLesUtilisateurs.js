import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../assets/tousLesUtilisateurs.css';
import '../components/navbar';

function TousLesUtilisateurs() {
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('login');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/allUsers', {
          headers: {
            Authorization: `Bearer ${JSON.parse(token).token}`,
          },
        });
        setUtilisateurs(response.data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    if (token) {
      fetchUsers();
    }
  }, [token]);

  const filteredUsers = utilisateurs.filter(
    (utilisateur) =>
      utilisateur.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      utilisateur.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      utilisateur.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
   const getBadgeStyle = (etat) => {
     let backgroundColor;
     switch (
       etat.toLowerCase() // Utilisation de toLowerCase pour une comparaison insensible à la casse
     ) {
       case 'autorise':
         backgroundColor = '#34c38f'; 
         break;
       case 'en attente':
         backgroundColor = '#ffecb3';
         break;
       case 'bloque':
         backgroundColor = '#f8d7da';
         break;
       default:
         backgroundColor = '#adb5bd'; 
     }

     return {
       backgroundColor,
       color: '#000', 
       padding: '0.25em 0.6em',
       borderRadius: '50rem',
       fontSize: '0.90rem',
       minWidth: '75px', 
       textAlign: 'center', 
       display: 'inline-block', // Assure que le badge prend en compte la largeur et le padding
     };
   };

  return (
    <div className="tousLesUtilisateurs-container">
      <div className="tousLesUtilisateurs-header">
        <h1>TOUS LES UTILISATEURS</h1>
        <div className="navigation-buttons">
          <button onClick={() => navigate('/listClient')}>Client</button>
          <button onClick={() => navigate('/listEmploye')}>Employé</button>
        </div>
        <input
          type="text"
          className="tousLesUtilisateurs-search-inpuut"
          placeholder="Rechercher..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <table className="utilisateurs-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Photo</th>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Email</th>
            <th>Type</th>
            <th>Etat</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((utilisateur, index) => (
            <tr key={index}>
              <td>{utilisateur.id_utilisateur}</td>
              <td>
                <img
                  src={
                    utilisateur.photo
                      ? `http://localhost:5000/${utilisateur.photo}`
                      : 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'
                  }
                  alt="Profil"
                  className="profile-picture"
                />
              </td>
              <td>
                {utilisateur.nom.charAt(0).toUpperCase() +
                  utilisateur.nom.slice(1)}
              </td>
              <td>
                {utilisateur.prenom.charAt(0).toUpperCase() +
                  utilisateur.prenom.slice(1)}
              </td>
              <td>{utilisateur.email}</td>
              <td>
                {' '}
                {utilisateur.type.charAt(0).toUpperCase() +
                  utilisateur.type.slice(1)}
              </td>
              <td>
                <span style={getBadgeStyle(utilisateur.etat)}>
                  {utilisateur.etat.charAt(0).toUpperCase() +
                    utilisateur.etat.slice(1)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TousLesUtilisateurs;
