import { getTypeColor, getTypeName } from '../../utils/typeColors';
import styles from './PokemonBadge.module.css';

export function PokemonBadge({ type }) {
  const color = getTypeColor(type);

  return (
    <span
      className={styles.badge}
      style={{ '--badge-color': color }}
    >
      {getTypeName(type)}
    </span>
  );
}
