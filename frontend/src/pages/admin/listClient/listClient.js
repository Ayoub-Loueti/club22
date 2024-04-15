import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './listClient.css'; // Assuming this is the correct path to your CSS file
import NavAdmin from '../NavAdmin/navAdmin';
function ListClient() {
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('login');

  useEffect(() => {
    fetchClients();
  }, [filter]);

  const fetchClients = async () => {
    try {
      const response = await axios.get('http://localhost:5000/listCli', {
        headers: {
          Authorization: `Bearer ${JSON.parse(token).token}`,
        },
      });
      const filteredData = filter
        ? response.data.filter((client) => client.etat === filter)
        : response.data;
      setClients(filteredData);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const handleSearchTermChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const handleBlockUnblock = async (id, etat) => {
    const endpoint = etat === 'autorise' ? '/block/' : '/unblock/';
    try {
      await axios.put(
        `http://localhost:5000${endpoint}${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(token).token}`,
          },
        }
      );
      fetchClients(); // Refresh the list after the operation
    } catch (error) {
      console.error('Error updating user state:', error);
    }
  };

  const filteredClients = searchTerm
    ? clients.filter(
        (client) =>
          client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : clients;
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
    <>
    <NavAdmin/>
      <div className="list-client-container">
        <div className="list-client-header">
          <h1>LISTE DES CLIENTS</h1>
          <div className="search-filter-container">
            <input
              type="text"
              className="list-client-search-input"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={handleSearchTermChange}
            />
            <button onClick={() => handleFilterChange('')}>Tous</button>
            <button onClick={() => handleFilterChange('autorise')}>
              Autorisé
            </button>
            <button onClick={() => handleFilterChange('En attente')}>
              En attente
            </button>
            <button onClick={() => handleFilterChange('bloque')}>Bloqué</button>
          </div>
          <div className="navigaate-container">
            <button
              className="list-client-navigate-button"
              onClick={() => navigate('/listEmploye')}
            >
              Les Employés
            </button>
            <button
              className="list-client-navigate-button"
              onClick={() => navigate('/tousLesUtilisateurs')}
            >
              Tous Les Utilisateurs
            </button>
          </div>
        </div>

        <table className="list-client-table">
          <thead>
            <tr>
              <th>Photo</th>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Email</th>
              <th>Genre</th>
              <th>Etat</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map((client) => (
              <tr key={client.id_utilisateur}>
                <td>
                  <img
                    src={
                      client.photo
                        ? `http://localhost:5000/${client.photo}`
                        : 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'
                    }
                    alt="Profil"
                    className="profile-picture"
                  />
                </td>
                <td>
                  {client.nom.charAt(0).toUpperCase() + client.nom.slice(1)}
                </td>
                <td>
                  {client.prenom.charAt(0).toUpperCase() +
                    client.prenom.slice(1)}
                </td>
                <td>{client.email}</td>
                <td>
                  {client.genre.charAt(0).toUpperCase() + client.genre.slice(1)}
                </td>
                <td>
                  <span style={getBadgeStyle(client.etat)}>
                    {client.etat.charAt(0).toUpperCase() + client.etat.slice(1)}
                  </span>
                </td>
                <td>
                  {client.etat !== 'En attente' && (
                    <button
                      className={client.etat === 'bloque' ? 'unblock' : ''}
                      onClick={() =>
                        handleBlockUnblock(client.id_utilisateur, client.etat)
                      }
                    >
                      {client.etat === 'autorise' ? 'Bloquer' : 'Débloquer'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default ListClient;
