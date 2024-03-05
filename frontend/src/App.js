import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Importez Routes
import Login from './pages/login';
import Signup from './pages/signup';
import VerificationToken from './pages/verificationToken';
import ChangerPass from './pages/changerPass';
import VerificationSignup from './pages/verificationSignup';
import LogoutButton from './pages/logoutButton';
import InsererNom from './pages/insererNom';
import Load from './pages/load';
import TousLesUtilisateurs from './pages/tousLesUtilisateurs';
import Profil from './pages/profil';
import ListClient from "./pages/listClient";
import ListEmploye from "./pages/listEmploye";
import Navbar from './components/navbar';
import NavbarHaut from './components/navbarHaut';
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/logout" element={<LogoutButton />} />
          <Route path="/insererNom" element={<InsererNom />} />
          <Route path="/listClient" element={<ListClient />} />
          <Route path="/listEmploye" element={<ListEmploye />} />
          <Route
            path="/verificationToken/:email"
            element={<VerificationToken />}
          />
          <Route path="/changerPass/:token" element={<ChangerPass />} />
          <Route path="/load" element={<Load />} />
          <Route
            path="/tousLesUtilisateurs"
            element={<TousLesUtilisateurs />}
          />
          <Route path="/profil" element={<Profil />} />
          <Route path="/navbar" element={<Navbar />} />
          <Route path="/navbarHaut" element={<NavbarHaut />} />

          <Route
            path="/activate-account/:userId/:token"
            element={<VerificationSignup />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
