import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ListCollab.css';
import UpdateCollaborateurModal from './UpdateCollaborateurModal';
import AddCollaborateurModal from './AddCollaborateurModal';
import OffreCollab from '../offre/OffreCollab'; // Ensure this path is correct
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import NavAdmin from '../NavAdmin/navAdmin';
function ListCollaborateur() {
  const [collaborateurs, setCollaborateurs] = useState([]);
  const [selectedCollaborateurId, setSelectedCollaborateurId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [collaboratorAddedOrUpdated, setCollaboratorAddedOrUpdated] =
    useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const navigate = useNavigate();
  const token = localStorage.getItem('login');

  useEffect(() => {
    const fetchCollaborateurs = async () => {
      try {
        const response = await axios.get(
          'http://54.242.240.123/allCollaborators',
          {
            headers: {
              Authorization: `Bearer ${JSON.parse(token).token}`,
            },
          }
        );
        setCollaborateurs(response.data);
      } catch (error) {
        console.error('Error fetching collaborateurs:', error);
      }
    };

    if (token) {
      fetchCollaborateurs();
    }
  }, [token, collaboratorAddedOrUpdated]);

  const handleUpdate = (collaborateurId) => {
    setSelectedCollaborateurId(collaborateurId);
    setIsUpdateModalOpen(true);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleAddOrUpdateSuccess = () => {
    setCollaboratorAddedOrUpdated((prev) => !prev);
  };

  const handlePrevious = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };

  const handleNext = () => {
    const pageSize = 3;
    const totalPages = Math.ceil(collaborateurs.length / pageSize);
    const currentPage = Math.ceil((startIndex + 1) / pageSize);
    if (currentPage < totalPages) {
      setStartIndex(startIndex + pageSize);
    }
  };

  const filteredCollaborateurs = collaborateurs.filter((collaborateur) => {
    const nom = collaborateur.nom ? collaborateur.nom.toLowerCase() : '';
    const type = collaborateur.type ? collaborateur.type.toLowerCase() : '';
    const adresse = collaborateur.adresse
      ? collaborateur.adresse.toLowerCase()
      : '';
    const tel = collaborateur.tel ? collaborateur.tel.toLowerCase() : '';
    const email = collaborateur.email ? collaborateur.email.toLowerCase() : '';
    const siteWeb = collaborateur.siteWeb
      ? collaborateur.siteWeb.toLowerCase()
      : '';

    return (
      nom.includes(searchTerm.toLowerCase()) ||
      type.includes(searchTerm.toLowerCase()) ||
      adresse.includes(searchTerm.toLowerCase()) ||
      tel.includes(searchTerm.toLowerCase()) ||
      email.includes(searchTerm.toLowerCase()) ||
      siteWeb.includes(searchTerm.toLowerCase())
    );
  });

  const scrollToRef = React.createRef();

  const handleViewOffers = () => {
    if (scrollToRef.current) {
      window.scrollTo({
        top: scrollToRef.current.offsetTop,
        behavior: 'smooth',
      });
    }
  };

  const getEmailLink = (collaborateur) => {
    const subject = encodeURIComponent(
      'Suivi de notre collaboration - Ooredoo Club22'
    );
    const body = encodeURIComponent(
      "Cher Collaborateur,\n\nNous espérons que tout se passe bien pour vous. Nous tenions à vous contacter concernant notre collaboration en cours et discuter de quelques points importants.\n\nCordialement,\nL'équipe Ooredoo Club22"
    );
    return `mailto:${collaborateur.email}?subject=${subject}&body=${body}`;
  };

  const handleCopyLink = async (id_collaborateur) => {
    try {
      const response = await axios.put(
        `http://54.242.240.123/collaborateurs/${id_collaborateur}/validation`,
        {},
        {
          headers: {
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem('login')).token
            }`,
          },
        }
      );
      showAlert("Lien d'accès envoyé au collaborateur.", 'green');
    } catch (err) {
      console.error('Failed to update collaborateur validation:', err);
      showAlert('Failed to update validation', 'red');
    }
  };

  const showAlert = (message, color) => {
    const alertBox = document.createElement('div');
    alertBox.textContent = message;
    alertBox.style.cssText = `
      position: fixed;
      top: 7%;
      left: 50%;
      transform: translate(-50%, -50%);
      padding: 20px;
      border-radius: 8px;
      color: white;
      background-color: ${color};
      z-index: 100000;
      box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
      text-align: center;
      font-weight: bold;
      font-family: Arial, sans-serif;
    `;

    document.body.appendChild(alertBox);

    setTimeout(() => {
      alertBox.remove();
    }, 2000); // Remove the alert after 2 seconds
  };

  return (
    <>
      <NavAdmin />
      <div className="listCollaborateur-container">
        <h1 className="listCollaborateur-title">LISTE DES COLLABORATEURS</h1>

        <button onClick={handleOpenModal} className="list-coll-button">
          AJOUTER UN COLLABORATEUR
        </button>
        <button
          className="list-coll-button"
          onClick={() => navigate('/listCollaborateur')}
        >
          VOIR TOUS LES COLLABORATEURS
        </button>
        <button
          onClick={() => navigate('/offreAdmin')}
          className="list-coll-button"
        >
          GERER LES OFFRES
        </button>
        <AddCollaborateurModal
          isOpen={isModalOpen}
          onRequestClose={handleCloseModal}
          onSuccess={handleAddOrUpdateSuccess}
        />
        <div className="listCollaborateur-header">
          <input
            type="text"
            className="listCollaborateur-search-input"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="cards-and-navigation">
          <button
            className="prev"
            onClick={handlePrevious}
            disabled={startIndex === 0}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>

          <div className="collaborateur-scroll-container">
            {filteredCollaborateurs
              .slice(startIndex, startIndex + 3)
              .map((collaborateur, index) => (
                <div key={index} className="collaborateur-card">
                  <img
                    src={
                      collaborateur.logo
                        ? `http://54.242.240.123/${collaborateur.logo}`
                        : 'https://png.pngtree.com/png-vector/20220119/ourmid/pngtree-crossed-image-icon-picture-not-available-sign-photo-sign-icon-vector-png-image_44027862.jpg'
                    }
                    alt={collaborateur.nom}
                  />

                  <h3 className="collaborateur-card-title">
                    {collaborateur.nom}
                    <FontAwesomeIcon
                      icon={faCheck}
                      className="validation-icon"
                      onClick={() =>
                        handleCopyLink(collaborateur.id_collaborateur)
                      }
                    />
                  </h3>
                  <p className="collaborateur-card-description">
                    Catégorie :{' '}
                    <span className="description-value">
                      {collaborateur.type}
                    </span>
                  </p>
                  <p className="collaborateur-card-description">
                    Adresse :{' '}
                    <span className="description-value">
                      {collaborateur.adresse}
                    </span>
                  </p>
                  <p className="collaborateur-card-description">
                    Télephone :{' '}
                    <span className="description-value">
                      {collaborateur.tel}
                    </span>
                  </p>
                  <p className="collaborateur-card-description">
                    Email :{' '}
                    <span className="description-value">
                      {collaborateur.email && (
                        <a href={getEmailLink(collaborateur)}>
                          {collaborateur.email}
                        </a>
                      )}
                    </span>
                  </p>
                  <p className="collaborateur-card-description">
                    Site Web :{' '}
                    <span className="description-value">
                      {collaborateur.siteWeb &&
                      collaborateur.siteWeb.trim() !== '' ? (
                        <a
                          href={
                            collaborateur.siteWeb.startsWith('http')
                              ? collaborateur.siteWeb
                              : `https://${collaborateur.siteWeb}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {collaborateur.siteWeb}
                        </a>
                      ) : (
                        'non disponible'
                      )}
                    </span>
                  </p>

                  <button
                    onClick={() => handleUpdate(collaborateur.id_collaborateur)}
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCollaborateurId(
                        collaborateur.id_collaborateur
                      );
                      handleViewOffers();
                    }}
                    className="offers"
                  >
                    Voir ses Offres
                  </button>
                </div>
              ))}
          </div>
          <button
            className="next"
            onClick={handleNext}
            disabled={startIndex + 3 >= collaborateurs.length}
          >
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>

        <UpdateCollaborateurModal
          isOpen={isUpdateModalOpen}
          onRequestClose={() => setIsUpdateModalOpen(false)}
          onSuccess={handleAddOrUpdateSuccess}
          collaborateurId={selectedCollaborateurId}
        />
        <div className="stylish-separator"></div>
        {selectedCollaborateurId && (
          <div ref={scrollToRef}>
            <OffreCollab collaborateurId={selectedCollaborateurId} />
          </div>
        )}
      </div>
    </>
  );
}

export default ListCollaborateur;
