import styles from './LoadingSpinner.module.css';

export function LoadingSpinner({ size = 'medium' }) {
  return (
    <div className={`${styles.wrapper} ${styles[size]}`} role="status" aria-label="Cargando">
      <div className={styles.spinner} />
    </div>
  );
}
