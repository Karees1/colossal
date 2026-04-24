import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Favorites.css";

function Favorites() {
  const [favorites, setFavorites] = useState([]);

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('gentlemanFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Remove from favorites
  const removeFromFavorites = (productId) => {
    const updatedFavorites = favorites.filter(item => item.id !== productId);
    setFavorites(updatedFavorites);
    localStorage.setItem('gentlemanFavorites', JSON.stringify(updatedFavorites));
    window.dispatchEvent(new Event('favoritesUpdated'));
  window.dispatchEvent(new Event('storage')); // Add this line
  };

  // Clear all favorites
  const clearAllFavorites = () => {
    setFavorites([]);
    localStorage.setItem('gentlemanFavorites', JSON.stringify([]));
        window.dispatchEvent(new Event('storage')); // Add this line

  };

  if (favorites.length === 0) {
    return (
      <div className="favorites-page">
        <h1>My Favorite Items</h1>
        <div className="empty-state">
          <p>You haven't added any favorites yet</p>
          <p>Click the ❤️ icon on products to add them here</p>
          <Link to="/" className="shop-now-btn">Shop Now</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="favorites-page">
      <div className="favorites-header">
        <h1>My Favorite Items ({favorites.length})</h1>
        <button onClick={clearAllFavorites} className="clear-all-btn">
          Clear All
        </button>
      </div>
      
      <div className="favorites-grid">
        {favorites.map((product) => (
          <div key={product.id} className="favorite-item">
            <img src={product.frontImg} alt={product.title} />
            <div className="favorite-info">
              <h3>{product.title}</h3>
              <p className="price">{product.price}</p>
              <button 
                onClick={() => removeFromFavorites(product.id)}
                className="remove-btn"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Favorites;