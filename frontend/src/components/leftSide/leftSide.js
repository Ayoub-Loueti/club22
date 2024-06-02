import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './leftSide.css';
import oorepub2 from '../../assets/oorepub2.jpg';
import oorepub3 from '../../assets/oorepub3.jpg';
import { t } from 'i18next';
import { useTranslation } from 'react-i18next';

const UserCard = ({ user, title }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleClick = () => {
    navigate(`/profil/${user.id_utilisateur}`);
  };

  return (
    <div className="user-card" onClick={handleClick}>
      <div className="user-card-title">{title}</div>
      <div className="user-container">
        <img
          src={`http://54.87.28.4/${user.photo}`}
          alt="Utilisateur"
          className="user-avatar"
        />
        <div className="user-details">
          <div>
            {user.prenom} {user.nom}
          </div>
        </div>
      </div>
    </div>
  );
};

const LeftSide = () => {
  const [showUserCard, setShowUserCard] = useState(true);
  const [bestPosteur, setBestPosteur] = useState(null);
  const [bestPostData, setBestPostData] = useState(null);
  const [bestCmntrData, setBestCmntrData] = useState(null);
  const token = JSON.parse(localStorage.getItem('login'))?.token;

  useEffect(() => {
    const fetchBestPosteur = async () => {
      try {
        const response = await axios.get('http://54.87.28.4/semainelike', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBestPosteur(response.data);
      } catch (error) {
        console.error(
          'Erreur lors de la récupération des données du tableau de bord :',
          error
        );
      }
    };

    const fetchBestPostData = async () => {
      try {
        const response = await axios.get('http://54.87.28.4/bestPost', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBestPostData(response.data);
      } catch (error) {
        console.error(
          'Erreur lors de la récupération des données du meilleur post :',
          error
        );
      }
    };

    const fetchBestCmntrData = async () => {
      try {
        const response = await axios.get('http://54.87.28.4/bestCmntr', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBestCmntrData(response.data);
      } catch (error) {
        console.error(
          'Erreur lors de la récupération des données du meilleur commentaire :',
          error
        );
      }
    };

    fetchBestPosteur();
    fetchBestPostData();
    fetchBestCmntrData();

    const interval = setInterval(() => {
      setShowUserCard((show) => !show);
    }, 6000);

    return () => clearInterval(interval);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <div className="left-side-container">
        {showUserCard ? (
          <>
            {bestPosteur && (
              <UserCard
                user={bestPosteur.userWithHighestSemaineLike.utilisateur}
                title={t('Meilleur posteur')}
              />
            )}
            {bestPostData && (
              <UserCard
                user={bestPostData.utilisateur}
                title={t('Meilleur post')}
              />
            )}
            {bestCmntrData && (
              <UserCard
                user={bestCmntrData.utilisateur}
                title={t('Meilleur commentaire')}
              />
            )}
          </>
        ) : (
          <div className="photo-container">
            <img src={oorepub2} alt="Ooredoo Advertisement" />
          </div>
        )}
      </div>
    </>
  );
};

export default LeftSide;
