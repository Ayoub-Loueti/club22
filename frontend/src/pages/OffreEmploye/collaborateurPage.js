import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './collaborateurPage.css';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'; // Import Font Awesome icons

function CollaborateurPage() {
  const [collaborateurs, setCollaborateurs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [collaboratorAddedOrUpdated, setCollaboratorAddedOrUpdated] =
    useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('login');
    if (token) {
      const fetchCollaborateurs = async () => {
        try {
          const response = await axios.get(
            'http://localhost:5000/allCollaborateursEmploye',
            {
              headers: {
                Authorization: `Bearer ${JSON.parse(token).token}`,
              },
            }
          );
          setCollaborateurs(response.data);
        } catch (error) {
          console.error('Error:', error);
        }
      };
      fetchCollaborateurs();
    }
  }, [collaboratorAddedOrUpdated]);

  const handlePrevious = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };

  const handleNext = () => {
    if (startIndex + 4 < collaborateurs.length) {
      setStartIndex(startIndex + 1);
    }
  };

  return (
    <div className="PageCollaborateur-container">
      <div className="collabora-scroll-container">
        {collaborateurs
          .slice(startIndex, startIndex + 6)
          .map((collaborateur, index) => (
            <div key={index} className="collab-card">
              <img
                src={`http://localhost:5000/${collaborateur.logo}`}
                alt={collaborateur.nom}
              />
            </div>
          ))}
      </div>

      <div className="navig-buttons">
        <FaArrowLeft
          onClick={handlePrevious}
          disabled={startIndex === 0}
          className="nav-icon"
        />
        <FaArrowRight
          onClick={handleNext}
          disabled={startIndex + 4 >= collaborateurs.length}
          className="nav-icon"
        />
      </div>
    </div>
  );
}

export default CollaborateurPage;
