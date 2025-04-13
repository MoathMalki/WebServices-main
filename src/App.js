import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

const FOURSQUARE_API_KEY = "fsq3soZNlLbhRbl7blf3576+sKcYYa4YJt2/JO+WXGqcp/8=";
const OPENCAGE_API_KEY = "92aec43ed55d40efb1fd4e8282e3c9ca";
const DEFAULT_LOCATION = "Ramallah";

function App() {
  const [places, setPlaces] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // تحميل المفضلة من localStorage عند بدء التطبيق
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // حفظ المفضلة في localStorage عند التغيير
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const fetchCoordinates = async (placeName) => {
    try {
      const response = await axios.get("https://api.opencagedata.com/geocode/v1/json", {
        params: {
          key: OPENCAGE_API_KEY,
          q: placeName,
          limit: 1,
        },
      });
      const result = response.data.results[0];
      return result ? { lat: result.geometry.lat, lon: result.geometry.lng } : null;
    } catch {
      return null;
    }
  };

  const fetchPlacePhoto = async (fsq_id) => {
    try {
      const response = await axios.get(
        `https://api.foursquare.com/v3/places/${fsq_id}/photos`,
        {
          headers: {
            Authorization: FOURSQUARE_API_KEY,
          },
        }
      );
      const photo = response.data[0];
      return photo ? `${photo.prefix}original${photo.suffix}` : null;
    } catch {
      return null;
    }
  };

  const fetchPlaces = async () => {
    setLoading(true);
    setErrorMessage("");
    const coords = await fetchCoordinates(location);
    if (!coords) {
      setErrorMessage("❌ Location not found. Please try another name.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        "https://api.foursquare.com/v3/places/search",
        {
          headers: {
            Authorization: FOURSQUARE_API_KEY,
          },
          params: {
            ll: `${coords.lat},${coords.lon}`,
            ...(query && { query }),
            limit: 10,
          },
        }
      );

      const resultsWithPhotos = await Promise.all(
        response.data.results.map(async (place) => {
          const photoUrl = await fetchPlacePhoto(place.fsq_id);
          return { ...place, photo: photoUrl };
        })
      );

      setPlaces(resultsWithPhotos);
    } catch (error) {
      console.error("Error fetching places:", error);
      setErrorMessage("❌ Failed to fetch places.");
    }
    setLoading(false);
  };

  const toggleFavorite = (place) => {
    if (favorites.some(fav => fav.fsq_id === place.fsq_id)) {
      setFavorites(favorites.filter(fav => fav.fsq_id !== place.fsq_id));
    } else {
      setFavorites([...favorites, place]);
    }
  };

  return (
    <Router>
      <div className="container">
        <nav>
          <Link to="/">Home</Link> | 
          <Link to="/favorites">Favorites ({favorites.length})</Link>
        </nav>
        
        <Routes>
          <Route path="/" element={
            <>
              <h1>Nearby Places</h1>
              <div className="controls">
                <input
                  type="text"
                  placeholder="Enter city or area"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
                <button onClick={fetchPlaces}>🔍 Search This Location</button>
                <select onChange={(e) => setQuery(e.target.value)} value={query}>
                  <option value="">All</option>
                  <option value="cafe">Cafés</option>
                  <option value="restaurant">Restaurants</option>
                  <option value="resort">Resorts</option>
                </select>
              </div>

              {errorMessage && <div className="error-box">{errorMessage}</div>}

              {loading ? (
                <p>Loading...</p>
              ) : (
                <div className="cards">
                  {places.map((place) => (
                    <div key={place.fsq_id} className="card">
                      <button 
                        onClick={() => toggleFavorite(place)}
                        className={`favorite-btn ${favorites.some(fav => fav.fsq_id === place.fsq_id) ? 'active' : ''}`}
                      >
                        ❤️
                      </button>
                      {place.photo ? (
                        <img src={place.photo} alt={place.name} />
                      ) : place.categories[0]?.icon ? (
                        <img
                          src={`${place.categories[0].icon.prefix}bg_64${place.categories[0].icon.suffix}`}
                          alt={place.categories[0].name}
                        />
                      ) : null}
                      <div>
                        <h3>{place.name}</h3>
                        <p className="category">
                          <strong>Category:</strong> {place.categories[0]?.name || "N/A"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          } />
          
          <Route path="/favorites" element={
            <div>
              <h1>Favorite Places</h1>
              {favorites.length === 0 ? (
                <p>No favorites yet. Add some from the home page!</p>
              ) : (
                <div className="cards">
                  {favorites.map((place) => (
                    <div key={place.fsq_id} className="card">
                      {place.photo ? (
                        <img src={place.photo} alt={place.name} />
                      ) : place.categories[0]?.icon ? (
                        <img
                          src={`${place.categories[0].icon.prefix}bg_64${place.categories[0].icon.suffix}`}
                          alt={place.categories[0].name}
                        />
                      ) : null}
                      <div>
                        <h3>{place.name}</h3>
                        <p className="category">
                          <strong>Category:</strong> {place.categories[0]?.name || "N/A"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;