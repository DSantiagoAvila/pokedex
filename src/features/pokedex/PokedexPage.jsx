import { usePokedexContext } from '../../context/PokedexContext';
import { useAuth } from '../../context/AuthContext';
import { useDebounce } from '../../hooks/useDebounce';
import { usePokemonList } from '../../hooks/usePokemonList';
import { PokemonCard } from '../../components/PokemonCard/PokemonCard';
import { SearchBar } from '../../components/SearchBar/SearchBar';
import { TypeFilter } from '../../components/TypeFilter/TypeFilter';
import { LoadingSpinner } from '../../components/LoadingSpinner/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage/ErrorMessage';
import styles from './PokedexPage.module.css';

export default function PokedexPage() {
  const { searchQuery, activeType, showFavorites, toggleFavorites } = usePokedexContext();
  const { isAuthenticated, user } = useAuth();
  const debouncedSearch = useDebounce(searchQuery, 300);
  const { displayedPokemon, loading, error, loadMore, showLoadMore, retry } =
    usePokemonList(debouncedSearch, activeType);

  const visiblePokemon = showFavorites && isAuthenticated
    ? displayedPokemon.filter((p) => (user?.favorites ?? []).includes(p.id))
    : displayedPokemon;

  return (
    <main className={styles.page}>
      <section className={styles.controls}>
        {!showFavorites && (
          <>
            <SearchBar />
            <TypeFilter />
          </>
        )}

        {isAuthenticated && (
          <button
            className={`${styles.favBtn} ${showFavorites ? styles.favBtnActive : ''}`}
            onClick={toggleFavorites}
            aria-pressed={showFavorites}
          >
            {showFavorites ? '❤ Mis favoritos' : '♡ Mis favoritos'}
          </button>
        )}
      </section>

      {error && <ErrorMessage message={error} onRetry={retry} />}

      <div aria-live="polite" aria-atomic="true" className={styles.srOnly}>
        {!loading && !error && (
          visiblePokemon.length === 0
            ? 'No se encontraron Pokémon. Intenta con otra búsqueda o tipo.'
            : `${visiblePokemon.length} Pokémon encontrados.`
        )}
      </div>

      {!error && visiblePokemon.length === 0 && !loading && (
        <div className={styles.empty}>
          <p>
            {showFavorites
              ? 'Aún no tienes Pokémon favoritos.'
              : 'No se encontraron Pokémon. Intenta con otra búsqueda o tipo.'}
          </p>
        </div>
      )}

      <div className={styles.grid}>
        {visiblePokemon.map((pokemon) => (
          <PokemonCard key={pokemon.id} pokemon={pokemon} />
        ))}
      </div>

      {loading && <LoadingSpinner />}

      {showLoadMore && !loading && !showFavorites && (
        <div className={styles.loadMoreWrapper}>
          <button className={styles.loadMoreBtn} onClick={loadMore}>
            Cargar más
          </button>
        </div>
      )}
    </main>
  );
}
