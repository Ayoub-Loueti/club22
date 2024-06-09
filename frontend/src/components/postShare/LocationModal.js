import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useTranslation } from 'react-i18next';

const LocationModal = ({ isOpen, onClose, onLieuSubmit, lieu, setLieu }) => {
  const provider = new OpenStreetMapProvider();
  const [map, setMap] = useState(null);
  const [position, setPosition] = useState([48.8566, 2.3522]); 
  const [suggestions, setSuggestions] = useState([]);
    const { t } = useTranslation();

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});
 useEffect(() => {
   const fetchLocation = async () => {
     if (lieu.length > 3) {
       try {
         const results = await provider.search({ query: lieu });
         setSuggestions(results);
         if (results.length > 0) {
           const { x, y } = results[0];
           setPosition([y, x]);
           map?.flyTo([y, x], 13);
         }
       } catch (error) {
         console.error('Erreur lors de la recherche de localisation:', error);
         setSuggestions([]);
       }
     } else {
       setSuggestions([]);
     }
   };

   fetchLocation();
 }, [lieu, map]);

  const handleInputChange = (event) => {
    setLieu(event.target.value);
  };

  const handleSelectSuggestion = (suggestion) => {
    setLieu(suggestion.label);
    setPosition([suggestion.y, suggestion.x]);
    setSuggestions([]);
  };

  if (!isOpen) return null;

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button style={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <h2>{t('Entrez le lieu')}</h2>
        <input
          type="text"
          value={lieu}
          onChange={handleInputChange}
          style={styles.input}
        />
        {suggestions.length > 0 && (
          <ul style={styles.suggestionsList}>
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                style={styles.suggestionItem}
                onClick={() => handleSelectSuggestion(suggestion)}
              >
                {suggestion.label}
              </li>
            ))}
          </ul>
        )}
        <MapContainer
          center={position}
          zoom={13}
          whenCreated={setMap}
          style={{ height: 200, width: '100%' }}
          key={position.toString()}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={position} />
        </MapContainer>
        <button onClick={() => onLieuSubmit(lieu)} style={styles.submitButton}>
          OK
        </button>
      </div>
    </div>
  );
};

const styles = {
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    background: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    width: '90%',
    maxWidth: '600px',
    zIndex: 1001,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    border: 'none',
    background: 'none',
    fontSize: '24px',
    cursor: 'pointer',
  },
  input: {
    width: '80%',
    padding: '10px',
    marginTop: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
marginBottom:'20px'
  },
  suggestionsList: {
    listStyleType: 'none',
    padding: 0,
    margin: 0,
    backgroundColor: '#fff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    position: 'absolute',
    width: 'calc(100% - 40px)',
    zIndex: 1002,
  },
  suggestionItem: {
    padding: '5px',
    cursor: 'pointer',
    borderBottom: '1px solid #ccc',
  },
  submitButton: {
    marginTop: '10px',
    padding: '10px 20px',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};
export default LocationModal;