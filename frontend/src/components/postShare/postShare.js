import { useState, useRef, useEffect } from 'react';
import './postShare.css';
import { useTranslation } from 'react-i18next';
import EmojiModal from './ReactModal';
import {
  UilScenery,
  UilLocationPoint,
  UilSchedule,
  UilTimes,
} from '@iconscout/react-unicons';
import '../navbar/navbar.css';
import Swal from 'sweetalert2';
import axios from 'axios';
import LocationModal from './LocationModal';
const PostShare = () => {
  const { t } = useTranslation();

  const [image, setImage] = useState(null);
  const imageRef = useRef();
  const [contenu, setContenu] = useState('');
  const token = JSON.parse(localStorage.getItem('login'))?.token;
  const [userInfo, setUserInfo] = useState(null);
  const [userId, setUserId] = useState(null); 
  const [type, setType] = useState('');
  const [categorySelected, setCategorySelected] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [lieu, setLieu] = useState('');
  const [showEmojiModal, setShowEmojiModal] = useState(false); // State to control the Emoji Modal
  const [react, setReact] = useState(''); // State to store selected react

  const handleEmojiClick = (emojiName) => {
    setReact(emojiName);
    setShowEmojiModal(false); // Optionally close modal on emoji click
  };

  useEffect(() => {
    const token = localStorage.getItem('login');
    const storedUserId = JSON.parse(localStorage.getItem('userId'));
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

  const handleScheduleClick = () => {
    setShowEmojiModal(true); // Function to open the Emoji Modal
  };

  const onImageChange = (event) => {
    if (event.target.files) {
      const files = Array.from(event.target.files).map((file) => ({
        image: URL.createObjectURL(file),
        file: file,
      }));

      setImage(files); 
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    let errorMessages = [];
    if (!contenu.trim()) {
      errorMessages.push('Veuillez saisir du contenu.');
    }
    if (type === '') {
      errorMessages.push('Veuillez sélectionner une catégorie.');
    }
    if (contenu.length > 600) {
      errorMessages.push("Vous ne pouvez saisir que jusqu'à 600 caractères.");
    }

    if (errorMessages.length > 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        html: errorMessages.join('<br />'),
      });
      return;
    }

    const formData = new FormData();
    formData.append('contenu', contenu);
    formData.append('type', type);
    formData.append('lieu', lieu);
    formData.append('react', react); // Append the selected react
    if (image && image.length > 0) {
      image.forEach((img) => {
        formData.append('photos', img.file);
      });
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/createPost',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data.message);
      window.location.reload();

      setContenu('');
      setImage(null);
    } catch (error) {
      console.error(
        'Error submitting the post: ',
        error.response ? error.response.data : error.message
      );
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Un problème est survenu lors de la publication.',
      });
    }
  };

  /*
const handleSubmit = async (e) => {
  e.preventDefault();
  if (!contenu.trim() || type === '') {
    // Afficher un message indiquant que le message ne peut pas être vide
    Swal.fire({
      icon: 'warning',
      title: 'Oops...',
      text: 'Veuillez saisir du contenu et sélectionner une catégorie avant de partager.',
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
  formData.append('type', type);
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
*/

  const cancelImage = (index) => {
    setImage(image.filter((file, i) => i !== index));
  };

  const handleTypeChange = (newType) => {
    setType(newType);
    setCategorySelected(true);
  };
  const handleLocationClick = () => {
    setShowLocationModal(true); 
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
          placeholder={t('À quoi penses-tu?')}
          value={contenu}
          onChange={(e) => setContenu(e.target.value)}
        />
       <div className="categoryContainer">
      <span className="categoryLabel">{t('Sélectionnez une catégorie')}:</span>
      <button className={`categoryButton ${type === 'hotel' ? 'active' : ''}`} onClick={() => handleTypeChange('hotel')}>
        {t('Hôtel')}
      </button>
      <button className={`categoryButton ${type === 'voyage' ? 'active' : ''}`} onClick={() => handleTypeChange('voyage')}>
        {t('Voyage')}
      </button>
      <button className={`categoryButton ${type === 'activité' ? 'active' : ''}`} onClick={() => handleTypeChange('activité')}>
        {t('Activité')}
      </button>
      <button className={`categoryButton ${type === 'autre' ? 'active' : ''}`} onClick={() => handleTypeChange('autre')}>
        {t('Autre')}
      </button>
    </div>
        <div className="postOptions">
          <div
            className="option"
            style={{ color: 'var(--photo)' }}
            onClick={() => imageRef.current.click()}
          >
            <UilScenery />
            {t('Photo/Vidéo')}
          </div>

          <div
            className="option"
            style={{ color: 'var(--location)' }}
            onClick={handleLocationClick}
          >
            <UilLocationPoint />
            {t('Lieu')}{' '}
          </div>
         {react ? (
          <div className="option" style={{ color: 'var(--react)' }} onClick={handleScheduleClick}>
            <img src={require(`../../assets/${react}gif.gif`)} alt={react} style={{ width: '24px' }} />
            {t(react)} {/* Assuming react names are translated in your i18n setup */}
          </div>
        ) : (
          <div className="option" style={{ color: 'var(--schedule)' }} onClick={handleScheduleClick}>
            <UilSchedule />
            {t('Programme')}
          </div>
        )}
          <button className="postShare-button" onClick={handleSubmit}>
          {t ( 'Partager')}
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
      <LocationModal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        onLieuSubmit={(location) => {
          setLieu(location);
          setShowLocationModal(false);
        }}
        lieu={lieu}
        setLieu={setLieu}
      />
      <EmojiModal
        open={showEmojiModal}
        handleClose={() => setShowEmojiModal(false)}
        onEmojiClick={handleEmojiClick} // Pass the handler to EmojiModal
      />
    </div>
  );
};

export default PostShare;
