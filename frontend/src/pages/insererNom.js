import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/ooredoo3.png'; // Make sure this path matches your file structure

function InsererNom() {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [genre, setGenre] = useState('');
  const navigate = useNavigate();

  const pageStyles = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
  };

  const formStyles = {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    maxWidth: '600px',
    width: '100%',
    textAlign: 'center',
    margin: '20px',
  };

  const inputStyles = {
    padding: '10px',
    margin: '10px 0',
    borderRadius: '5px',
    border: '1px solid #ddd',
    width: 'calc(100% - 22px)', // Accounting for padding and border
  };

  const buttonStyles = {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '20px',
    fontSize: '16px',
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    const token = JSON.parse(localStorage.getItem('login')).token;

    try {
      await axios.put(
        'http://localhost:5000/updateCompte',
        {
          nom,
          prenom,
          genre,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert('Profile updated successfully!');
      navigate('/profile');
    } catch (error) {
      alert('Failed to update profile. Please try again.');
    }
  };

  return (
    <div style={pageStyles}>
      <form style={formStyles} onSubmit={handleUpdateUser}>
        <h2>Update Profile</h2>
        <input
          style={inputStyles}
          type="text"
          placeholder="Nom"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
        />
        <input
          style={inputStyles}
          type="text"
          placeholder="Prenom"
          value={prenom}
          onChange={(e) => setPrenom(e.target.value)}
          required
        />
        <select
          style={inputStyles}
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          required
        >
          <option value="">Select Genre...</option>
          <option value="homme">Homme</option>
          <option value="femme">Femme</option>
        </select>
        <button type="submit" style={buttonStyles}>
          Update Profile
        </button>
      </form>
    </div>
  );
}

export default InsererNom;
