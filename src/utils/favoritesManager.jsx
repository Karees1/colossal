// Simple favorites management using localStorage
const FAVORITES_KEY = 'gentlemanFavorites';

export const favoritesManager = {
  // Get all favorites
  getFavorites: () => {
    const favorites = localStorage.getItem(FAVORITES_KEY);
    return favorites ? JSON.parse(favorites) : [];
  },

  // Add to favorites
  addToFavorites: (product) => {
    const favorites = favoritesManager.getFavorites();
    // Check if product already exists
    if (!favorites.find(item => item.id === product.id)) {
      const updatedFavorites = [...favorites, product];
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
      return updatedFavorites;
    }
    return favorites;
  },

  // Remove from favorites
  removeFromFavorites: (productId) => {
    const favorites = favoritesManager.getFavorites();
    const updatedFavorites = favorites.filter(item => item.id !== productId);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
    return updatedFavorites;
  },

  // Check if product is favorite
  isFavorite: (productId) => {
    const favorites = favoritesManager.getFavorites();
    return favorites.some(item => item.id === productId);
  },

  // Get favorites count
  getFavoritesCount: () => {
    return favoritesManager.getFavorites().length;
  }
};