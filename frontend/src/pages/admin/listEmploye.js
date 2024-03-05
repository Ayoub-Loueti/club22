import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../assets/listEmployE.css'
function ListEmploye() {
  const [Employes, setEmployes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('login');

  useEffect(() => {
    fetchEmployes();
  }, [filter]);

  const fetchEmployes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/listEmp', {
        headers: {
          Authorization: `Bearer ${JSON.parse(token).token}`,
        },
      });
      const filteredData = filter
        ? response.data.filter((Employe) => Employe.etat === filter)
        : response.data;
      setEmployes(filteredData);
    } catch (error) {
      console.error('Error fetching Employes:', error);
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
      fetchEmployes(); // Refresh the list after the operation
    } catch (error) {
      console.error('Error updating user state:', error);
    }
  };

  const filteredEmployes = searchTerm
    ? Employes.filter(
        (Employe) =>
          Employe.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          Employe.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          Employe.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : Employes;
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
    <div className="list-Employe-container">
      <div className="list-Employe-header">
        <h1>LISTE DES EMPLOYES</h1>
        <div className="search-filter-contaiiner">
          <input
            type="text"
            className="list-Employe-search-input"
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
            className="list-Employe-navigate-button"
            onClick={() => navigate('/listClient')}
          >
            Les Clients
          </button>
          <button
            className="list-Employe-navigate-button"
            onClick={() => navigate('/tousLesUtilisateurs')}
          >
            Tous Les Utilisateurs
          </button>
        </div>
      </div>

      <table className="list-Employe-table">
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
          {filteredEmployes.map((Employe) => (
            <tr key={Employe.id_utilisateur}>
              <td>
                <img
                  src={
                    Employe.photo
                      ? `http://localhost:5000/${Employe.photo}`
                      : 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'
                  }
                  alt="Profil"
                  className="profile-picture"
                />
              </td>
              <td>
                {' '}
                {Employe.nom.charAt(0).toUpperCase() + Employe.nom.slice(1)}
              </td>
              <td>
                {Employe.prenom.charAt(0).toUpperCase() +
                  Employe.prenom.slice(1)}{' '}
              </td>
              <td>{Employe.email}</td>
              <td>
                {' '}
                {Employe.genre.charAt(0).toUpperCase() + Employe.genre.slice(1)}
              </td>
              <td>
                <span style={getBadgeStyle(Employe.etat)}>
                  {Employe.etat.charAt(0).toUpperCase() + Employe.etat.slice(1)}
                </span>
              </td>{' '}
              <td>
                {Employe.etat !== 'En attente' && (
                  <button
                    className={Employe.etat === 'bloque' ? 'unblock' : ''}
                    onClick={() =>
                      handleBlockUnblock(Employe.id_utilisateur, Employe.etat)
                    }
                  >
                    {Employe.etat === 'autorise' ? 'Bloquer' : 'Débloquer'}
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

export default ListEmploye;
