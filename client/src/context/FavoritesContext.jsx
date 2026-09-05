import React, { createContext, useContext, useState, useEffect } from 'react';
import shopsData from '../data/shops.json';

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  // Initialize with IDs that were originally marked as favorite in JSON or from localStorage
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('uiu_student_favorites');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load favorites from localStorage', e);
    }
    // Fallback: shops in shopsData where isFavorite is true
    return shopsData.filter(s => s.isFavorite).map(s => s.id);
  });

  useEffect(() => {
    try {
      localStorage.setItem('uiu_student_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.error('Failed to save favorites to localStorage', e);
    }
  }, [favorites]);

  const toggleFavorite = (shopId) => {
    setFavorites(prev => {
      const idStr = String(shopId);
      if (prev.includes(idStr)) {
        return prev.filter(id => id !== idStr);
      } else {
        return [...prev, idStr];
      }
    });
  };

  const isFavorite = (shopId) => {
    return favorites.includes(String(shopId));
  };

  return (
    <FavoritesContext.Provider value={{
      favorites,
      toggleFavorite,
      isFavorite,
      favoriteCount: favorites.length
    }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
