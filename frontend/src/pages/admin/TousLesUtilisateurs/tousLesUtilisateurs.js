import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  MaterialReactTable,
  createMRTColumnHelper,
} from 'material-react-table';
import NavAdmin from '../NavAdmin/navAdmin';
import './tousLesUtilisateurs.css';
import { MRT_Localization_FR } from 'material-react-table/locales/fr';

const columnHelper = createMRTColumnHelper();

function TousLesUtilisateurs() {
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('login');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://54.242.240.123/allUsers', {
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

  const columns = [
    columnHelper.accessor('id_utilisateur', {
      header: 'ID',
    }),
    columnHelper.accessor('photo', {
      header: 'Photo',
      Cell: ({ row }) => (
        <img
          src={
            row.original.photo
              ? `http://54.242.240.123/${row.original.photo}`
              : 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'
          }
          alt="Profil"
          style={{ width: 50, height: 50, borderRadius: '50%' }}
          onClick={() => navigate(`/profil/${row.original.id_utilisateur}`)}
        />
      ),
    }),
    columnHelper.accessor('nom', {
      header: 'Nom',
      Cell: ({ row }) => (
        <span
          onClick={() => navigate(`/profil/${row.original.id_utilisateur}`)}
          style={{ cursor: 'pointer' }}
        >
          {row.original.nom}
        </span>
      ),
    }),
    columnHelper.accessor('prenom', {
      header: 'Prénom',
      Cell: ({ row }) => (
        <span
          onClick={() => navigate(`/profil/${row.original.id_utilisateur}`)}
          style={{ cursor: 'pointer' }}
        >
          {row.original.prenom}
        </span>
      ),
    }),
    columnHelper.accessor('email', {
      header: 'Email',
      Cell: ({ row }) => (
        <span
          onClick={() => navigate(`/profil/${row.original.id_utilisateur}`)}
          style={{ cursor: 'pointer' }}
        >
          {row.original.email}
        </span>
      ),
    }),
    columnHelper.accessor('type', {
      header: 'Type',
      Cell: ({ row }) => (
        <span
          onClick={() => navigate(`/profil/${row.original.id_utilisateur}`)}
          style={{ cursor: 'pointer' }}
        >
          {row.original.type}
        </span>
      ),
    }),
    columnHelper.accessor('etat', {
      header: 'État',
      Cell: ({ cell }) => (
        <span style={getBadgeStyle(cell.getValue())}>
          {cell.getValue().charAt(0).toUpperCase() + cell.getValue().slice(1)}
        </span>
      ),
    }),
  ];

  const getBadgeStyle = (etat) => {
    let backgroundColor;
    switch (etat.toLowerCase()) {
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
      display: 'inline-block',
    };
  };

  return (
    <>
      <NavAdmin />
      <div className="tousLesUtilisateurs-container">
        <div className="tousLesUtilisateurs-header">
          <h1>TOUS LES UTILISATEURS</h1>
          <div className="navigation-buttons">
            <button
              onClick={() => navigate('/listClient')}
              className="navigation-buttonsTous"
            >
              Client
            </button>
            <button
              onClick={() => navigate('/listEmploye')}
              className="navigation-buttonsTous"
            >
              Employé
            </button>
          </div>
        </div>
        <MaterialReactTable
          columns={columns}
          data={utilisateurs.filter(
            (utilisateur) =>
              utilisateur.nom
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
              utilisateur.prenom
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
              utilisateur.email.toLowerCase().includes(searchTerm.toLowerCase())
          )}
          getRowId={(row) => row.id_utilisateur}
          localization={MRT_Localization_FR}
          muiSearchTextFieldProps={{
            variant: 'outlined',
            label: 'Rechercher des utilisateurs',
          }}
          muiTableHeadCellProps={{
            sx: {
              backgroundColor: '#A2C8CC', // Couleur de fond des cellules d'en-tête
              '&:hover': {},
            },
          }}
        />
      </div>
    </>
  );
}

export default TousLesUtilisateurs;
