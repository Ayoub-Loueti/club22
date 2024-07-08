import Modal from 'react-modal';
import { useTranslation } from 'react-i18next';
import merci from '../../assets/merci.png';
import './RewardsModal.css';
const RewardsModal = ({ isOpen, onRequestClose, rewards }) => {
  const { t } = useTranslation();
  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: '60%',
      maxHeight: '90vh',
      border: '1px solid white',
      background: '#fff',
      overflow: 'auto',
      WebkitOverflowScrolling: 'touch',
      borderRadius: '14px',
      outline: 'none',
      padding: '20px',
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(3px)',
    },
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={customStyles}>
      <button onClick={onRequestClose} className="rewards-modal-close-btn">
        &times;
      </button>
      <h2 className="rewards-modal-header">
        {t('🎁 Récompenses chez les boutiques Ooredoo 🎁')}
      </h2>
      <div className="rewards-modal-content">
        <div className="rewards-modal-left">
          <ul className="rewards-modal-list">
            {rewards.map((reward, index) => (
              <li key={index} className="rewards-modal-list-item">
                {reward.points} points {' 👉 '} {t(reward.description)}
              </li>
            ))}
          </ul>
        </div>
        <div className="rewards-modal-right">
          <img src={merci} alt="Merci" className="rewards-modal-image" />
        </div>
      </div>
    </Modal>
  );
};

export default RewardsModal;
