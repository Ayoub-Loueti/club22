import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../components/navbar/navbar';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardHeader,
  Button,
  TextField,
  Typography,
  IconButton,
} from '@mui/material';
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
  const [currentSlide, setCurrentSlide] = useState(0);
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

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : reclamations.length - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev < reclamations.length - 1 ? prev + 1 : 0));
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
      <div
        style={{
          minHeight: '100vh', 
          width: '100%', 
        }}
      >
        <div className="recl-container">
          <div className="recl-input-container">
            <TextField
              className="recl-input"
              value={contenu}
              onChange={(e) => setContenu(e.target.value)}
              placeholder="Écrivez votre réclamation ici..."
              label="Votre réclamation"
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
              disabled={submitting || !contenu.trim()}
            >
              {submitting
                ? 'Soumission en cours...'
                : 'Soumettre la Réclamation'}
            </Button>
          </div>
          <button
            className="recl-slider-arrow recl-slider-arrow-left"
            onClick={handlePrevSlide}
          >
            &#10094;
          </button>
          <div
            className="recl-cards-slider"
            style={{ maxWidth: '1140px', height: '320px' }}
          >
            <div
              className="recl-cards-container"
              style={{ transform: `translateX(-${currentSlide * 570}px)` }}
            >
              {loading ? (
                <Typography>Chargement des réclamations...</Typography>
              ) : (
                reclamations.map((reclamation, index) => (
                  <animated.div style={props} key={reclamation.id_reclamation}>
                    <Card className="recl-card">
                      <CardHeader
                        className="recl-card-status"
                        title={reclamation.statut}
                      />
                      <CardContent className="recl-card-content">
                        <Typography sx={{ color: 'text.secondary' }}>
                          Date de création:{' '}
                          {new Date(reclamation.createdAt).toLocaleString()}
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            fontSize: '1rem',
                            lineHeight: '1.5',
                            maxHeight: '4.5rem', // Limite de hauteur pour le contenu
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'break-spaces', // Empêche le contenu de se chevaucher
                          }}
                        >
                          Contenu: {reclamation.contenu}
                        </Typography>
                        {reclamation.contenu.length > 150 && ( // Vérifie si le contenu est long
                          <Button
                            endIcon={<ExpandMoreIcon />}
                            onClick={() => handleClickOpen(reclamation.contenu)}
                            sx={{ alignSelf: 'center', mt: 2 }}
                          >
                            Voir plus
                          </Button>
                        )}
                        <Typography
                          sx={{
                            color: 'text.secondary',
                          }}
                        >
                          Message de l'admin:{' '}
                          {reclamation.message_admin ? (
                            <span style={{ marginLeft: '5px' }}>
                              {reclamation.message_admin}
                            </span>
                          ) : (
                            'Aucun message'
                          )}
                        </Typography>
                      </CardContent>
                    </Card>
                  </animated.div>
                ))
              )}
            </div>
          </div>
          <button
            className="recl-slider-arrow recl-slider-arrow-right"
            onClick={handleNextSlide}
          >
            &#10095;
          </button>
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
      </div>
    </>
  );
}

export default ReclamationEmploye;
