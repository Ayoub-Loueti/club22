import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Importez Routes

import Login from './pages/login';
import Signup from './pages/signup';
import VerificationToken from './pages/verificationToken';
import ChangerPass from './pages/changerPass';
import VerificationSignup from './pages/verificationSignup';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verificationToken" element={<VerificationToken />} />
          <Route path="/changerPass/:token" element={<ChangerPass />} />
          <Route path="/activate-account/:userId/:token" element={<VerificationSignup />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;