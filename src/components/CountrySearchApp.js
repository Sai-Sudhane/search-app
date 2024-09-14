import React, { useState, useEffect } from 'react';
import '../styles/CountrySearchApp.css'; // Import the styles

const CountrySearchApp = () => {
  const [countries, setCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  // Fetch data from countries.json
  useEffect(() => {
    fetch('/countries.json')
      .then((response) => response.json())
      .then((data) => setCountries(data))
      .catch((error) => console.error('Error fetching country data:', error));
  }, []);

  // Filter countries based on the search term (both country and capital)
  const filteredCountries = countries.filter((country) =>
    country.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.capital.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Generate suggestions based on the search term
  useEffect(() => {
    if (searchTerm.length > 0) {
      const filteredSuggestions = countries
        .filter((country) =>
          country.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
          country.capital.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .map(country => ({
          country: country.country,
          capital: country.capital
        }));
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [searchTerm, countries]);

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion.country);
    setSuggestions([]);
  };

  return (
    <div className="search-app-container">
      <h1 className="app-title">Country Search</h1>
      <div className="search-input-container">
        <input
          type="text"
          placeholder="Search for a country or capital..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {suggestions.length > 0 && (
          <div className="suggestions-container">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="suggestion-item"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion.country} ({suggestion.capital})
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="country-grid">
        {filteredCountries.length > 0 ? (
          filteredCountries.map((country, index) => (
            <div key={index} className="country-card">
              <h2 className="country-name">{country.country}</h2>
              <p><strong>Capital:</strong> {country.capital}</p>
              <p><strong>Population:</strong> {country.population.toLocaleString()}</p>
              <p><strong>Language:</strong> {Array.isArray(country.official_language) ? country.official_language.join(', ') : country.official_language}</p>
              <p><strong>Currency:</strong> {country.currency}</p>
            </div>
          ))
        ) : (
          <p className="no-results">No countries found</p>
        )}
      </div>
    </div>
  );
};

export default CountrySearchApp;
