import React, { useState, useRef,useEffect } from 'react';
import ProfileImage from '../../img/profileImg.jpg';
import './postShare.css';
import { UilScenery } from '@iconscout/react-unicons';
import { UilPlayCircle } from '@iconscout/react-unicons';
import { UilLocationPoint } from '@iconscout/react-unicons';
import { UilSchedule } from '@iconscout/react-unicons';
import { UilTimes } from '@iconscout/react-unicons';
import '../navbar/navbar.css';
import axios from 'axios';

const PostShare = () => {
  const [image, setImage] = useState(null);
  const imageRef = useRef();
  const [contenu, setContenu] = useState('');
  const token = JSON.parse(localStorage.getItem('login'))?.token;
const [userInfo, setUserInfo] = useState(null);
const [userId, setUserId] = useState(null); // Add this line

useEffect(() => {
  const token = localStorage.getItem('login');
  const storedUserId = JSON.parse(localStorage.getItem('userId')); // Rename for clarity
  setUserId(storedUserId);

  if (token && storedUserId) {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/profil/${storedUserId}`,
          {
            headers: {
              Authorization: `Bearer ${JSON.parse(token).token}`,
            },
          }
        );
        setUserInfo(response.data.user);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données de l'utilisateur",
          error
        );
      }
    };
    fetchUserData();
  }
}, []);
const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0];
      setImage({
        image: URL.createObjectURL(img), // Preview URL for the frontend
        file: img, // Keep the File object for submission
      });
    }
  };
const handleSubmit = async (e) => {
    e.preventDefault();

    if (image) {
      // Utiliser FormData pour envoyer le contenu et l'image
      const formData = new FormData();
      formData.append('contenu', contenu);
      formData.append('image', image.file); // Utilisez le fichier d'image réel

      try {
        await axios.post('http://localhost:5000/createPost', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        });
        // Réinitialiser le formulaire après l'envoi
            window.location.reload();

        setContenu('');
        setImage(null);
        
      } catch (error) {
        console.error('Erreur lors de l\'envoi du post avec une image', error);
      }
    } else {
      // Envoyer uniquement le contenu comme JSON si aucune image n'est sélectionnée
      try {
        await axios.post('http://localhost:5000/createPost', { contenu }, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        // Réinitialiser le formulaire après l'envoi
            window.location.reload();

        setContenu('');
        
      } catch (error) {
        console.error('Erreur lors de l\'envoi du post sans image', error);
      }
    }
    
  };


  return (
    <div className="PostShare">
      {userInfo ? (
        <img
          src={
            userInfo.photo
              ? `http://localhost:5000/${userInfo.photo}`
              : 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'
          }
          alt="Profil"
          
        />
      ) : (
        <img
          src="https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
          alt="Profil par défaut"
        />
      )}
      <div>
        <input
          type="text"
          placeholder="What's happening"
          value={contenu}
          onChange={(e) => setContenu(e.target.value)}
        />
        <div className="postOptions">
          <div
            className="option"
            style={{ color: 'var(--photo)' }}
            onClick={() => imageRef.current.click()}
          >
            <UilScenery />
            Photo
          </div>
          <div className="option" style={{ color: 'var(--video)' }}>
            <UilPlayCircle />
            Video
          </div>{' '}
          <div className="option" style={{ color: 'var(--location)' }}>
            <UilLocationPoint />
            Location
          </div>{' '}
          <div className="option" style={{ color: 'var(--shedule)' }}>
            <UilSchedule />
            Shedule
          </div>
          <button className="postShare-button" onClick={handleSubmit}>
            Share
          </button>
          <div style={{ display: 'none' }}>
            <input
              type="file"
              name="myImage"
              ref={imageRef}
              onChange={onImageChange}
            />
          </div>
        </div>
        {image && (
          <div className="previewImage">
            <UilTimes onClick={() => setImage(null)} />
            <img src={image.image} alt="" />
          </div>
        )}
      </div>
    </div>
  );
};

export default PostShare;
