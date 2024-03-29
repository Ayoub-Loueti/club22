import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';


function CollaborateurForm({ onRequestClose, onSuccess }) {
  const [nom, setNom] = useState('');
  const [adresse, setAdresse] = useState('');
  const [email, setEmail] = useState('');
  const [type, setType] = useState('');
  const [tel, setTel] = useState('');
  const [siteWeb, setSiteWeb] = useState('');
  const [logo, setLogo] = useState('');

  const token = localStorage.getItem('login');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newCollaborateur = { nom, type, adresse, tel, email, siteWeb, logo };

    try {
      const response = await axios.post(
        'http://localhost:5000/collaborator',
        newCollaborateur,
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(token).token}`,
          },
        }
      );
      console.log(response.data.message); // Message de confirmation
      Swal.fire({
        icon: 'success',
        title: 'Succès',
        text: 'Le collaborateur a été ajouté avec succès.',
      });
       onSuccess();
      onRequestClose(); // Fermer le modal après l'ajout
    } catch (error) {
      console.error('Error adding collaborateur:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: "Une erreur est survenue lors de l'ajout du collaborateur.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Nom:
        <input
          type="text"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
        />
      </label>
      <label>
        Type:
        <input
          type="text"
          value={type}
          onChange={(e) => setType(e.target.value)}
        />
      </label>
      <label>
        Adresse:
        <input
          type="text"
          value={adresse}
          onChange={(e) => setAdresse(e.target.value)}
        />
      </label>
      <label>
        Tel:
        <input
          type="text"
          value={tel}
          onChange={(e) => setTel(e.target.value)}
        />
      </label>
      <label>
        Email:
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label>
        Site Web:
        <input
          type="text"
          value={siteWeb}
          onChange={(e) => setSiteWeb(e.target.value)}
        />
      </label>
      <label>
        Logo:
        <input
          type="text"
          value={logo}
          onChange={(e) => setLogo(e.target.value)}
        />
      </label>
      <button type="submit">Ajouter Collaborateur</button>
    </form>
  );
}

export default CollaborateurForm;
