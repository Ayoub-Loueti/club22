import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Importez Routes
import Login from './pages/auth/login';
import Signup from './pages/auth/signup';
import VerificationToken from './pages/auth/verificationToken';
import ChangerPass from './pages/auth/changerPass';
import VerificationSignup from './pages/auth/verificationSignup';
import LogoutButton from './pages/logoutButton';
import InsererNom from './pages/auth/insererNom';
import Load from './pages/auth/load';
import TousLesUtilisateurs from './pages/admin/TousLesUtilisateurs/tousLesUtilisateurs';
import Profil from './pages/profil/profil';
import ListClient from './pages/admin/listClient/listClient';
import ListEmploye from './pages/admin/listEmploye/listEmploye';
import Navbar from './components/navbar/navbar';
import NavbarHaut from './components/navbar/navbarHaut';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import Home from './pages/home/home';
import ListCollaborateur from './pages/admin/collaborateur/listCollaborateur';
import ListCollab from './pages/admin/collaborateur/listCollab';
import OffreAdmin from './pages/admin/offre/offreAdmin';
import ListReservation from './pages/admin/reservation/listReservation';
import CollaborateurPage from './pages/OffreEmploye/collaborateurPage';
import OffreEmploye from './pages/OffreEmploye/OffreEmploye';
import OffreEmployeDetails from './pages/OffreEmploye/OffreEmployeDetails';
import CollaborateurClickPage from './pages/OffreEmploye/collabClickPage';
import MyReservations from './pages/OffreEmploye/myReservation';

function App() {
  return (
    <React.StrictMode>
      <Router>
        <div className="App">
          <Routes>
            <Route
              path="/"
              element={
                <PublicRoute>
                  {' '}
                  <Login />{' '}
                </PublicRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <PublicRoute>
                  {' '}
                  <Signup />{' '}
                </PublicRoute>
              }
            />
            <Route
              path="/logout"
              element={
                <ProtectedRoute>
                  {' '}
                  <LogoutButton />{' '}
                </ProtectedRoute>
              }
            />
            <Route
              path="/insererNom"
              element={
                <ProtectedRoute>
                  {' '}
                  <InsererNom />{' '}
                </ProtectedRoute>
              }
            />
            <Route
              path="/listClient"
              element={
                <ProtectedRoute>
                  {' '}
                  <ListClient />{' '}
                </ProtectedRoute>
              }
            />
            <Route
              path="/listEmploye"
              element={
                <ProtectedRoute>
                  {' '}
                  <ListEmploye />{' '}
                </ProtectedRoute>
              }
            />
            <Route
              path="/listCollaborateur"
              element={
                <ProtectedRoute>
                  {' '}
                  <ListCollaborateur />{' '}
                </ProtectedRoute>
              }
            />
            <Route
              path="/listCollab"
              element={
                <ProtectedRoute>
                  {' '}
                  <ListCollab />{' '}
                </ProtectedRoute>
              }
            />
              <Route
              path="/MesReservations"
              element={
                <ProtectedRoute>
                  {' '}
                  <MyReservations />{' '}
                </ProtectedRoute>
              }
            />
            <Route
              path="/OffreAdmin"
              element={
                <ProtectedRoute>
                  {' '}
                  <OffreAdmin />{' '}
                </ProtectedRoute>
              }
            />
            <Route
              path="/listReservation"
              element={
                <ProtectedRoute>
                  {' '}
                  <ListReservation />{' '}
                </ProtectedRoute>
              }
            />
            <Route
              path="/collabPage"
              element={
                <ProtectedRoute>
                  {' '}
                  <CollaborateurPage />{' '}
                </ProtectedRoute>
              }
            />
            <Route
              path="/collabPage/:collabId"
              element={
                <ProtectedRoute>
                  {' '}
                  <CollaborateurClickPage />{' '}
                </ProtectedRoute>
              }
            />
            <Route
              path="/offrePage"
              element={
                <ProtectedRoute>
                  {' '}
                  <OffreEmploye />{' '}
                </ProtectedRoute>
              }
            />
            <Route
              path="/offrePageDetails/:offreId"
              element={
                <ProtectedRoute>
                  {' '}
                  <OffreEmployeDetails />{' '}
                </ProtectedRoute>
              }
            />
            <Route
              path="/verificationToken/:email"
              element={<VerificationToken />}
            />
            <Route path="/changerPass/:token" element={<ChangerPass />} />
            <Route path="/load" element={<Load />} />
            <Route
              path="/tousLesUtilisateurs"
              element={
                <ProtectedRoute>
                  <TousLesUtilisateurs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profil/:id"
              element={
                <ProtectedRoute>
                  {' '}
                  <Profil />{' '}
                </ProtectedRoute>
              }
            />
            <Route
              path="/navbar"
              element={
                <ProtectedRoute>
                  <Navbar />{' '}
                </ProtectedRoute>
              }
            />
            <Route
              path="/navbarHaut"
              element={
                <ProtectedRoute>
                  <NavbarHaut />{' '}
                </ProtectedRoute>
              }
            />
            <Route
              path="/navbarHaut"
              element={
                <ProtectedRoute>
                  <NavbarHaut />
                </ProtectedRoute>
              }
            />
            <Route path="/home" element={<Home />} />
            <Route
              path="/activate-account/:userId/:token"
              element={<VerificationSignup />}
            />
          </Routes>
        </div>
      </Router>
    </React.StrictMode>
  );
}

export default App;
