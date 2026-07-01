import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AuthModal } from '../AuthModal/AuthModal';
import styles from './Navbar.module.css';

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <header className={styles.navbar}>
        <div className={styles.inner}>
          <div className={styles.logo}>
            <span className={styles.ball} aria-hidden="true" />
            <span className={styles.title}>Pokédex</span>
          </div>

          <div className={styles.authArea}>
            {isAuthenticated ? (
              <>
                <span className={styles.username}>{user?.username}</span>
                <button className={styles.authBtn} onClick={logout}>
                  Cerrar sesión
                </button>
              </>
            ) : (
              <button className={styles.authBtn} onClick={() => setShowModal(true)}>
                Iniciar sesión
              </button>
            )}
          </div>
        </div>
      </header>

      {showModal && <AuthModal onClose={() => setShowModal(false)} />}
    </>
  );
}
