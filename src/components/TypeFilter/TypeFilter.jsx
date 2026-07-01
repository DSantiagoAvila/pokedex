import { useState, useEffect } from 'react';
import { fetchAllTypes } from '../../services/pokeapi';
import { usePokedexContext } from '../../context/PokedexContext';
import { getTypeColor, getTypeName } from '../../utils/typeColors';
import styles from './TypeFilter.module.css';

const EXCLUDED_TYPES = ['unknown', 'shadow'];

export function TypeFilter() {
  const { activeType, setActiveType } = usePokedexContext();
  const [types, setTypes] = useState([]);

  useEffect(() => {
    let cancelled = false;
    fetchAllTypes()
      .then((data) => {
        if (cancelled) return;
        const filtered = data.results
          .filter((t) => !EXCLUDED_TYPES.includes(t.name))
          .map((t) => t.name);
        setTypes(filtered);
      })
      .catch((err) => {
        if (!cancelled) console.error('Failed to load Pokémon types:', err);
      });
    return () => { cancelled = true; };
  }, []);

  function handleSelect(type) {
    setActiveType(activeType === type ? '' : type);
  }

  return (
    <div className={styles.wrapper} role="group" aria-label="Filter by type">
      {types.map((type) => {
        const color = getTypeColor(type);
        const isActive = activeType === type;
        return (
          <button
            key={type}
            className={`${styles.pill} ${isActive ? styles.active : ''}`}
            style={{ '--pill-color': color }}
            onClick={() => handleSelect(type)}
            aria-pressed={isActive}
          >
            {getTypeName(type)}
          </button>
        );
      })}
    </div>
  );
}
