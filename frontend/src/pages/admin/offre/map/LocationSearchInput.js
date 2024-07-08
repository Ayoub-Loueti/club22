import React, { useState, useEffect, useRef } from 'react';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import '../OffreForm.css';

function LocationSearchInput({ onLocationSelect, initialLocation = '' }) {
  const [suggestions, setSuggestions] = useState([]);
  const [query, setQuery] = useState(initialLocation);
  const provider = new OpenStreetMapProvider();
  const wrapperRef = useRef(null); // Référence pour le conteneur du composant

  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 0) {
      const results = await provider.search({ query: value });
      setSuggestions(results);
    } else {
      setSuggestions([]);
    }
  };

  useEffect(() => {
    setQuery(initialLocation);
  }, [initialLocation]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setSuggestions([]); // Efface les suggestions si le clic est en dehors du conteneur
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRef]);

  const handleSelect = (suggestion) => {
    setQuery(suggestion.label);
    onLocationSelect(suggestion.label);
    setSuggestions([]); // Efface les suggestions après la sélection
  };

  const handleBlur = () => {
    onLocationSelect(query); // Met à jour la localisation lorsque l'input perd le focus
  };

  return (
    <div ref={wrapperRef}>
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        onBlur={handleBlur} // Gère le flou pour mettre à jour la localisation
        autoComplete="off"
      />
      {suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((suggestion, index) => (
            <li key={index} onClick={() => handleSelect(suggestion)}>
              {suggestion.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default LocationSearchInput;
