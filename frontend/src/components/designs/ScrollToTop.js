import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import logo from '../../assets/logo.png';

export default function ScrollToTop() {
  const [scrollState, setScrollState] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollState(window.pageYOffset > 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <ToTop onClick={toTop} $scrollState={scrollState}>
      <img src={logo} alt="Back to top" />
    </ToTop>
  );
}

const ToTop = styled.div`
  display: ${({ $scrollState }) => ($scrollState ? 'block' : 'none')};
  position: fixed;
  cursor: pointer;
  z-index: 10;
  bottom: 1rem;
  right: 2rem;
  img {
    height: 1.5rem;
  }
  border-radius: 2rem;
  background-color: #abdee6;
  padding: 1rem;
`;
