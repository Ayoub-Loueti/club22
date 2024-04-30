import React, { useState, useEffect } from 'react';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import { debounce } from 'lodash';

const LocationModal = ({ isOpen, onClose, onLieuSubmit, lieu, setLieu }) => {
  const provider = new OpenStreetMapProvider();
  const [suggestions, setSuggestions] = useState([]);



 useEffect(() => {
   const fetchSuggestions = async () => {
     if (lieu.length > 3) {
       // Trigger search when the input length is more than 3 characters
       const results = await provider.search({ query: lieu });
       setSuggestions(results);
     } else {
       setSuggestions([]);
     }
   };

   fetchSuggestions();
 }, [lieu]);

  const handleInputChange = (event) => {
    setLieu(event.target.value);
  };

  const handleSelectSuggestion = (suggestion) => {
    setLieu(suggestion.label);
    onLieuSubmit(suggestion.label);
    onClose();
  };

  const handleSubmit = () => {
    onLieuSubmit(lieu);
    onClose();
  };

  if (!isOpen) return null; // Conditionally render content

const customStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  content: {
    position: 'relative',
    width: '400px',
    height: '30vh',
    padding: '20px',
    background: '#FFFFFF',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
  },
  closeButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    cursor: 'pointer',
    fontSize: '1.7rem',
    border: 'none',
    background: 'none',
    color: 'red',
  },
  input: {
    padding: '10px 15px',
    fontSize: '16px',
    margin: '10px 0',
    border: '1px solid #191f43',
    borderRadius: '4px',
    boxSizing: 'border-box',
    width: '100%',
    outline: 'none',
  },
  button: {
    padding: '10px 20px',
    fontSize: '14px',
    backgroundColor: '#191f43',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '10px',
    alignSelf: 'center',
  },
};

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

 

  return (
    <div style={customStyles.overlay} onClick={handleOverlayClick}>
      <div style={customStyles.content}>
        <button style={customStyles.closeButton} onClick={onClose}>
          &times;
        </button>
        <h2>Entrez le lieu</h2>
        <input
          type="text"
          value={lieu}
          onChange={handleInputChange}
          style={customStyles.input}
          list="location-suggestions"
        />
        <datalist id="location-suggestions">
          {suggestions.map((suggestion, index) => (
            <option
              key={index}
              value={suggestion.label}
              onClick={() => handleSelectSuggestion(suggestion)}
            />
          ))}
        </datalist>
        <button
          onClick={() => {
            onLieuSubmit(lieu);
            onClose();
          }}
          style={customStyles.button}
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default LocationModal;
