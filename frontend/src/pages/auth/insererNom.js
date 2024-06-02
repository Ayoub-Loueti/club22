import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../../assets/insererNom.css';

function InsererNom() {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [genre, setGenre] = useState('');
  const [tel, setTel] = useState('');

  const navigate = useNavigate();

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    const token = JSON.parse(localStorage.getItem('login')).token;

    try {
      const response = await axios.patch(
        'http://3.88.157.0/updateNameSurnameGenre', // Assurez-vous que cette URL correspond à votre configuration de route
        { nom, prenom, genre, tel },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Utilisez la réponse de l'API pour décider quelle alerte afficher
      if (response.data.message) {
        Swal.fire({
          icon: 'success',
          title: response.data.message, // Utilisez le message de réussite de l'API
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          const userId = JSON.parse(localStorage.getItem('userId'));
          navigate(`/profil/${userId}`); // Redirigez vers le profil de l'utilisateur
        });
      }
    } catch (error) {
      // Gérez les différents messages d'erreur retournés par votre API
      const errorMessage =
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Failed to update profile. Please try again.';
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: errorMessage,
      });
    }
  };

  return (
    <div className="page">
      <form className="form" onSubmit={handleUpdateUser}>
        <h2>Profil</h2>
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
        <input
          className="input"
          type="text"
          placeholder="Tél"
          value={tel}
          onChange={(e) => setTel(e.target.value)}
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
          Valider
        </button>
      </form>
    </div>
  );
}

export default InsererNom;
