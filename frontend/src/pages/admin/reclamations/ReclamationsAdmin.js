import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  TextField,
  styled,
  Button,
  Typography,
} from '@mui/material';
import Swal from 'sweetalert2';
import NavAdmin from '../NavAdmin/navAdmin';
import '../collaborateur/listCollaborateur.css';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const MessageField = styled(TextField)({
  margin: '7px 0',
});
const SendButton = styled(Button)({
  marginTop: '10px',
  backgroundColor: '#81c6c2',
  '&:hover': {
    backgroundColor: '#bcf7f4',
  },
});
function ReclamationsAdmin() {
  const [reclamations, setReclamations] = useState([]);
  const navigate = useNavigate();
  const [adminMessages, setAdminMessages] = useState({});
  const token = JSON.parse(localStorage.getItem('login'))?.token;
  const [expandedIds, setExpandedIds] = useState({});

  useEffect(() => {
    fetchReclamations();
  }, [token]);

  const fetchReclamations = async () => {
    try {
      const response = await axios.get('http://54.242.240.123/reclamations', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const sortedReclamations = response.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setReclamations(sortedReclamations);
      const messages = {};
      sortedReclamations.forEach((reclamation) => {
        messages[reclamation.id_reclamation] = reclamation.message_admin || '';
      });
      setAdminMessages(messages);
    } catch (error) {
      console.error('Error fetching reclamations:', error);
      Swal.fire({
        title: 'Erreur!',
        text: 'Erreur lors de la récupération des réclamations',
        icon: 'error',
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  const sendMessage = async (id, message) => {
    if (!message.trim()) {
      // Vérifie si le message est vide ou ne contient que des espaces blancs
      Swal.fire({
        title: 'Erreur!',
        text: 'Vous ne pouvez pas envoyer un message vide.',
        icon: 'error',
        timer: 1500,
        showConfirmButton: false,
      });
      return;
    }

    try {
      await axios.post(
        `http://54.242.240.123/reclamations/${id}/message`,
        { message_admin: message },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      Swal.fire({
        title: 'Succès!',
        text: 'Message envoyé avec succès',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
      });
      fetchReclamations(); // Recharge les réclamations pour mettre à jour l'affichage
    } catch (error) {
      Swal.fire({
        title: 'Erreur!',
        text: 'Erreur lors de l’envoi du message',
        icon: 'error',
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.post(
        `http://54.242.240.123/reclamations/${id}/status`,
        { newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      Swal.fire({
        title: 'Succès!',
        text: 'Etat mis à jour avec succès',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
      });
      fetchReclamations();
    } catch (error) {
      Swal.fire({
        title: 'Erreur!',
        text: 'Erreur lors de la mise à jour du statut',
        icon: 'error',
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  const handleAdminMessageChange = (id, message) => {
    setAdminMessages((prevMessages) => ({
      ...prevMessages,
      [id]: message,
    }));
  };
  const toggleExpand = (id) => {
    setExpandedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <>
      <NavAdmin />
      <div className="reclamation-container">
        <Typography
          variant="h6"
          component="h1"
          gutterBottom
          style={{ margin: '20px 0', color: 'black', fontWeight: 'bold' }}
        >
          TRAITEMENT DES RÉCLAMATIONS{' '}
        </Typography>
        <TableContainer component={Paper} className="reclamation-table">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>RÉCLAMATION</TableCell>
                <TableCell>ENVOYÉ LE</TableCell>
                <TableCell>TRANSMIS PAR</TableCell>
                <TableCell>ÉTAT</TableCell>
                <TableCell>RÉPONSE</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reclamations.map((reclamation) => (
                <TableRow key={reclamation.id_reclamation}>
                  <TableCell>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'pointer',
                      }}
                      onClick={() => toggleExpand(reclamation.id_reclamation)}
                    >
                      <div
                        style={{
                          maxWidth: expandedIds[reclamation.id_reclamation]
                            ? 'none'
                            : '150px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: expandedIds[reclamation.id_reclamation]
                            ? 'normal'
                            : 'nowrap',
                        }}
                      >
                        {reclamation.contenu}
                      </div>
                      {expandedIds[reclamation.id_reclamation] ? (
                        <ExpandLessIcon style={{ marginLeft: '10px' }} />
                      ) : (
                        <ExpandMoreIcon style={{ marginLeft: '10px' }} />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(reclamation.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <img
                        src={
                          reclamation.employe.utilisateur.photo ||
                          'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'
                        }
                        alt="Avatar"
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: '50%',
                          marginRight: '10px',
                        }}
                      />
                      <div>
                        {`${reclamation.employe.utilisateur.nom} ${reclamation.employe.utilisateur.prenom}`}
                      </div>
                    </div>{' '}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={reclamation.statut}
                      onChange={(e) =>
                        updateStatus(reclamation.id_reclamation, e.target.value)
                      }
                      fullWidth
                    >
                      <MenuItem value="En attente">En attente</MenuItem>
                      <MenuItem value="Traitée">Traitée</MenuItem>
                      <MenuItem value="Rejetée">Rejetée</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <div className="message-actions">
                      <MessageField
                        className="message-field"
                        value={adminMessages[reclamation.id_reclamation]}
                        onChange={(e) =>
                          handleAdminMessageChange(
                            reclamation.id_reclamation,
                            e.target.value
                          )
                        }
                        fullWidth
                        placeholder="Écrire un message..."
                      />
                      <SendButton
                        className="send-button"
                        onClick={() =>
                          sendMessage(
                            reclamation.id_reclamation,
                            adminMessages[reclamation.id_reclamation]
                          )
                        }
                        variant="contained"
                      >
                        Envoyer
                      </SendButton>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
}

export default ReclamationsAdmin;
