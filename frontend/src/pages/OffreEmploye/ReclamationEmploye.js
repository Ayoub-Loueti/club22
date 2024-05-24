import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../components/navbar/navbar';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, Button, TextField } from '@mui/material';
import Swal from 'sweetalert2';
import './ReclamationEmploye.css'; // Assurez-vous que le chemin est correct
function ReclamationEmploye() {
  const [contenu, setContenu] = useState('');
  const [reclamations, setReclamations] = useState([]);
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem('login'))?.token;
  const [idEmploye, setIdEmploye] = useState(null);

  useEffect(() => {
    const fetchEmployeId = async () => {
      try {
        const response = await axios.get('http://localhost:5000/details', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data && response.data.id_employe) {
          setIdEmploye(response.data.id_employe);
          fetchReclamations(response.data.id_employe);
        } else {
          throw new Error('ID employé non trouvé dans la réponse');
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de l'ID employé:", error);
        Swal.fire({
          text:
            "Erreur lors de la récupération de l'ID employé: " + error.message,
          icon: 'error',
          timer: 1500,
          showConfirmButton: false,
        });
      }
    };

    fetchEmployeId();
  }, [token]);

  const fetchReclamations = async (idEmploye) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/reclamations/${idEmploye}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReclamations(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des réclamations:', error);
      Swal.fire({
        text: 'Erreur lors de la récupération des réclamations',
        icon: 'error',
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  const handleReclamationSubmit = async () => {
    if (!contenu.trim()) {
      Swal.fire({
        text: 'Veuillez entrer du contenu pour la réclamation.',
        icon: 'warning',
        timer: 1500,
        showConfirmButton: false,
      });
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/reclamations',
        { contenu, id_employe: idEmploye },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setContenu('');
      fetchReclamations(idEmploye);
      Swal.fire({
        text: 'Réclamation créée avec succès!',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error('Erreur lors de la création de la réclamation:', error);
      Swal.fire({
        text:
          'Erreur lors de la création de la réclamation: ' +
          error.response.data.message,
        icon: 'error',
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

return (
  <>
    <Navbar />
    <div className="recl-container">
      <div className="recl-input-container">
        <TextField
          className="recl-input"
          value={contenu}
          onChange={(e) => setContenu(e.target.value)}
          placeholder="Écrivez votre réclamation ici..."
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          margin="normal"
        />
        <Button
          className="recl-submit-button"
          variant="contained"
          onClick={handleReclamationSubmit}
        >
          Soumettre la Réclamation
        </Button>
      </div>
      <div className="recl-cards-container">
        {reclamations.map((reclamation) => (
          <Card key={reclamation.id_reclamation} className="recl-card">
            <CardContent>
              <Typography variant="h6">
                Contenu: {reclamation.contenu}
              </Typography>
              <Typography color="textSecondary">
                Statut: {reclamation.statut}
              </Typography>
              <Typography color="textSecondary">
                Date de création:{' '}
                {new Date(reclamation.createdAt).toLocaleString()}
              </Typography>
              <Typography color="textSecondary">
                Message de l'admin:{' '}
                {reclamation.message_admin || 'Aucun message'}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </>
);
}

export default ReclamationEmploye;