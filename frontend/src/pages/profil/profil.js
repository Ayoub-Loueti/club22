import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaBookmark } from 'react-icons/fa';
import Navbar from '../../components/navbar/navbar';
import NavbarHaut from '../../components/navbar/navbarHaut';
import './profil.css';
import { useTranslation } from 'react-i18next';
import PostProfile from '../../components/postProfil/postProfil';
import PostSavedModal from '../../components/PostSavedModal/PostSavedModal';
import ScrollToTop from '../../components/designs/ScrollToTop';

function Profil() {
  const { id } = useParams();
  const navigate = useNavigate();
  const storedData = JSON.parse(localStorage.getItem('login'));
  const token = storedData?.token;
  const userId = JSON.parse(localStorage.getItem('userId'));
  const isOwnProfile = userId?.toString() === id;
  const [modalOpened, setModalOpened] = useState(false);
  const [utilisateur, setUtilisateur] = useState({});
  const { t } = useTranslation();

  const [editing, setEditing] = useState({
    nom: false,
    prenom: false,
    genre: false,
    description: false,
  });
  const [editValues, setEditValues] = useState({
    nom: '',
    prenom: '',
    genre: '',
    description: '',
  });

  const fileInputRef = useRef(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (token && id) {
        try {
          const response = await axios.get(
            `http://54.242.240.123/profil/${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setUtilisateur(response.data.user);
          setEditValues({
            nom: response.data.user.nom,
            prenom: response.data.user.prenom,
            genre: response.data.user.genre,
            description: response.data.user.description,
          });
        } catch (error) {
          console.error(
            "Erreur lors de la récupération des données de l'utilisateur",
            error
          );
          Swal.fire(
            'Erreur',
            t('Impossible de récupérer les données de l’utilisateur.'),
            'error'
          );
        }
      }
    };
    fetchUserData();
  }, [token, id]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    if (name === 'description' && value.length > 50) return;
    if ((name === 'nom' || name === 'prenom') && value.length > 15) return;

    setEditValues({ ...editValues, [name]: value });
  };

  const toggleEdit = (field) => {
    setEditing({ ...editing, [field]: !editing[field] });
  };

  const handleUpdate = async (field) => {
    if (field === 'description' && editValues[field].length > 50) {
      console.error('La description ne peut pas dépasser 30 caractères');
      return;
    }
    if (
      (field === 'nom' || field === 'prenom') &&
      editValues[field].length > 15
    ) {
      console.error(
        'Le nom et le prénom ne peuvent pas dépasser 11 caractères'
      );
      return;
    }
    try {
      await axios.put(
        'http://54.242.240.123/updateCompte',
        { [field]: editValues[field] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUtilisateur({ ...utilisateur, [field]: editValues[field] });
      toggleEdit(field);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'utilisateur", error);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('photo', file);
    try {
      const response = await axios.post(
        'http://54.242.240.123/updateProfilePicture',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        window.location.reload();
      } else {
        console.error('Failed to upload the image');
      }
    } catch (error) {
      console.error('Error during the image upload', error);
    }
  };
  const handleDeleteProfilePicture = async () => {
    Swal.fire({
      title: t('Êtes-vous sûr(e) ?'),
      text: t('Vous ne pourrez pas revenir en arrière !'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: t('Oui, supprimer !'),
      cancelButtonText: t('Annuler'),
    }).then((result) => {
      if (result.isConfirmed) {
        deleteProfilePicture();
      }
    });
  };

  const deleteProfilePicture = async () => {
    try {
      const response = await axios.delete(
        'http://54.242.240.123/profile-picture',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200) {
        Swal.fire({
          title: t('Supprimée !'),
          text: t('Votre photo de profil a été supprimée.'),
          icon: 'success',
          confirmButtonText: 'OK',
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload();
          }
        });
      }
    } catch (error) {
      console.error(
        'Erreur lors de la suppression de la photo de profil :',
        error
      );
      Swal.fire(
        t('Erreur !'),
        t(
          "Votre photo de profil n'a pas pu être supprimée. Veuillez réessayer plus tard."
        ),
        'error'
      );
    }
  };
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };
  function useOutsideClick(ref, callback) {
    useEffect(() => {
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          callback();
        }
      }

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [ref, callback]);
  }
  useOutsideClick(dropdownRef, () => {
    if (showDropdown) setShowDropdown(false);
  });

  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwordValues, setPasswordValues] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordValues({ ...passwordValues, [name]: value });
  };

  const handlePasswordUpdate = async () => {
    if (passwordValues.newPassword !== passwordValues.confirmNewPassword) {
      Swal.fire({
        title: t('Erreur'),
        text: t('Les nouveaux mots de passe ne correspondent pas'),
        icon: 'error',
      });
      return;
    }
    try {
      const response = await axios.post(
        'http://54.242.240.123/changer-mdp',
        {
          motDePasse: passwordValues.currentPassword,
          newMDP: passwordValues.newPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        setShowPasswordChange(false);
        setPasswordValues({
          currentPassword: '',
          newPassword: '',
          confirmNewPassword: '',
        });
        Swal.fire({
          title: t('Succès'),
          text: t('Your password has been successfully changed.'),
          icon: 'success',
        });
      }
    } catch (error) {
      if (error.response) {
        console.error(
          'Erreur lors du changement de mot de passe',
          error.response.data
        );
        Swal.fire({
          title: t('Erreur'),
          text: t('Mot de passe actuel incorrect.'),
          icon: 'error',
        });
      } else if (error.request) {
        console.error(
          'Erreur lors du changement de mot de passe',
          error.request
        );
        Swal.fire({
          title: t('Erreur'),
          text: t('Aucune réponse du serveur'),
          icon: 'error',
        });
      } else {
        console.error('Erreur', error.message);
        Swal.fire({
          title: t('Erreur'),
          text: t('Erreur lors de la requête'),
          icon: 'error',
        });
      }
    }
  };

  return (
    <>
      <Navbar />
      <NavbarHaut />
      <ScrollToTop />

      <PostSavedModal
        modalOpened={modalOpened}
        setModalOpened={setModalOpened}
      />
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-picture-options">
            <img
              src={
                utilisateur.photo
                  ? `http://54.242.240.123/${utilisateur.photo}`
                  : 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'
              }
              alt="Profil"
              className="profile-picturee"
            />
            {isOwnProfile && (
              <>
                <button
                  onClick={toggleDropdown}
                  className="dropdown-toggle-btn"
                >
                  ⋮
                </button>{' '}
                {showDropdown && (
                  <div className="dropdown-menu" ref={dropdownRef}>
                    <div onClick={() => fileInputRef.current.click()}>
                      {' '}
                      📸 {t('Changer photo')}
                    </div>
                    <div onClick={handleDeleteProfilePicture}>
                      🗑️ {t('Supprimer photo')}
                    </div>
                  </div>
                )}
                <input
                  type="file"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                />
              </>
            )}
            <input
              type="file"
              onChange={handleFileChange}
              ref={fileInputRef}
              style={{ display: 'none' }}
            />

            <h1>{`${utilisateur.prenom} ${utilisateur.nom} `}</h1>
          </div>{' '}
        </div>

        {isOwnProfile && (
          <div className="view-saved-posts-container">
            <button
              className="open-saved-posts-btn"
              onClick={() => setModalOpened(true)}
            >
              <FaBookmark className="saved-posts-icon" />
              <span>{t('ENREGISTREMENTS')}</span>
            </button>
          </div>
        )}
        <div className="profile-bio">
          <h2>Description</h2>
          {editing.description && isOwnProfile ? (
            <textarea
              name="description"
              value={editValues.description}
              onChange={handleEditChange}
              onBlur={() => handleUpdate('description')}
              className="edit-input-desc"
            />
          ) : (
            <p onClick={() => isOwnProfile && toggleEdit('description')}>
              {utilisateur.description ||
                t('Profil en cours de personnalisation!')}
            </p>
          )}
          {isOwnProfile && (
            <span
              onClick={() => toggleEdit('description')}
              className="edit-icon-desc"
            >
              📝
            </span>
          )}
        </div>
        <div className="profile-info">
          {showPasswordChange ? (
            <div className="password-change-form">
              <div className="info-item">
                <span className="info-label">{t('Mot de passe actuel')}:</span>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordValues.currentPassword}
                  onChange={handlePasswordChange}
                  className="edit-input"
                />
              </div>
              <div className="info-item">
                <span className="info-label">{t('Nouveau mot de passe')}:</span>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordValues.newPassword}
                  onChange={handlePasswordChange}
                  className="edit-input"
                />
              </div>
              <div className="info-item">
                <span className="info-label">
                  {t('Confirmer nouveau mot de passe')}:
                </span>
                <input
                  type="password"
                  name="confirmNewPassword"
                  value={passwordValues.confirmNewPassword}
                  onChange={handlePasswordChange}
                  className="edit-input"
                />
              </div>
              <div className="button-groupee">
                <button
                  onClick={handlePasswordUpdate}
                  className="confirm-buttonee"
                >
                  {t('Confirmer')}
                </button>
                <button
                  onClick={() => setShowPasswordChange(false)}
                  className="cancel-buttonee"
                >
                  {t('Annuler')}
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="info-item">
                <span className="info-label">Email:</span>
                <span className="info-value">{utilisateur.email}</span>
              </div>
              <div className="capital">
                <div className="info-item">
                  <span className="info-label">{t('Nom')}:</span>
                  {editing.nom ? (
                    <input
                      type="text"
                      name="nom"
                      value={editValues.nom}
                      onChange={handleEditChange}
                      onBlur={() => handleUpdate('nom')}
                      className="edit-input"
                    />
                  ) : (
                    <span className="info-value">{utilisateur.nom}</span>
                  )}
                  {isOwnProfile && (
                    <span
                      onClick={() => toggleEdit('nom')}
                      className="edit-icon"
                    >
                      🖊️
                    </span>
                  )}
                </div>
                <div className="info-item">
                  <span className="info-label">{t('Prénom')}:</span>
                  {editing.prenom ? (
                    <input
                      type="text"
                      name="prenom"
                      value={editValues.prenom}
                      onChange={handleEditChange}
                      onBlur={() => handleUpdate('prenom')}
                      className="edit-input"
                    />
                  ) : (
                    <span className="info-value">{utilisateur.prenom}</span>
                  )}
                  {isOwnProfile && (
                    <span
                      onClick={() => toggleEdit('prenom')}
                      className="edit-icon"
                    >
                      🖊️
                    </span>
                  )}
                </div>
                <div className="info-item">
                  <span className="info-label">{t('Genre')}:</span>
                  {editing.genre ? (
                    <select
                      name="genre"
                      value={editValues.genre}
                      onChange={handleEditChange}
                      onBlur={() => handleUpdate('genre')}
                      className="edit-input"
                    >
                      <option value="homme">{t('Homme')}</option>
                      <option value="femme">{t('Femme')}</option>
                    </select>
                  ) : (
                    <span className="info-value">{utilisateur.genre}</span>
                  )}
                  {isOwnProfile && (
                    <span
                      onClick={() => toggleEdit('genre')}
                      className="edit-icon"
                    >
                      🖊️
                    </span>
                  )}
                </div>
                <div className="info-item">
                  <span className="info-label">{t('Téléphone')}:</span>
                  {editing.tel ? (
                    <input
                      type="text"
                      name="tel"
                      value={editValues.tel}
                      onChange={handleEditChange}
                      onBlur={() => handleUpdate('tel')}
                      className="edit-input"
                    />
                  ) : (
                    <span className="info-value">{utilisateur.tel}</span>
                  )}
                  {isOwnProfile && (
                    <span
                      onClick={() => toggleEdit('tel')}
                      className="edit-icon"
                    >
                      🖊️
                    </span>
                  )}
                </div>
                <div className="info-item">
                  <span className="info-label">{t('Rôle')}:</span>
                  <span className="info-value">{utilisateur.type}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">{t('Mot de passe')}</span>
                  <span
                    onClick={() => setShowPasswordChange(true)}
                    className="edit-icon"
                  >
                    🖊️
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
        <div className="separator"></div>
      </div>
      <PostProfile />
    </>
  );
}

export default Profil;
