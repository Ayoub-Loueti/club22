import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Autocomplete,
  Switch,
  FormControlLabel,
  Modal,
  Grid,
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  Avatar,
  TextField,
  Button,
} from '@mui/material';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { IconButton } from '@mui/material';
import { Visibility } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import io from 'socket.io-client';
import Lottie from 'react-lottie';
import typingAnimation from '../../animations/typing.json'; // Adjust the path as necessary
import './message.css';
import Navbar from '../../components/navbar/navbar';
const ENDPOINT = 'http://54.87.28.4';
var socket, selectedChatCompare;

function MessagePage() {
  const [discussions, setDiscussions] = useState([]);
  const [selectedDiscussion, setSelectedDiscussion] = useState(null);
  const [messages, setMessages] = useState([]);
  const token = localStorage.getItem('login');
  const userId = localStorage.getItem('userId').replace(/"/g, '');
  const [newMessage, setNewMessage] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [discussionName, setDiscussionName] = useState('');
  const [validityDays, setValidityDays] = useState('');
  const [socketConnected, setSocketConnected] = useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);
  const [socket, setSocket] = useState(null);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeout = useRef(null); // Define typingTimeout using useRef
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [noMessagesError, setNoMessagesError] = useState('');
  const [searchTerm, setSearchTerm] = useState(''); // State for search term
  const [isPublic, setIsPublic] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectableUsers, setSelectableUsers] = useState([]);
  const [isPrivate, setIsPrivate] = useState(false);
  const [members, setMembers] = useState([]);
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { t } = useTranslation();

  const handleOpenMembersModal = () => setIsMembersModalOpen(true);
  const handleCloseMembersModal = () => setIsMembersModalOpen(false);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: typingAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  useEffect(() => {
    const newSocket = io(ENDPOINT);
    newSocket.emit('setup', userId);
    newSocket.on('connected', () => setSocketConnected(true));
    newSocket.on('users online', async (users) => {
      const otherUsers = users.filter((id) => id !== userId);
      const userDetails = await Promise.all(
        otherUsers.map((userId) => fetchUserDetails(userId))
      );
      setConnectedUsers(userDetails.filter((user) => user !== null));
    });
    newSocket.on('new discussion', (discussion) => {
      setDiscussions((prevDiscussions) => [...prevDiscussions, discussion]);
    });
    setSocket(newSocket);

    return () => {
      newSocket.close();
      setSocket(null);
    };
  }, [userId]);

  useEffect(() => {
    if (!socket) return;

    socket.on('typing', () => setIsTyping(true));
    socket.on('stop typing', () => setIsTyping(false));

    return () => {
      socket.off('typing');
      socket.off('stop typing');
    };
  }, [socket]);

  useEffect(() => {
    if (!socket) return;

    socket.on('message received', (newMessageReceived) => {
      setMessages((prevMessages) => [...prevMessages, newMessageReceived]);
      fetchMessages();
    });

    return () => {
      socket.off('message received');
      fetchMessages();
    };
  }, [socket]);

  const handleCreateDiscussion = () => {
    axios
      .post(
        'http://54.87.28.4/discussions',
        {
          nomDisc: discussionName,
          nbr_jours_disc: validityDays,
          ispublic: isPublic,
          namedUsers: selectedUsers,
        },
        { headers: { Authorization: `Bearer ${JSON.parse(token).token}` } }
      )
      .then((response) => {
        setDiscussions([...discussions, response.data]);
        handleCloseModal();
      })
      .catch((error) => console.error('Error creating discussion:', error));
  };

  const filteredDiscussions = discussions.filter((discussion) =>
    discussion.nomDisc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fetchEmployesAndAdmins = async () => {
    try {
      const response = await axios.get(
        'http://54.87.28.4/users/employes-admins',
        {
          headers: { Authorization: `Bearer ${JSON.parse(token).token}` },
        }
      );
      setSelectableUsers(response.data);
    } catch (error) {
      console.error('Error fetching employes and admins:', error);
    }
  };

  useEffect(() => {
    if (!isPublic) {
      fetchEmployesAndAdmins();
    }
  }, [isPublic, token]);

  const handleTogglePublic = () => setIsPublic(!isPublic);

  const fetchPrivacyStatus = async (id_disc) => {
    try {
      const response = await axios.get(
        `http://54.87.28.4/discussion/${id_disc}/is-private`,
        {
          headers: { Authorization: `Bearer ${JSON.parse(token).token}` },
        }
      );
      setIsPrivate(response.data.isPrivate);
    } catch (error) {
      console.error('Error fetching privacy status:', error);
    }
  };

  const fetchMembers = async (id_disc) => {
    try {
      const response = await axios.get(
        `http://54.87.28.4/discussion/${id_disc}/members`,
        {
          headers: { Authorization: `Bearer ${JSON.parse(token).token}` },
        }
      );
      console.log(response.data);
      setMembers(response.data);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  useEffect(() => {
    if (selectedDiscussion && selectedDiscussion.id_disc) {
      fetchPrivacyStatus(selectedDiscussion.id_disc);
      fetchMembers(selectedDiscussion.id_disc);
    }
  }, [selectedDiscussion]);

  const checkAdminStatus = async () => {
    try {
      const response = await axios.get(
        `http://54.87.28.4/discussion/${selectedDiscussion.id_disc}/is-admin`,
        {
          headers: { Authorization: `Bearer ${JSON.parse(token).token}` },
        }
      );
      setIsAdmin(response.data.isAdmin);
    } catch (error) {
      console.error('Error checking admin status:', error);
    }
  };

  useEffect(() => {
    if (selectedDiscussion) {
      checkAdminStatus();
    }
  }, [selectedDiscussion]);

  const handleKickMember = async (memberId) => {
    try {
      await axios.delete(
        `http://54.87.28.4/discussion/${selectedDiscussion.id_disc}/member/${memberId}`,
        {
          headers: { Authorization: `Bearer ${JSON.parse(token).token}` },
        }
      );
      fetchMembers(selectedDiscussion.id_disc);
    } catch (error) {
      console.error('Error kicking member:', error);
    }
  };

  useEffect(() => {
    if (selectedDiscussion && selectedDiscussion.id_disc) {
      fetchMembers(selectedDiscussion.id_disc);
    }
  }, [selectedDiscussion]);

  const modalBody = (
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: '20px',
      }}
    >
      <Typography variant="h6" component="h2">
        {t('Nouvelle Discussion')}
      </Typography>
      <TextField
        fullWidth
        label={t('Nom de la conversation')}
        value={discussionName}
        onChange={(e) => setDiscussionName(e.target.value)}
        sx={{ mt: 2 }}
        required
      />
      <TextField
        fullWidth
        label={t('Nombre de jours valable')}
        type="number"
        value={validityDays}
        onChange={(e) => setValidityDays(e.target.value)}
        sx={{ mt: 2 }}
        required
      />
      <FormControlLabel
        control={<Switch checked={!isPublic} onChange={handleTogglePublic} />}
        label={t('Privée')}
      />
      {!isPublic && (
        <Autocomplete
          multiple
          options={selectableUsers} // Use selectableUsers here
          getOptionLabel={(option) => `${option.nom} ${option.prenom}`}
          onChange={(event, value) =>
            setSelectedUsers(value.map((user) => user.id_utilisateur))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              label={t('Ajouter des utilisateurs')}
              placeholder={t('Sélectionner')}
            />
          )}
        />
      )}
      <Button
        variant="contained"
        color="primary"
        onClick={handleCreateDiscussion}
        sx={{ mt: 2 }}
        disabled={
          !discussionName ||
          !validityDays ||
          validityDays <= 0 ||
          (!isPublic && selectedUsers.length === 0)
        }
      >
        {t('Ajouter')}
      </Button>
    </Box>
  );

  useEffect(() => {
    axios
      .get('http://54.87.28.4/discussions', {
        headers: { Authorization: `Bearer ${JSON.parse(token).token}` },
      })
      .then((response) => {
        setDiscussions(response.data);
      })
      .catch((error) => console.error('Error fetching discussions:', error));
  }, [token]);

  useEffect(() => {
    console.log(selectedDiscussion);
    if (selectedDiscussion && selectedDiscussion.id_disc) {
      axios
        .get(`http://54.87.28.4/messages/${selectedDiscussion.id_disc}`, {
          headers: { Authorization: `Bearer ${JSON.parse(token).token}` },
        })
        .then((response) => {
          setMessages(response.data);
        })
        .catch((error) => console.error('Error fetching messages:', error));
    }
  }, [selectedDiscussion, token]);

  useEffect(() => {
    fetchMessages();
  }, [selectedDiscussion, token]);

  const fetchMessages = () => {
    if (selectedDiscussion && selectedDiscussion.id_disc) {
      axios
        .get(`http://54.87.28.4/messages/${selectedDiscussion.id_disc}`, {
          headers: { Authorization: `Bearer ${JSON.parse(token).token}` },
        })
        .then((response) => {
          setMessages(response.data);
          setNoMessagesError(''); // Clear any previous error messages
          socket.emit(t('rejoindre le chat'), selectedDiscussion.id_disc);
        })
        .catch((error) => {
          if (error.response && error.response.status === 404) {
            setNoMessagesError(
              t(
                "Il n'y a pas de messages pour cette discussion. Soyez le premier à envoyer un message."
              )
            );
          } else {
            console.error('Error fetching messages:', error);
          }
        });
    }
  };

  useEffect(() => {
    if (selectedDiscussion && selectedDiscussion.id_disc) {
      socket.emit(t('rejoindre le chat'), selectedDiscussion.id_disc);
    }
  }, [selectedDiscussion]);

  const handleSendMessage = () => {
    if (selectedDiscussion && newMessage.trim()) {
      axios
        .post(
          `http://54.87.28.4/message/${selectedDiscussion.id_disc}`,
          { contenu: newMessage },
          { headers: { Authorization: `Bearer ${JSON.parse(token).token}` } }
        )
        .then((response) => {
          const sentMessage = response.data;
          setNewMessage('');
          fetchMessages();
          socket.emit(t('nouveau message'), {
            room: selectedDiscussion.id_disc,
            message: sentMessage,
            userId: userId,
          });
          socket.emit(t('arrêter de taper'), selectedDiscussion.id_disc);
        })
        .catch((error) => console.error('Error sending message:', error));
    }
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    if (!typing) {
      setTyping(true);
      socket.emit(t('en train de taper'), selectedDiscussion.id_disc);
    }
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      setTyping(false);
      socket.emit(t('arrêter de taper'), selectedDiscussion.id_disc);
    }, 3000);
  };

  const fetchUserDetails = async (userId) => {
    try {
      const response = await axios.get(`http://54.87.28.4/profil/${userId}`, {
        headers: { Authorization: `Bearer ${JSON.parse(token).token}` },
      });
      return {
        id: userId,
        nom: response.data.user.nom,
        prenom: response.data.user.prenom,
        photo: response.data.user.photo,
      };
    } catch (error) {
      console.error('Error fetching user details:', error);
      return null;
    }
  };
  useEffect(() => {
    // Appliquer le style au body lors du montage
    document.body.style.height = '100%';
    document.body.style.margin = '0';
    document.body.style.background =
      'linear-gradient(to right, #91EAE4, #86A8E7, #7F7FD5)';

    // Fonction de nettoyage pour retirer le style lors du démontage
    return () => {
      document.body.style.height = '';
      document.body.style.margin = '';
      document.body.style.background = '';
    };
  }, []);

  return (
    <>
      <Navbar />
      <div className="messagePageContainer">
        <Grid container spacing={2} className="containerMsg">
          <Grid item xs={3} className="chatMsgs">
            <Box
              sx={{ height: '84.5vh', overflow: 'auto' }}
              className="discussionsCard"
            >
              <Typography variant="h6" className="card-headerMsgs">
                Discussions
                <Button onClick={handleOpenModal} className="send_btnMsgs">
                  {t('Créer nouvelle discussion')}
                </Button>
              </Typography>
              <TextField
                fullWidth
                placeholder={t('Rechercher une discussion...')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ mb: 2 }}
                InputProps={{
                  className: 'searchMsgs',
                }}
              />
              <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                {modalBody}
              </Modal>
              <List className="contactsMsgs">
                {filteredDiscussions.map((discussion) => (
                  <ListItem
                    className="contactsMsgs li"
                    button
                    key={discussion.id_disc}
                    onClick={() => setSelectedDiscussion(discussion)}
                  >
                    <Box
                      sx={{
                        width: '100%',
                        bgcolor: '#82ccdd',
                        boxShadow: 3,
                        p: 2,
                        borderRadius: 2,
                      }}
                    >
                      <ListItemText
                        primary={discussion.nomDisc}
                        secondary={
                          discussion.date_fin
                            ? `${t("valable jusqu'à")} ${new Date(
                                discussion.date_fin
                              ).toLocaleDateString('fr-FR')}`
                            : ''
                        }
                      />
                    </Box>
                  </ListItem>
                ))}
              </List>
            </Box>
          </Grid>
          <Grid item xs={6} className="chatMsgs">
            <Box
              sx={{ display: 'flex', flexDirection: 'column', height: '90vh' }}
              className="cardMsgs"
            >
              <Box
                sx={{ flexGrow: 1, overflow: 'auto' }}
                className="msg_card_bodyMsgs"
              >
                <Typography variant="h6" className="msg_headMsgs">
                  {selectedDiscussion ? (
                    <>
                      {selectedDiscussion.nomDisc}
                      {isPrivate && (
                        <IconButton onClick={handleOpenMembersModal}>
                          <Visibility />
                        </IconButton>
                      )}
                    </>
                  ) : (
                    t('Sélectionnez une discussion')
                  )}
                </Typography>
                <Modal
                  open={isMembersModalOpen}
                  onClose={handleCloseMembersModal}
                  aria-labelledby="members-modal-title"
                  aria-describedby="members-modal-description"
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: 400,
                      bgcolor: 'background.paper',
                      boxShadow: 24,
                      p: 4,
                      borderRadius: '20px',
                    }}
                  >
                    <Typography
                      id="members-modal-title"
                      variant="h6"
                      component="h2"
                    >
                      {t('Les membres de cette discussion')}
                    </Typography>
                    <List dense>
                      {members.map((member, index) => (
                        <ListItem key={index}>
                          <Avatar
                            src={
                              member.utilisateur.photo
                                ? `http://54.87.28.4/${member.utilisateur.photo}`
                                : 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'
                            }
                            alt={`${member.utilisateur.prenom} ${member.utilisateur.nom}`}
                            sx={{ width: 56, height: 56, marginRight: 2 }}
                          />
                          <ListItemText
                            primary={`${member.utilisateur.prenom} ${member.utilisateur.nom}`}
                          />
                          {isAdmin && member.id_utilisateur !== userId && (
                            <IconButton
                              onClick={() => handleKickMember(member.id_membre)}
                            >
                              <HighlightOffIcon />
                            </IconButton>
                          )}
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                </Modal>
                <List>
                  {messages.length > 0 ? (
                    messages.map((message) => (
                      <ListItem
                        key={message.id_msg}
                        alignItems="flex-start"
                        className="msg_cotainerMsgs"
                      >
                        {' '}
                        <Avatar
                          src={
                            message.utilisateur && message.utilisateur.photo
                              ? `http://54.87.28.4/${message.utilisateur.photo}`
                              : 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'
                          }
                          alt={
                            message.utilisateur
                              ? `${message.utilisateur.prenom} ${message.utilisateur.nom}`
                              : t('Utilisateur Inconnu')
                          }
                          sx={{ width: 56, height: 56, marginRight: 2 }}
                          className="user_imgMsgs"
                        />
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          <Typography
                            component="span"
                            variant="body2"
                            color="textPrimary"
                          >
                            {message.utilisateur
                              ? `${message.utilisateur.prenom} ${message.utilisateur.nom}`
                              : t('Utilisateur Inconnu')}
                          </Typography>
                          <Typography
                            component="span"
                            variant="body2"
                            color="textPrimary"
                          >
                            {message.contenu}
                          </Typography>
                        </Box>
                      </ListItem>
                    ))
                  ) : (
                    <Typography sx={{ mt: 2, textAlign: 'center' }}>
                      {noMessagesError ||
                        t(
                          'Cliquez sur une discussion pour commencer à chatter.'
                        )}
                    </Typography>
                  )}
                </List>
              </Box>
              <Box
                component="form"
                className="card-footerMsgs"
                sx={{ display: 'flex', alignItems: 'center', mt: 2 }}
              >
                {isTyping && (
                  <Box sx={{ width: '100%', textAlign: 'center' }}>
                    <Lottie options={defaultOptions} height={40} width={70} />
                  </Box>
                )}
                <TextField
                  fullWidth
                  placeholder={t('Tapez un message...')}
                  value={newMessage}
                  onChange={handleTyping}
                  sx={{ mr: 1 }}
                  className="type_msgMsgs"
                />
                <Button onClick={handleSendMessage} className="send_btnMsgs">
                  {t('Envoyer')}
                </Button>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={3} className="chatMsgs">
            <Box
              sx={{ maxHeight: '90vh', overflow: 'auto' }}
              className="contacts_bodyMsgs"
            >
              <Typography variant="h6" className="user_connected_title">
                {t('Utilisateurs connectés')}
              </Typography>{' '}
              <List>
                {connectedUsers.map((user, index) => (
                  <ListItem key={index} className="contactsMsgs li">
                    <Avatar
                      src={`http://54.87.28.4/${user.photo}`}
                      alt={`${user.prenom} ${user.nom}`}
                      sx={{ width: 56, height: 56, marginRight: 2 }}
                      className="user_imgMsgs"
                    />
                    <div className="online_icon"></div>{' '}
                    <ListItemText primary={`${user.prenom} ${user.nom}`} />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Grid>
        </Grid>
      </div>
    </>
  );
}

export default MessagePage;
