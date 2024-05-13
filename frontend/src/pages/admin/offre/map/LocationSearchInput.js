import React, { useState, useEffect } from 'react';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import '../OffreForm.css';

function LocationSearchInput({ onLocationSelect, initialLocation = '' }) {
  const [suggestions, setSuggestions] = useState([]);
  const [query, setQuery] = useState(initialLocation);
  const provider = new OpenStreetMapProvider();

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

  const handleSelect = (suggestion) => {
    setQuery(suggestion.label);
    onLocationSelect(suggestion.label);
    setSuggestions([]); // Clear suggestions after selection
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={handleSearch}
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
