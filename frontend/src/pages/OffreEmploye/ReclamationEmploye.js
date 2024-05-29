import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../components/navbar/navbar';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardActions } from '@mui/material';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Swal from 'sweetalert2';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useSpring, animated } from '@react-spring/web';
import './ReclamationEmploye.css';

function ReclamationEmploye() {
  const [contenu, setContenu] = useState('');
  const [reclamations, setReclamations] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
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
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors de la récupération des réclamations:', error);
      Swal.fire({
        text: 'Erreur lors de la récupération des réclamations',
        icon: 'error',
        timer: 1500,
        showConfirmButton: false,
      });
      setLoading(false);
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
      setSubmitting(true);
      await axios.post(
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
      setSubmitting(false);
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
      setSubmitting(false);
    }
  };

  const handleClickOpen = (content) => {
    setSelectedContent(content);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getStatusClass = (statut) => {
    const normalizedStatus = statut.trim().toLowerCase();
    if (normalizedStatus === 'traitée') {
      return 'status-success';
    } else if (normalizedStatus === 'en attente') {
      return 'status-warning';
    } else {
      return 'status-error';
    }
  };

  const props = useSpring({ to: { opacity: 1 }, from: { opacity: 0 } });

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
            color="primary"
            onClick={handleReclamationSubmit}
            disabled={submitting}
          >
            {submitting ? 'Soumission en cours...' : 'Soumettre la Réclamation'}
          </Button>
        </div>
        <div className="recl-cards-container">
          {loading ? (
            <Typography>Chargement des réclamations...</Typography>
          ) : (
            reclamations.map((reclamation) => (
              <animated.div style={props} key={reclamation.id_reclamation}>
                <Card className="recl-card">
                  <CardHeader
                    className={`recl-card-status ${getStatusClass(
                      reclamation.statut
                    )}`}
                    title={` ${reclamation.statut}`}
                  />
                  <CardContent
                    className="recl-card-content"
                    onClick={() => handleClickOpen(reclamation.contenu)}
                  >
                    <Typography sx={{ color: 'text.secondary' }}>
                      Date de création:{' '}
                      {new Date(reclamation.createdAt).toLocaleString()}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        fontSize: '1.25rem',
                        fontWeight: 'bold',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'wrap',
                      }}
                    >
                      Contenu: {reclamation.contenu}
                    </Typography>
                    <Button
                      endIcon={<ExpandMoreIcon />}
                      onClick={() => handleClickOpen(reclamation.contenu)}
                      sx={{ alignSelf: 'center', mt: 2 }}
                    >
                      Voir plus
                    </Button>
                    <Typography sx={{ color: 'text.secondary' }}>
                      Message de l'admin:{' '}
                      {reclamation.message_admin || 'Aucun message'}
                    </Typography>
                  </CardContent>
                </Card>
              </animated.div>
            ))
          )}
        </div>
      </div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{'Détails de la Réclamation'}</DialogTitle>
        <DialogContent>
          <DialogContentText>{selectedContent}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Fermer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ReclamationEmploye;
