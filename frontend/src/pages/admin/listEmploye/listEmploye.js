import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  MaterialReactTable,
  createMRTColumnHelper,
} from 'material-react-table';
import { Box, Button } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { mkConfig, generateCsv, download } from 'export-to-csv'; // Ensure this package is correctly installed
import NavAdmin from '../NavAdmin/navAdmin';
import './listEmployE.css';
import { MRT_Localization_FR } from 'material-react-table/locales/fr';
const columnHelper = createMRTColumnHelper();

const ListEmploye = () => {
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('login');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://54.242.240.123/listEmp', {
        headers: {
          Authorization: `Bearer ${JSON.parse(token).token}`,
        },
      });
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleBlockUnblock = async (id, etat) => {
    const endpoint =
      etat.toLowerCase() === 'autorise' ? '/block/' : '/unblock/';
    try {
      await axios.put(
        `http://54.242.240.123${endpoint}${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(token).token}`,
          },
        }
      );
      fetchEmployees(); // Refresh the list after the operation
    } catch (error) {
      console.error('Error updating user state:', error);
    }
  };

  const csvConfig = mkConfig({
    filename: 'Employee_List',
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true,
    useTextFile: false,
    useBom: true,
    useKeysAsHeaders: true,
    // headers: ['Column 1', 'Column 2', etc...] <-- Won't be needed as useKeysAsHeaders is true
  });

  const columns = [
    columnHelper.accessor('photo', {
      header: 'Photo',
      Cell: ({ cell }) => (
        <img
          src={
            cell.getValue()
              ? `http://54.242.240.123/${cell.getValue()}`
              : 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'
          }
          alt="Employee"
          style={{ width: 50, height: 50, borderRadius: '50%' }}
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
      Cell: ({ cell }) =>
        cell.getValue().charAt(0).toUpperCase() + cell.getValue().slice(1),
    }),
    columnHelper.accessor('etat', {
      header: 'État',
      Cell: ({ cell }) => (
        <div
          style={{
            backgroundColor:
              cell.getValue().toLowerCase() === 'autorise'
                ? '#34c38f'
                : cell.getValue().toLowerCase() === 'bloque'
                ? '#f8d7da'
                : '#ffecb3',
            borderRadius: '0.5rem',
            padding: '0.25em 0.6em',
            color: '#000',
            textAlign: 'center',
          }}
        >
          {cell.getValue().charAt(0).toUpperCase() + cell.getValue().slice(1)}
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
            style={{ margin: '0 10px' }} // Apply inline styling for button margin
          >
            {row.original.etat.toLowerCase() === 'autorise'
              ? 'Bloquer'
              : 'Débloquer'}
          </Button>
        ),
    }),
  ];

  const handleExportData = () => {
    const dataToExport = employees.map((emp) => ({
      photo: emp.photo,
      nom: emp.nom,
      prenom: emp.prenom,
      email: emp.email,
      genre: emp.genre,
      etat: emp.etat,
    }));
    const csv = generateCsv(csvConfig)(dataToExport);
    download(csvConfig)(csv);
  };

  return (
    <>
      <NavAdmin />
      <div className="list-Employe-container">
        <div className="list-Employe-header">
          <h1>LISTE DES EMPLOYES</h1>

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
        <MaterialReactTable
          columns={columns}
          data={employees}
          getRowId={(row) => row.id_utilisateur}
          localization={MRT_Localization_FR}
          muiSearchTextFieldProps={{
            variant: 'outlined',
            label: 'Rechercher des employés',
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
              <Button
                onClick={handleExportData}
                startIcon={<FileDownloadIcon />}
              >
                Exporter les données
              </Button>
            </Box>
          )}
        />
      </div>
    </>
  );
};

export default ListEmploye;
