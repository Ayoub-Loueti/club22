import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, List, ListItem, ListItemText, Paper } from '@mui/material';
import axios from 'axios';
import io from "socket.io-client";

const Message = () => {
  const [contenu, setContenu] = useState('');
  const [messages, setMessages] = useState([]);
  const token = localStorage.getItem('login');
  const userId = localStorage.getItem('userId').replace(/"/g, '');
  const [socketConnected, setSocketConnected] = useState(false);

  const ENDPOINT = "http://localhost:5000";
  var socket, selectedChatCompare;

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup",userId);
    socket.on('connection', () => setSocketConnected(true));
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await axios.get('http://localhost:5000/messages', {
        headers: { Authorization: `Bearer ${JSON.parse(token).token}` }
      });
      setMessages(response.data.messages);
      socket.emit ("join chat",userId)
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async () => {
    try {
      await axios.post('http://localhost:5000/message', { contenu }, {
        headers: { Authorization: `Bearer ${JSON.parse(token).token}` }
      });
      fetchMessages();
      setContenu('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <Paper style={{ margin: '16px', padding: '16px' }}>
      <div style={{ width: '400px' }}>
        <List>
          {messages.map((message) => (
            <ListItem
              key={message.id_msg}
              style={{
                backgroundColor: message.employe.utilisateur.id_utilisateur === parseInt(userId) ? 'lightgreen' : '#cfe2f3',
                borderRadius: '8px',
                padding: '8px',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <img
                src={
                  message.employe.utilisateur.photo
                    ? `http://localhost:5000/${message.employe.utilisateur.photo}`
                    : 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'
                }
                alt="Photo de l'employé"
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  marginRight: '10px'
                }}
              />
              <ListItemText
                primary={message.contenu}
                secondary={
                  <Typography component="span" variant="body2" color="textPrimary">
                    Envoyé par: {message.employe.utilisateur.nom}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      </div>
      <div style={{ marginTop: '16px' }}>
        <TextField
          label="Message"
          variant="outlined"
          value={contenu}
          onChange={(e) => setContenu(e.target.value)}
          fullWidth
        />
        <Button variant="contained" color="primary" onClick={sendMessage} style={{ marginTop: '16px' }}>
          Envoyer
        </Button>
      </div>
    </Paper>
  );
};

export default Message;
