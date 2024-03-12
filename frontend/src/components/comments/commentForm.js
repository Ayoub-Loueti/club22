import React, { useState } from 'react';
import axios from 'axios';
import { Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

const CommentForm = ({ postId }) => {
  const [commentText, setCommentText] = useState('');
  const [showError, setShowError] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Débogage: Afficher la valeur de commentText lors de la soumission
    console.log('Comment Text on Submit:', commentText);

    if (!commentText.trim()) {
      setShowError(true);
      return; // Arrête l'exécution si le commentaire est vide
    }

    try {
      const token = JSON.parse(localStorage.getItem('login'))?.token;
      await axios.post(
        `http://localhost:5000/post/${postId}/comment`,
        { cmntr: commentText.trim() },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCommentText(''); // Réinitialise le champ de texte après la soumission réussie
      setShowError(false); // Cache le message d'erreur
      window.location.reload(); // Recharge la page après la soumission réussie
    } catch (error) {
      console.error('Error submitting comment:', error);
      setShowError(true); // Affiche le message d'erreur en cas d'erreur de soumission
    }
  };

  const handleInputChange = (event) => {
    setCommentText(event.target.value);
    if (showError) setShowError(false); // Cache le message d'erreur lors de la saisie
  };

  return (
    <form onSubmit={handleSubmit} className="commentInput">
      <div
        style={{ display: 'flex', alignItems: 'center', position: 'relative' }}
      >
        <textarea
          value={commentText}
          onChange={handleInputChange}
          placeholder="Ecrire un commentaire..."
          className="commentContent"
          style={{ width: '60%', minHeight: '30px', marginRight: '10px' }}
        />
        <button type="submit" className="postShare-button">
          Submit
        </button>
      </div>
      {showError && (
        <div style={{ marginTop: '5px' }}>
          <Card
            body
            style={{
              backgroundColor: '#f8d7da',
              borderColor: '#f5c6cb',
              color: '#721c24',
            }}
          >
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              style={{ marginRight: '5px' }}
            />
            Veuillez saisir un commentaire avant de soumettre.
          </Card>
        </div>
      )}
    </form>
  );
};

export default CommentForm;
