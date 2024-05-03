import { useState, useEffect } from 'react';
import axios from 'axios';
import { IconButton } from '@mui/material';
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const DownloadConfirmedPDFs = ({ reservations }) => {
  const downloadPDF = async (reservationId) => {
    // Ensure the element ID is correctly formed and points to an existing element
    const elementId = `reservation-card-${reservationId}`;
    const input = document.getElementById(elementId);
    if (input) {
      try {
        const canvas = await html2canvas(input, {
          scale: window.devicePixelRatio,
          useCORS: true,
          logging: true, // Enable for debugging
          windowHeight: input.scrollHeight,
          windowWidth: input.scrollWidth,
        });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'px',
          format: [canvas.width, canvas.height],
        });
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save(`reservation_${reservationId}.pdf`);
      } catch (error) {
        console.error('Error generating PDF:', error);
      }
    } else {
      console.error('No input element found with ID:', elementId);
    }
  };

  const handleDownloadClick = (e, reservationId) => {
    e.stopPropagation(); // This will prevent the event from bubbling up to the parent
    downloadPDF(reservationId);
  };

  return (
    <>
      {reservations.map((reservation) => (
        <IconButton
          key={reservation.id_reservation}
          size="small"
          aria-label="download"
          onClick={(e) => handleDownloadClick(e, reservation.id_reservation)}
        >
          <DownloadForOfflineIcon />
        </IconButton>
      ))}
    </>
  );
};

export default DownloadConfirmedPDFs;
