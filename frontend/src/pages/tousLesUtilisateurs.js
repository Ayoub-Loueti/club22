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

  return (
    <div className="tousLesUtilisateurs-container">
      <div className="tousLesUtilisateurs-header">
        <h1>Tous les Utilisateurs</h1>
        <div className="navigation-text">
          <span onClick={() => navigate('/listClient')}>Client</span>
          <span onClick={() => navigate('/listEmploye')}>Employé</span>
        </div>
        <input
          type="text"
          className="search-input"
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
              <td>{utilisateur.nom}</td>
              <td>{utilisateur.prenom}</td>
              <td>{utilisateur.email}</td>
              <td>{utilisateur.type}</td>
              <td>{utilisateur.etat}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TousLesUtilisateurs;
