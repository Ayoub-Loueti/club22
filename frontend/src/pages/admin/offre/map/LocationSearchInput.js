import React, { useState,useEffect } from 'react';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import '../OffreForm.css'
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
    // Update the query whenever the initialLocation changes
    setQuery(initialLocation);
  }, [initialLocation]); 
  

  const handleSelect = (e) => {
    const value = e.target.value;
    const selectedResult = suggestions.find((s) => s.label === value);
    if (selectedResult) {
      setQuery(selectedResult.label);
      onLocationSelect(selectedResult.label);
    } else {
      onLocationSelect(value); // Use the manually entered value if it's not a selection
    }
    setSuggestions([]); // Clear suggestions after selection or input
  };

  return (
    <div>
      <input
        type="text"
        list="location-suggestions"
        value={query}
        onChange={handleSearch}
        onBlur={handleSelect} // Handle final input when focus is lost
      />
      <datalist id="location-suggestions">
        {suggestions.map((suggestion, index) => (
          <option key={index} value={suggestion.label} />
        ))}
      </datalist>
    </div>
  );
}

export default LocationSearchInput;
