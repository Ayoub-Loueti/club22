import React from 'react';
import PostSide from '../../components/postSide/postSide';
import './home.css';
import Navbar from '../../components/navbar/navbar';
import NavbarHaut from '../../components/navbar/navbarHaut';

const Home = () => {
  return (
    <div>
      <Navbar />
      <NavbarHaut />

      <div className="Home">
        <PostSide />
      </div>
    </div>
  );
};

export default Home;
