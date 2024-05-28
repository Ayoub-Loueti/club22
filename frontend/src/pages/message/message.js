import React, { useState, useEffect ,useRef} from 'react';
import { Autocomplete,Switch,FormControlLabel,Modal,Grid, Box, List, ListItem, ListItemText, Typography, Avatar, Paper , TextField, Button} from '@mui/material';
import axios from 'axios';
import io from 'socket.io-client';
import Lottie from 'react-lottie';
import typingAnimation from '../../animations/typing.json'; // Adjust the path as necessary

const ENDPOINT = "http://localhost:5000";
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
    const [socketConnected,setSocketConnected]=useState(false);
    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);
    const [socket, setSocket] = useState(null);
    const [typing , setTyping] = useState(false);
    const [isTyping , setIsTyping] = useState(false);
    const typingTimeout = useRef(null); // Define typingTimeout using useRef
    const [connectedUsers, setConnectedUsers] = useState([]);
    const [noMessagesError, setNoMessagesError] = useState('');
    const [searchTerm, setSearchTerm] = useState(''); // State for search term
    const [isPublic, setIsPublic] = useState(true);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [selectableUsers, setSelectableUsers] = useState([]);

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: typingAnimation,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };

    useEffect(() => {
        const newSocket = io(ENDPOINT);
        newSocket.emit("setup", userId);
        newSocket.on("connected", () => setSocketConnected(true));
        newSocket.on("users online", async (users) => {
            const otherUsers = users.filter(id => id !== userId);
            const userDetails = await Promise.all(otherUsers.map(userId => fetchUserDetails(userId)));
            setConnectedUsers(userDetails.filter(user => user !== null));
        });
        newSocket.on("new discussion", (discussion) => {
            setDiscussions(prevDiscussions => [...prevDiscussions, discussion]);
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

      socket.on("message received", (newMessageReceived) => {
          setMessages(prevMessages => [...prevMessages, newMessageReceived]);
          fetchMessages();
      });

      return () => {
          socket.off("message received");
          fetchMessages();
      };
  }, [socket]);
    

  const handleCreateDiscussion = () => {
    axios.post('http://localhost:5000/discussions', 
        {
            nomDisc: discussionName,
            nbr_jours_disc: validityDays,
            ispublic: isPublic,  // Include the isPublic flag
            namedUsers: selectedUsers  // Include the list of selected user IDs
        },
        { headers: { Authorization: `Bearer ${JSON.parse(token).token}` } }
    )
    .then(response => {
        setDiscussions([...discussions, response.data]);
        handleCloseModal();
    })
    .catch(error => console.error('Error creating discussion:', error));
};
    
    const filteredDiscussions = discussions.filter(discussion =>
        discussion.nomDisc.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const fetchEmployesAndAdmins = async () => {
    try {
        const response = await axios.get('http://localhost:5000/users/employes-admins', {
            headers: { Authorization: `Bearer ${JSON.parse(token).token}` }
        });
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

    const modalBody = (
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
            <Typography variant="h6" component="h2">
                Nouvelle Discussion
            </Typography>
            <TextField
                fullWidth
                label="Nom de la conversation"
                value={discussionName}
                onChange={(e) => setDiscussionName(e.target.value)}
                sx={{ mt: 2 }}
                required
            />
            <TextField
                fullWidth
                label="Nombre de jours valable"
                type="number"
                value={validityDays}
                onChange={(e) => setValidityDays(e.target.value)}
                sx={{ mt: 2 }}
                required
            />
            <FormControlLabel
                control={<Switch checked={!isPublic} onChange={handleTogglePublic} />}
                label="Privée"
            />
            {!isPublic && (
    <Autocomplete
        multiple
        options={selectableUsers}  // Use selectableUsers here
        getOptionLabel={(option) => `${option.nom} ${option.prenom}`}
        onChange={(event, value) => setSelectedUsers(value.map(user => user.id_utilisateur))}
        renderInput={(params) => (
            <TextField
                {...params}
                variant="standard"
                label="Ajouter des utilisateurs"
                placeholder="Sélectionner"
            />
        )}
    />
)}
            <Button
                variant="contained"
                color="primary"
                onClick={handleCreateDiscussion}
                sx={{ mt: 2 }}
                disabled={!discussionName || !validityDays || validityDays <= 0 || (!isPublic && selectedUsers.length === 0)}
            >
                Ajouter
            </Button>
        </Box>
    );

    useEffect(() => {
        axios.get('http://localhost:5000/discussions', 
        { headers: { Authorization: `Bearer ${JSON.parse(token).token}` } })
            .then(response => {
                setDiscussions(response.data);
            })
            .catch(error => console.error('Error fetching discussions:', error));
    }, [token]);

    useEffect(() => {
      console.log(selectedDiscussion); // Add this to check if the state updates
      if (selectedDiscussion && selectedDiscussion.id_disc) {
          axios.get(`http://localhost:5000/messages/${selectedDiscussion.id_disc}`, 
          { headers: { Authorization: `Bearer ${JSON.parse(token).token}` }})
              .then(response => {
                  setMessages(response.data);
              })
              .catch(error => console.error('Error fetching messages:', error));
      }
  }, [selectedDiscussion, token]);

  useEffect(() => {
    fetchMessages();
  }, [selectedDiscussion, token]);

 const fetchMessages = () => {
    if (selectedDiscussion && selectedDiscussion.id_disc) {
        axios.get(`http://localhost:5000/messages/${selectedDiscussion.id_disc}`, 
        { headers: { Authorization: `Bearer ${JSON.parse(token).token}` }})
            .then(response => {
                setMessages(response.data);
                setNoMessagesError('');  // Clear any previous error messages
                socket.emit("join chat", selectedDiscussion.id_disc);
            })
            .catch(error => {
                if (error.response && error.response.status === 404) {
                    setNoMessagesError("Il n'y a pas de messages pour cette discussion. Soyez le premier à envoyer un message.");
                } else {
                    console.error('Error fetching messages:', error);
                }
            });
    }
};
  
  useEffect(() => {
    if (selectedDiscussion && selectedDiscussion.id_disc) {
        socket.emit('join chat', selectedDiscussion.id_disc);
    }
  }, [selectedDiscussion]);
  
  const handleSendMessage = () => {
    if (selectedDiscussion && newMessage.trim()) {
        axios.post(`http://localhost:5000/message/${selectedDiscussion.id_disc}`, 
            { contenu: newMessage },
            { headers: { Authorization: `Bearer ${JSON.parse(token).token}` } }
        )
        .then(response => {
            const sentMessage = response.data;
            setNewMessage('');
            fetchMessages();
            socket.emit("new message", {
                room: selectedDiscussion.id_disc,
                message: sentMessage,
                userId: userId,
            });
            socket.emit('stop typing', selectedDiscussion.id_disc);
        })
        .catch(error => console.error('Error sending message:', error));
    }
};

const handleTyping = (e) => {
    setNewMessage(e.target.value);
    if (!typing) {
        setTyping(true);
        socket.emit('typing', selectedDiscussion.id_disc);
    }
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
        setTyping(false);
        socket.emit('stop typing', selectedDiscussion.id_disc);
    }, 3000);
};

const fetchUserDetails = async (userId) => {
    try {
        const response = await axios.get(`http://localhost:5000/profil/${userId}`,
        { headers: { Authorization: `Bearer ${JSON.parse(token).token}` } }
        );
        return {
            id: userId,
            nom: response.data.user.nom,
            prenom: response.data.user.prenom,
            photo: response.data.user.photo
        };
    } catch (error) {
        console.error('Error fetching user details:', error);
        return null;
    }
};

return (
    <Grid container spacing={2}>
        <Grid item xs={3}>
        <Box sx={{ maxHeight: '90vh', overflow: 'auto' }}>
                <Typography variant="h6">
                    Discussions
                    <Button variant="contained" color="primary" onClick={handleOpenModal}>
                        Créer nouvelle discussion
                    </Button>
                </Typography>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Rechercher une discussion..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ mb: 2 }}
                />
            <Modal
                    open={openModal}
                    onClose={handleCloseModal}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    {modalBody}
                </Modal>
                <List>
                    {filteredDiscussions.map((discussion) => (
                        <ListItem button key={discussion.id_disc} onClick={() => setSelectedDiscussion(discussion)}>
                            <Box sx={{ width: '100%', bgcolor: '#4299e1', boxShadow: 3, p: 2, borderRadius: 2 }}>
                                <ListItemText
                                    primary={discussion.nomDisc}
                                    secondary={discussion.date_fin ? `valable jusqu'à ${new Date(discussion.date_fin).toLocaleDateString('fr-FR')}` : ''}
                                />
                            </Box>
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Grid>
        <Grid item xs={6}>  
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '90vh' }}>
        <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
            <Typography variant="h6">Messages</Typography>
            <List>
              {messages.length > 0 ? (
                  messages.map((message) => (
                      <ListItem key={message.id_msg} alignItems="flex-start">
                          <Avatar
                              src={message.utilisateur && message.utilisateur.photo ? `http://localhost:5000/${message.utilisateur.photo}` : 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'}
                              alt={message.utilisateur ? `${message.utilisateur.prenom} ${message.utilisateur.nom}` : 'Unknown User'}
                              sx={{ width: 56, height: 56, marginRight: 2 }}
                          />
                          <ListItemText
                              primary={message.contenu}
                              secondary={
                                  <React.Fragment>
                                      <Typography component="span" variant="body2" color="textPrimary">
                                          {message.utilisateur ? `${message.utilisateur.prenom} ${message.utilisateur.nom}` : 'Unknown User'}
                                      </Typography>
                                  </React.Fragment>
                              }
                          />
                      </ListItem>
                  ))
              ) : (
                  <Typography sx={{ mt: 2, textAlign: 'center' }}>
                      {noMessagesError || "Cliquez sur une discussion pour commencer à chatter."}
                  </Typography>
              )}
            </List>
        </Box>
        <Box component="form" sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            {isTyping && (
                <Box sx={{ width: '100%', textAlign: 'center' }}>
                    <Lottie options={defaultOptions} height={40} width={70} />
                </Box>
            )}
            <TextField
                fullWidth
                variant="outlined"
                placeholder="Type a message..."
                value={newMessage}
                onChange={handleTyping}
                sx={{ mr: 1 }}
            />
            <Button variant="contained" color="primary" onClick={handleSendMessage}>
                Envoyer
            </Button>
        </Box>
    </Box>
</Grid>
        <Grid item xs={3}>  
            <Box sx={{ maxHeight: '90vh', overflow: 'auto' }}>
                <Typography variant="h6">Utilisateurs connectés</Typography>
                <List>
                    {connectedUsers.map((user, index) => (
                        <ListItem key={index}>
                            <Avatar src={`http://localhost:5000/${user.photo}`} alt={`${user.prenom} ${user.nom}`} sx={{ width: 56, height: 56, marginRight: 2 }} />
                            <ListItemText primary={`${user.prenom} ${user.nom}`} />
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Grid>
    </Grid>
  );
}

export default MessagePage;