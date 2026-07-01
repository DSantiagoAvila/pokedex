import { createContext, useContext, useState } from 'react';

const PokedexContext = createContext(null);

export function PokedexProvider({ children }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeType, setActiveType] = useState('');
  const [selectedPokemonId, setSelectedPokemonId] = useState(null);
  const [showFavorites, setShowFavorites] = useState(false);

  function openDetail(id) {
    setSelectedPokemonId(id);
  }

  function closeDetail() {
    setSelectedPokemonId(null);
  }

  function toggleFavorites() {
    setShowFavorites((prev) => !prev);
    // Clear search/type filters when switching to favorites view
    if (!showFavorites) {
      setSearchQuery('');
      setActiveType('');
    }
  }

  return (
    <PokedexContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        activeType,
        setActiveType,
        selectedPokemonId,
        openDetail,
        closeDetail,
        showFavorites,
        toggleFavorites,
      }}
    >
      {children}
    </PokedexContext.Provider>
  );
}

export function usePokedexContext() {
  const ctx = useContext(PokedexContext);
  if (!ctx) throw new Error('usePokedexContext must be used inside PokedexProvider');
  return ctx;
}
