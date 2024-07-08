import React from 'react';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';

import angrygif from '../../assets/fachegif.gif';
import pffgif from '../../assets/pffgif.gif';
import firegif from '../../assets/feugif.gif';
import heartgif from '../../assets/coeurgif.gif';
import wowgif from '../../assets/wowgif.gif';
import sleepgif from '../../assets/dormirgif.gif';
import crygif from '../../assets/pleurgif.gif';
import hahagif from '../../assets/hahagif.gif';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
  },
}));

const EmojiModal = ({ open, handleClose, onEmojiClick }) => {
    const classes = useStyles();
    const { t } = useTranslation();

  const emojis = [
    { src: heartgif, name: t('coeur') },
    { src: hahagif, name: 'haha' },
    { src: wowgif, name: 'wow' },
    { src: firegif, name: t('feu') },
    { src: pffgif, name: 'pff' },
    { src: crygif, name: t('pleur') },
    { src: sleepgif, name: t('dormir') },
    { src: angrygif, name: t('fache') },
  ];

  return (
    <Modal
      open={open}
      onClose={handleClose}
      className={classes.modal}
    >
      <div className={classes.paper}>
        {emojis.map((emoji, index) => (
          <div key={index} onClick={() => onEmojiClick(emoji.name)}>
            <img src={emoji.src} alt={emoji.name} style={{ width: '50px' }} />
            <span>{emoji.name}</span>
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default EmojiModal;