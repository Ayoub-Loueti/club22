import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Importez Routes

import Login from './pages/login';
import Signup from './pages/signup';

function App() {
  return (
    <Router>
      <div className="App">
        {/* Utilisez Routes au lieu de div */}
        <Routes>
          {/* Définissez vos routes à l'intérieur de Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
