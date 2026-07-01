import { useCallback } from 'react';
import { PokemonBadge } from '../PokemonBadge/PokemonBadge';
import { formatPokemonId, formatPokemonName, getOfficialArtwork } from '../../utils/helpers';
import { usePokedexContext } from '../../context/PokedexContext';
import { useAuth } from '../../context/AuthContext';
import { apiAddFavorite, apiRemoveFavorite } from '../../services/api';
import styles from './PokemonCard.module.css';

export function PokemonCard({ pokemon }) {
  const { openDetail } = usePokedexContext();
  const { isAuthenticated, user, token, updateUser } = useAuth();
  const artwork = getOfficialArtwork(pokemon.id);
  const types = pokemon.types.map((t) => t.type.name);

  const isFavorite = isAuthenticated && Array.isArray(user?.favorites)
    ? user.favorites.includes(pokemon.id)
    : false;

  const handleFavoriteClick = useCallback(async (e) => {
    e.stopPropagation();
    if (!isAuthenticated) return;

    const prevFavorites = user?.favorites ?? [];
    let nextFavorites;

    if (isFavorite) {
      nextFavorites = prevFavorites.filter((id) => id !== pokemon.id);
    } else {
      nextFavorites = [...prevFavorites, pokemon.id];
    }

    // Optimistic update
    updateUser({ ...user, favorites: nextFavorites });

    try {
      if (isFavorite) {
        await apiRemoveFavorite(token, pokemon.id);
      } else {
        await apiAddFavorite(token, pokemon.id);
      }
    } catch {
      // Revert on error
      updateUser({ ...user, favorites: prevFavorites });
    }
  }, [isAuthenticated, isFavorite, pokemon.id, token, user, updateUser]);

  return (
    <article
      className={styles.card}
      onClick={() => openDetail(pokemon.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && openDetail(pokemon.id)}
      aria-label={`Ver detalles de ${formatPokemonName(pokemon.name)}`}
    >
      <span className={styles.id}>{formatPokemonId(pokemon.id)}</span>

      {isAuthenticated && (
        <button
          className={`${styles.heartBtn} ${isFavorite ? styles.heartActive : ''}`}
          onClick={handleFavoriteClick}
          aria-label={isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
          aria-pressed={isFavorite}
        >
          {isFavorite ? '❤' : '♡'}
        </button>
      )}

      <div className={styles.imageWrapper}>
        <img
          src={artwork}
          alt={formatPokemonName(pokemon.name)}
          className={styles.image}
          loading="lazy"
        />
      </div>
      <h3 className={styles.name}>{formatPokemonName(pokemon.name)}</h3>
      <div className={styles.types}>
        {types.map((type) => (
          <PokemonBadge key={type} type={type} />
        ))}
      </div>
    </article>
  );
}
