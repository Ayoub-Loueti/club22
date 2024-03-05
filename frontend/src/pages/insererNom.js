import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/ooredoo3.png'; // Make sure this path matches your file structure
import Swal from 'sweetalert2';
import '../assets/insererNom.css'
function InsererNom() {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [genre, setGenre] = useState('');
  const navigate = useNavigate();


const handleUpdateUser = async (e) => {
  e.preventDefault();
  const token = JSON.parse(localStorage.getItem('login')).token;

  try {
    await axios.put(
      'http://localhost:5000/updateCompte',
      { nom, prenom, genre },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    Swal.fire({
      icon: 'success',
      title: 'Profile updated successfully!',
      showConfirmButton: false,
      timer: 1500,
    }).then(() => {
      navigate('/profile');
    });
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Failed to update profile. Please try again.',
    });
  }
};

  return (
    <div className="page">
      <form className="form" onSubmit={handleUpdateUser}>
        <h2>Update Profile</h2>
        <input
          className="input"
          type="text"
          placeholder="Nom"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
        />
        <input
          className="input"
          type="text"
          placeholder="Prenom"
          value={prenom}
          onChange={(e) => setPrenom(e.target.value)}
          required
        />
        <select
          className="input"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          required
        >
          <option value="">Select Genre...</option>
          <option value="homme">Homme</option>
          <option value="femme">Femme</option>
        </select>
        <button className="button" type="submit">
          Update Profile
        </button>
      </form>
    </div>
  );
}

export default InsererNom;
