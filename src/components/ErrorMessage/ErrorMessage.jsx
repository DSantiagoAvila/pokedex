import styles from './ErrorMessage.module.css';

export function ErrorMessage({ message, onRetry }) {
  return (
    <div className={styles.container} role="alert">
      <span className={styles.icon}>⚠</span>
      <p className={styles.message}>{message || 'Algo salió mal.'}</p>
      {onRetry && (
        <button className={styles.retryBtn} onClick={onRetry}>
          Reintentar
        </button>
      )}
    </div>
  );
}
