import { usePokedexContext } from '../../context/PokedexContext';
import styles from './SearchBar.module.css';

export function SearchBar() {
  const { searchQuery, setSearchQuery } = usePokedexContext();

  return (
    <div className={styles.wrapper}>
      <span className={styles.icon} aria-hidden="true">🔍</span>
      <input
        type="text"
        className={styles.input}
        placeholder="Buscar por nombre o número…"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        aria-label="Buscar Pokémon"
      />
      {searchQuery && (
        <button
          className={styles.clearBtn}
          onClick={() => setSearchQuery('')}
          aria-label="Limpiar búsqueda"
        >
          ✕
        </button>
      )}
    </div>
  );
}
