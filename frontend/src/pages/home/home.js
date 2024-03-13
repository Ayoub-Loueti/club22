import React, { useEffect } from 'react';
import PostSide from '../../components/postSide/postSide';
import RightSide from '../../components/rightSide/rightSide';
import './home.css';
import Navbar from '../../components/navbar/navbar';
import NavbarHaut from '../../components/navbar/navbarHaut';
const Home = () => {
  useEffect(() => {
    // Appliquer la couleur de fond à la page Home lors du montage
    document.body.style.backgroundColor = '#f3f3f3';

    // Nettoyer le style lors du démontage de la page Home
    return () => {
      document.body.style.backgroundColor = ''; // Réinitialiser ou définir sur une autre couleur par défaut
    };
  }, []);
  return (
    <div>
      <Navbar />
      <NavbarHaut />

      <div className="Home">
        <PostSide />
        <RightSide />
      </div>
    </div>
  );
};

export default Home;
