import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './adminPanel.css';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import ooredooLogo from './../../../assets/ooredoo2.png';
import NavAdmin from '../NavAdmin/navAdmin';
const AdminPanel = () => {
  const [demandes, setDemandes] = useState([]);
  const demandesRef = useRef(null);
  const token = localStorage.getItem('login')
    ? JSON.parse(localStorage.getItem('login')).token
    : '';

  useEffect(() => {
    fetchDemandes();
  }, []);

  const fetchDemandes = async () => {
    try {
      const response = await axios.get('http://3.88.157.0/demandes', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDemandes(response.data);
    } catch (error) {
      console.error('Error fetching demandes:', error);
    }
  };

  const handleUpdateAdherant = async (employeId, isCurrentlyAdherant) => {
    const message = isCurrentlyAdherant
      ? "Êtes-vous sûr de vouloir révoquer le statut d'adhérent pour cet employé?"
      : 'Êtes-vous sûr de vouloir approuver cet employé comme adhérent?';
    const confirmButtonText = isCurrentlyAdherant ? 'Révoquer' : 'Approuver';

    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText,
      cancelButtonText: 'Annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        const endpoint = isCurrentlyAdherant
          ? `/employes/${employeId}/nonAdherant`
          : `/employes/${employeId}/adherant`;
        axios
          .put(
            `http://3.88.157.0${endpoint}`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          )
          .then(() => {
            Swal.fire(
              'Mis à jour!',
              `Le statut de l'employé a été ${
                isCurrentlyAdherant ? 'révoqué' : 'approuvé'
              } avec succès.`,
              'success'
            );
            fetchDemandes(); // Refresh after update
          })
          .catch((error) => {
            console.error('Error updating adherant status:', error);
            Swal.fire(
              'Erreur!',
              `La mise à jour du statut de l'employé a échoué: ${error.message}`,
              'error'
            );
          });
      }
    });
  };

  const downloadPdf = async (dem) => {
    if (demandesRef.current) {
      const input = demandesRef.current.querySelector(
        `#demande-${dem.id_demande}`
      );
      if (!input) {
        console.error('No element with id:', `demande-${dem.id_demande}`);
        return;
      }
      const buttons = input.querySelectorAll('.ButtonAdh');
      buttons.forEach((btn) => btn.classList.add('hidden-for-pdf'));
      try {
        const canvas = await html2canvas(input, {
          scale: window.devicePixelRatio,
          useCORS: true,
        });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'pt',
          format: [612, 216],
        });

        // Set title properties
        pdf.setTextColor('#191F43');
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(18);

        // Draw the title
        const title = "Demande d'Adhésion au Programme Membre Adhérent";
        const textWidth =
          (pdf.getStringUnitWidth(title) * pdf.getFontSize()) /
          pdf.internal.scaleFactor;
        const textOffset = (pdf.internal.pageSize.getWidth() - textWidth) / 2;
        pdf.text(title, textOffset, 30);

        // Draw the Ooredoo logo
        pdf.addImage(ooredooLogo, 'PNG', 10, 5, 35, 35); // Position (x=10, y=10), Size (width=50, height=50)

        // Add the form screenshot to the PDF
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight() - 40;
        const imgWidth = imgProps.width;
        const imgHeight = imgProps.height;
        const scaleAdjustmentFactor = 0.95;
        const widthRatio = (pdfWidth / imgWidth) * scaleAdjustmentFactor;
        const heightRatio = (pdfHeight / imgHeight) * scaleAdjustmentFactor;
        const ratio = Math.min(widthRatio, heightRatio);
        const canvasWidth = imgWidth * ratio;
        const canvasHeight = imgHeight * ratio;
        const xOffset = (pdfWidth - canvasWidth) / 2;
        const yOffset = 40 + canvasHeight / 2;
        pdf.addImage(
          imgData,
          'PNG',
          xOffset,
          yOffset - canvasHeight / 2,
          canvasWidth,
          canvasHeight
        );

        pdf.save(`demande-${dem.id_demande}.pdf`);
      } catch (error) {
        console.error('Failed to generate PDF:', error);
      } finally {
        buttons.forEach((btn) => btn.classList.remove('hidden-for-pdf'));
      }
    } else {
      console.error('Demandes container not found');
    }
  };

  return (
    <>
      <NavAdmin />
      <h2
        style={{
          textAlign: 'center',
          color: '#191F43',
          fontWeight: 'bold',
          fontSize: '30px',
        }}
      >
        Liste des Demandes d'Adhésion
      </h2>
      <div className="admin-panel-container" ref={demandesRef}>
        {demandes.map((dem, index) => (
          <div
            className="admin-panel-card"
            id={`demande-${dem.id_demande}`}
            key={dem.id_demande}
          >
            <div className="admin-panel-card1-adh">
              <div className="profile-info-adh">
                <img
                  src={
                    dem.employe.utilisateur.photo
                      ? `http://3.88.157.0/${dem.employe.utilisateur.photo}`
                      : 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'
                  }
                  alt="Profil"
                  className="profile-pictureADH"
                />
                <div className="user-info-adh">
                  <p>{`${dem.employe.utilisateur.prenom} ${dem.employe.utilisateur.nom}`}</p>
                  <p>{`${dem.employe.utilisateur.email}`}</p>
                </div>
              </div>
            </div>
            <div className="admin-panel-card2-adh">
              <div className="demande-info-adh">
                <p>{`Date de la demande: ${new Date(
                  dem.date_demande
                ).toLocaleString()}`}</p>
                <div className="signature-and-actions">
                  <div className="signature-container">
                    <p className="signature-title">Signature:</p>
                    {dem.signature && (
                      <img
                        src={dem.signature}
                        alt="Signature"
                        className="sig"
                      />
                    )}
                  </div>
                  <div className="action-buttons">
                    <button
                      className={`ButtonAdh ${
                        dem.employe.adherant
                          ? 'ButtonAdh-adh-revoke'
                          : 'ButtonAdh-adh-approve'
                      }`}
                      onClick={() =>
                        handleUpdateAdherant(
                          dem.employe.id_employe,
                          dem.employe.adherant
                        )
                      }
                    >
                      {dem.employe.adherant ? 'Révoquer' : 'Approuver'}
                    </button>
                    {!dem.employe.adherant && (
                      <button
                        className="ButtonAdh ButtonAdh-download"
                        onClick={() => downloadPdf(dem)}
                      >
                        Télécharger
                      </button>
                    )}
                  </div>{' '}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default AdminPanel;
