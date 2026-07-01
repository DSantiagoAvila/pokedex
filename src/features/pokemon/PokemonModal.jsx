import { useEffect, useRef } from 'react';
import { usePokedexContext } from '../../context/PokedexContext';
import { usePokemonDetail } from '../../hooks/usePokemonDetail';
import { PokemonBadge } from '../../components/PokemonBadge/PokemonBadge';
import { LoadingSpinner } from '../../components/LoadingSpinner/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage/ErrorMessage';
import {
  formatPokemonName,
  formatPokemonId,
  formatHeight,
  formatWeight,
  getOfficialArtwork,
} from '../../utils/helpers';
import styles from './PokemonModal.module.css';

const STAT_MAX = 255;

const STAT_LABELS = {
  hp: 'HP',
  attack: 'ATK',
  defense: 'DEF',
  'special-attack': 'Sp.ATK',
  'special-defense': 'Sp.DEF',
  speed: 'SPD',
};

export function PokemonModal() {
  const { selectedPokemonId, closeDetail, openDetail } = usePokedexContext();
  const { pokemon, species, evolutionChain, loading, error } =
    usePokemonDetail(selectedPokemonId);
  const overlayRef = useRef(null);
  const closeBtnRef = useRef(null);
  // Remember which element had focus before the modal opened so we can
  // restore it when the modal closes.
  const previousFocusRef = useRef(null);

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape') closeDetail();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [closeDetail]);

  useEffect(() => {
    if (selectedPokemonId) {
      previousFocusRef.current = document.activeElement;
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      previousFocusRef.current?.focus();
      previousFocusRef.current = null;
    }
    return () => { document.body.style.overflow = ''; };
  }, [selectedPokemonId]);

  // Focus the close button after the modal panel is in the DOM.
  // closeBtnRef is assigned during the same render that removes the null-return
  // guard, so a zero-delay setTimeout reliably fires after React has committed.
  useEffect(() => {
    if (!selectedPokemonId) return;
    const id = setTimeout(() => { closeBtnRef.current?.focus(); }, 0);
    return () => clearTimeout(id);
  }, [selectedPokemonId]);

  if (!selectedPokemonId) return null;

  function handleOverlayClick(e) {
    if (e.target === overlayRef.current) closeDetail();
  }

  const flavorText = species?.flavor_text_entries
    ?.find((f) => f.language.name === 'en')
    ?.flavor_text.replace(/\f/g, ' ') ?? '';

  const levelUpMoves = pokemon?.moves
    ?.filter((m) =>
      m.version_group_details.some(
        (v) => v.move_learn_method.name === 'level-up'
      )
    )
    .map((m) => ({
      name: m.move.name,
      level: Math.min(
        ...m.version_group_details
          .filter((v) => v.move_learn_method.name === 'level-up')
          .map((v) => v.level_learned_at)
      ),
    }))
    .sort((a, b) => a.level - b.level)
    .slice(0, 10) ?? [];

  return (
    <div
      className={styles.overlay}
      ref={overlayRef}
      onClick={handleOverlayClick}
    >
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-label={pokemon ? `Detalles de ${formatPokemonName(pokemon.name)}` : 'Cargando'}
      >
        <button ref={closeBtnRef} className={styles.closeBtn} onClick={closeDetail} aria-label="Cerrar">
          ✕
        </button>

        {loading && <LoadingSpinner size="large" />}

        {error && (
          <ErrorMessage message={error} onRetry={() => openDetail(selectedPokemonId)} />
        )}

        {pokemon && !loading && (
          <div className={styles.content}>
            <div className={styles.header}>
              <img
                src={getOfficialArtwork(pokemon.id)}
                alt={formatPokemonName(pokemon.name)}
                className={styles.artwork}
              />
              <div className={styles.headerInfo}>
                <span className={styles.id}>{formatPokemonId(pokemon.id)}</span>
                <h2 className={styles.name}>{formatPokemonName(pokemon.name)}</h2>
                <div className={styles.types}>
                  {pokemon.types.map((t) => (
                    <PokemonBadge key={t.type.name} type={t.type.name} />
                  ))}
                </div>
                {flavorText && <p className={styles.flavor}>{flavorText}</p>}
                <div className={styles.meta}>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Altura</span>
                    <span className={styles.metaValue}>{formatHeight(pokemon.height)}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Peso</span>
                    <span className={styles.metaValue}>{formatWeight(pokemon.weight)}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Exp. base</span>
                    <span className={styles.metaValue}>{pokemon.base_experience ?? '—'}</span>
                  </div>
                </div>
              </div>
            </div>

            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Estadísticas base</h3>
              <div className={styles.stats}>
                {pokemon.stats.map((s) => {
                  const label = STAT_LABELS[s.stat.name] ?? s.stat.name;
                  const pct = Math.round((s.base_stat / STAT_MAX) * 100);
                  return (
                    <div key={s.stat.name} className={styles.statRow}>
                      <span className={styles.statLabel}>{label}</span>
                      <span className={styles.statValue}>{s.base_stat}</span>
                      <div className={styles.barTrack}>
                        <div
                          className={styles.barFill}
                          style={{ '--pct': `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Habilidades</h3>
              <div className={styles.abilities}>
                {pokemon.abilities.map((a) => (
                  <span
                    key={a.ability.name}
                    className={`${styles.ability} ${a.is_hidden ? styles.hidden : ''}`}
                  >
                    {formatPokemonName(a.ability.name)}
                    {a.is_hidden && <em className={styles.hiddenLabel}> (oculta)</em>}
                  </span>
                ))}
              </div>
            </section>

            {evolutionChain.length > 1 && (
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Cadena de evolución</h3>
                <div className={styles.evolutions}>
                  {evolutionChain.map((evo, idx) => (
                    <div key={evo.id} className={styles.evoItem}>
                      {idx > 0 && <span className={styles.evoArrow} aria-hidden="true">→</span>}
                      <button
                        className={styles.evoBtn}
                        onClick={() => openDetail(evo.id)}
                        aria-label={`Ver ${formatPokemonName(evo.name)}`}
                      >
                        <img
                          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evo.id}.png`}
                          alt={formatPokemonName(evo.name)}
                          className={styles.evoSprite}
                        />
                        <span className={styles.evoName}>{formatPokemonName(evo.name)}</span>
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {levelUpMoves.length > 0 && (
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Movimientos por nivel (primeros 10)</h3>
                <div className={styles.moves}>
                  {levelUpMoves.map((m) => (
                    <div key={m.name} className={styles.move}>
                      <span className={styles.moveLevel}>Lv.{m.level}</span>
                      <span className={styles.moveName}>{formatPokemonName(m.name)}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
