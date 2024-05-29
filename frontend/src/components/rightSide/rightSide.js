import React, { useState } from 'react';
import './rightSide.css';

import TrendCard from '../trendCard/trendCard';
import ShareModal from '../shareModal/shareModal';
const RightSide = () => {
  const [modalOpened, setModalOpened] = useState(false);
  return (
    <div className="RightSide">
     

      <TrendCard />
      <ShareModal modalOpened={modalOpened} setModalOpened={setModalOpened} />

     
    </div>
  );
};

export default RightSide;
/*  <button
        className="r-button" // Ensure you have this class styled as needed
        onClick={() => {
          console.log('Opening modal...');
          setModalOpened(true);
        }}
      >
        Partager
      </button>dd c*/