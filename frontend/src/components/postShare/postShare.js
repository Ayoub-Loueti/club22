import React, { useState, useRef,useEffect } from 'react';
import './postShare.css';
import {
  UilScenery,
  UilPlayCircle,
  UilLocationPoint,
  UilSchedule,
  UilTimes,
} from '@iconscout/react-unicons';
import '../navbar/navbar.css';
import Swal from 'sweetalert2';
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
  if (event.target.files) {
    const files = Array.from(event.target.files).map(file =>
      ({
        image: URL.createObjectURL(file),
        file: file,
      })
    );

    setImage(files); // Set state with an array of files
  }
};


const handleSubmit = async (e) => {
  e.preventDefault();
  if (!contenu.trim()) {
    // Afficher un message indiquant que le message ne peut pas être vide
    Swal.fire({
      icon: 'warning',
      title: 'Oops...',
      text: 'Veuillez saisir du contenu avant de partager.',
    });
    return;
  }
 
  if (contenu.length > 400) {
    // Afficher un message indiquant que la limite de caractères a été dépassée
    Swal.fire({
      icon: 'warning',
      title: 'Oops...',
      text: 'Vous ne pouvez saisir que jusqu\'à 400 caractères.',
    });
    return;
  }
  const formData = new FormData();
  formData.append('contenu', contenu);

  // Append all selected files to formData
  if (image && image.length) {
      image.forEach(img => {
          formData.append('photos', img.file); // Use 'photos' as the name
      });
  }

  const config = {
      headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
      },
  };

  try {
      const response = await axios.post('http://localhost:5000/createPost', formData, config);
      
      console.log(response.data.message);
      window.location.reload();

      setContenu('');
      setImage(null);
  } catch (error) {
      console.error('Error submitting the post: ', error.response ? error.response.data : error.message);
  }
};


const cancelImage = (index) => {
  setImage(image.filter((file, i) => i !== index));
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
          className="profile-image-pub"
        />
      ) : (
        <img
          src="https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
          alt="Profil par défaut"
          className="profile-image-pub"
        />
      )}
      <div>
        <input
          type="text"
          placeholder="À quoi penses-tu?"
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
            Partager
          </button>
          <div style={{ display: 'none' }}>
            <input
              type="file"
              name="myImage"
              multiple
              ref={imageRef}
              onChange={onImageChange}
            />
          </div>
        </div>
        {image &&
          image.map((file, index) => (
            <div key={index} className="previewImage">
              <UilTimes onClick={() => cancelImage(index)} />
              {file.file.type.startsWith('image') ? (
                <img src={file.image} alt="" />
              ) : (
                <video className="previewVideo" controls src={file.image} />
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default PostShare;