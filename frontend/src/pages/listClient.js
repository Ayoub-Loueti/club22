import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../assets/listClient.css'; // Assuming this is the correct path to your CSS file

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
      await axios.put(`http://localhost:5000${endpoint}${id}`, {}, {
        headers: {
          Authorization: `Bearer ${JSON.parse(token).token}`,
        },
      });
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

  return (
    <div className="list-client-container">
      <div className="list-client-header">
        <h1>Liste des Clients</h1>
        <div className="search-filter-container">
          <input
            type="text"
            className="search-input"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={handleSearchTermChange}
          />
          <button onClick={() => handleFilterChange('')}>Tous</button>
          <button onClick={() => handleFilterChange('autorise')}>Autorisé</button>
          <button onClick={() => handleFilterChange('attend')}>En attente</button>
          <button onClick={() => handleFilterChange('bloque')}>Bloqué</button>
        </div>
        <div className="navigate-container">
          <span className="navigate-employe" onClick={() => navigate('/listEmploye')}>Les Employé</span>
          <span className="navigate-employe" onClick={() => navigate('/tousLesUtilisateurs')}>Tous Les Utilisateurs</span>
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
              <td>{client.photo}</td>
              <td>{client.nom}</td>
              <td>{client.prenom}</td>
              <td>{client.email}</td>
              <td>{client.genre}</td>
              <td>{client.etat}</td>
              <td>
                {client.etat !== 'attend' && (
                  <button
                    className={client.etat === 'bloque' ? 'unblock' : ''}
                    onClick={() => handleBlockUnblock(client.id_utilisateur, client.etat)}
                  >
                    {client.etat === 'autorise' ? 'Block' : 'Unblock'}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ListClient;
