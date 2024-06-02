import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  MaterialReactTable,
  createMRTColumnHelper,
} from 'material-react-table';
import { Box, Button } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import NavAdmin from '../NavAdmin/navAdmin';
import './listClient.css';
import { MRT_Localization_FR } from 'material-react-table/locales/fr';

const columnHelper = createMRTColumnHelper();

function ListClient() {
  const [clients, setClients] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('login');

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await axios.get('http://54.87.28.4/listCli', {
        headers: {
          Authorization: `Bearer ${JSON.parse(token).token}`,
        },
      });
      setClients(response.data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const handleBlockUnblock = async (id, etat) => {
    const endpoint =
      etat.toLowerCase() === 'autorise' ? '/block/' : '/unblock/';
    try {
      await axios.put(
        `http://54.87.28.4${endpoint}${id}`,
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

  const columns = [
    columnHelper.accessor('photo', {
      header: 'Photo',
      Cell: ({ cell }) => (
        <img
          src={
            cell.getValue()
              ? `http://54.87.28.4/${cell.getValue()}`
              : 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'
          }
          alt="Client"
          style={{ width: 50, height: 50, borderRadius: '50%' }}
          onClick={() =>
            navigate(`/profil/${cell.row.original.id_utilisateur}`)
          }
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
    columnHelper.accessor('genre', {
      header: 'Genre',
      Cell: ({ row }) => (
        <span
          onClick={() => navigate(`/profil/${row.original.id_utilisateur}`)}
          style={{ cursor: 'pointer' }}
        >
          {row.original.genre.charAt(0).toUpperCase() +
            row.original.genre.slice(1)}
        </span>
      ),
    }),
    columnHelper.accessor('etat', {
      header: 'État',
      Cell: ({ row }) => (
        <div
          style={{
            backgroundColor:
              row.original.etat.toLowerCase() === 'autorise'
                ? '#34c38f'
                : row.original.etat.toLowerCase() === 'bloque'
                ? '#f8d7da'
                : '#ffecb3',
            borderRadius: '0.5rem',
            padding: '0.25em 0.6em',
            color: '#000',
            textAlign: 'center',
          }}
          onClick={() => navigate(`/profil/${row.original.id_utilisateur}`)}
        >
          {row.original.etat.charAt(0).toUpperCase() +
            row.original.etat.slice(1)}
        </div>
      ),
    }),
    columnHelper.accessor('id_utilisateur', {
      header: 'Actions',
      Cell: ({ row }) =>
        row.original.etat !== 'En attente' && (
          <Button
            variant="contained"
            color={
              row.original.etat.toLowerCase() === 'autorise'
                ? 'error'
                : 'success'
            }
            onClick={() =>
              handleBlockUnblock(row.original.id_utilisateur, row.original.etat)
            }
            style={{ margin: '0 10px' }}
          >
            {row.original.etat.toLowerCase() === 'autorise'
              ? 'Bloquer'
              : 'Débloquer'}
          </Button>
        ),
    }),
  ];

  return (
    <>
      <NavAdmin />
      <div className="list-client-container">
        <div className="list-client-header">
          <h1>LISTE DES CLIENTS</h1>
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
        <MaterialReactTable
          columns={columns}
          data={clients}
          getRowId={(row) => row.id_utilisateur}
          localization={MRT_Localization_FR}
          muiSearchTextFieldProps={{
            variant: 'outlined',
            label: 'Rechercher des clients',
          }}
          muiTableHeadCellProps={{
            sx: {
              backgroundColor: '#A2C8CC', // Couleur de fond des cellules d'en-tête
              '&:hover': {},
            },
          }}
          renderTopToolbarCustomActions={({ table }) => (
            <Box
              sx={{
                display: 'flex',
                gap: '16px',
                padding: '8px',
                flexWrap: 'wrap',
              }}
            >
              <Button onClick={() => {}} startIcon={<FileDownloadIcon />}>
                Exporter les données
              </Button>
            </Box>
          )}
        />
      </div>
    </>
  );
}

export default ListClient;
