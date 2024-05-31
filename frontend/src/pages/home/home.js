import React, { useEffect } from 'react';
import PostSide from '../../components/postSide/postSide';
import RightSide from '../../components/rightSide/rightSide';
import './home.css';
import Navbar from '../../components/navbar/navbar';
import NavbarHaut from '../../components/navbar/navbarHaut';
import LifeSide from "../../components/leftSide/leftSide";
import ScrollToTop from '../../components/designs/ScrollToTop';
import Chatbot from "../../components/chatbot/chatbot";

const Home = () => {
  useEffect(() => {
    document.body.style.backgroundColor = '#f3f3f3';

    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);
  
  return (
    <div >
      <Chatbot />
      <Navbar />
      <NavbarHaut />
      <ScrollToTop />
      <div className="Home">
        <LifeSide />
        <PostSide />
        <RightSide />
      </div>
    </div>
  );
};

export default Home;
