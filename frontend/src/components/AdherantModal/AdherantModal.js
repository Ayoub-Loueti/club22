import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import './AdherantModal.css';
import Swal from 'sweetalert2';

Modal.setAppElement('#root');

const DemandeModal = ({ isOpen, onRequestClose, userId }) => {
  const [description, setDescription] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [isAdherant, setIsAdherant] = useState(false);
  const [error, setError] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false); // New state for tracking checkbox

  useEffect(() => {
    const token = localStorage.getItem('login');
    const storedUserId = JSON.parse(localStorage.getItem('userId'));

    const fetchUserData = async () => {
      if (token && storedUserId) {
        try {
          const response = await axios.get(
            `http://localhost:5000/profil/${storedUserId}`,
            { headers: { Authorization: `Bearer ${JSON.parse(token).token}` } }
          );
          setUserInfo(response.data.user);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    const fetchIsAdherant = async () => {
      if (token && storedUserId) {
        try {
          const response = await axios.get(
            `http://localhost:5000/isAdherant`,
            { headers: { Authorization: `Bearer ${JSON.parse(token).token}` } }
          );
          setIsAdherant(response.data.adherant);
        } catch (error) {
          console.error("Error fetching adherant status:", error);
        }
      }
    };

    fetchUserData();
    fetchIsAdherant();
  }, [isOpen]);

  const handleDemande = async () => {
    const token = JSON.parse(localStorage.getItem('login'))?.token;
    if (!token) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'You need to be logged in to submit a request.',
      });
      return;
    }

    try {
      await axios.post('http://localhost:5000/demandes', { description }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Swal.fire(
        'Request Submitted!',
        'Your demande has been successfully submitted.',
        'success'
      ).then((result) => {
        if (result.isConfirmed || result.isDismissed) {
          onRequestClose();
        }
      });
    } catch (err) {
      // Handling specific error response if demande already sent or other errors
      if (err.response && err.response.status === 409) { // Assuming 409 status code for conflict/duplicate
        Swal.fire({
          icon: 'error',
          title: 'Already Submitted',
          text: 'You have already submitted a demande. Please wait for processing.',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Submission Failed',
          text: 'Failed to submit your demande. Please try again.',
        });
      }
      console.error("Failed to submit demande:", err.response?.data || err.message);
    }
  };

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: '40%',
      border: '1px solid #ccc',
      background: '#fff',
      overflow: 'auto',
      borderRadius: '10px',
      outline: 'none',
      padding: '20px',
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(3px)',
    },
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
      contentLabel="Demande Modal"
    >
      {error && <p className="error">{error}</p>}
      <div>
        <h2>{isAdherant ? "Annulation du contrat adhérant" : "Demande pour devenir un adhérant"}</h2>
        {userInfo && (
          <>
            <img 
            src={userInfo.photo ? `http://localhost:5000/${userInfo.photo}` : 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'} 
            alt="User" 
            className="modal-user-photo"  />
            
            <h3>{userInfo.nom} {userInfo.prenom}</h3>
            <p>{userInfo.email}</p>
          </>
        )}
        <textarea
          placeholder="Entrez la description de votre demande ici"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        <div className="terms-container" style={{ height: '150px', overflowY: 'scroll', marginBottom: '10px', border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
          <p>Termes et Conditions d'Utilisation

En cochant cette case, vous acceptez les termes et conditions suivants : Vous vous engagez à utiliser cette plateforme dans le respect des lois et règlements en vigueur. Vous garantissez la véracité et l'exactitude des informations fournies lors de vos demandes. Notre service se réserve le droit de modifier, à tout moment et sans préavis, les services proposés ainsi que les présents termes et conditions. Il est de votre responsabilité de consulter régulièrement ces termes et conditions pour vous tenir informé des éventuelles modifications. Toute utilisation du service après modification des termes et conditions vaut acceptation de votre part des nouvelles conditions. Nous nous engageons à protéger vos données personnelles et à respecter votre vie privée conformément à notre politique de confidentialité. Vous avez le droit de demander l'accès, la rectification ou la suppression de vos données personnelles en nous contactant directement.

Ces termes et conditions sont régis et interprétés conformément aux lois du pays de l'opérateur de la plateforme. Tout litige relatif à l'interprétation ou à l'exécution de ces termes et conditions sera soumis à la juridiction exclusive des tribunaux du pays de l'opérateur.

En acceptant ces termes, vous confirmez avoir lu, compris et accepté d'être lié par ces termes et conditions, y compris toute modification future. Si vous n'êtes pas d'accord avec ces termes et conditions, vous ne devez pas utiliser ce service.
</p>
          {/* Add more paragraphs as needed */}
        </div>
        <label>
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
          />
          J'ai lu et j'accepte les termes et conditions
        </label>
        <div className="modal-actions">
          <button onClick={onRequestClose}>Annuler</button>
          <button onClick={handleDemande} disabled={!acceptedTerms}>Soumettre la Demande</button>
        </div>
      </div>
    </Modal>
  );
};

export default DemandeModal;
