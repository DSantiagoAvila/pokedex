import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchPokemonList, fetchPokemon, fetchPokemonByType } from '../services/pokeapi';
import { extractIdFromUrl } from '../utils/helpers';

const PAGE_SIZE = 20;

export function usePokemonList(searchQuery, activeType) {
  const [allPokemon, setAllPokemon] = useState([]);
  const [displayedPokemon, setDisplayedPokemon] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Stable ref so loadMore can read the latest offset without being
  // recreated on every offset change.
  const offsetRef = useRef(0);
  const loadingRef = useRef(false);
  const hasMoreRef = useRef(true);

  // Keep refs in sync with state.
  useEffect(() => { offsetRef.current = offset; }, [offset]);
  useEffect(() => { loadingRef.current = loading; }, [loading]);
  useEffect(() => { hasMoreRef.current = hasMore; }, [hasMore]);

  // retry ref so the retry callback is stable.
  const retryRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    async function loadInitialList() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchPokemonList(PAGE_SIZE, 0);
        if (cancelled) return;
        const pokemon = await Promise.all(
          data.results.map((p) => fetchPokemon(extractIdFromUrl(p.url)))
        );
        if (cancelled) return;
        setAllPokemon(pokemon);
        setDisplayedPokemon(pokemon);
        setOffset(PAGE_SIZE);
        offsetRef.current = PAGE_SIZE;
        setHasMore(data.count > PAGE_SIZE);
        hasMoreRef.current = data.count > PAGE_SIZE;
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    retryRef.current = loadInitialList;
    loadInitialList();

    return () => { cancelled = true; };
    // Only run on mount — retryRef provides stable access for manual retries.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const retry = useCallback(() => {
    if (retryRef.current) retryRef.current();
  }, []);

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMoreRef.current || searchQuery || activeType) return;
    setLoading(true);
    loadingRef.current = true;
    setError(null);
    try {
      const currentOffset = offsetRef.current;
      const data = await fetchPokemonList(PAGE_SIZE, currentOffset);
      const pokemon = await Promise.all(
        data.results.map((p) => fetchPokemon(extractIdFromUrl(p.url)))
      );
      setAllPokemon((prev) => [...prev, ...pokemon]);
      setDisplayedPokemon((prev) => [...prev, ...pokemon]);
      const nextOffset = currentOffset + PAGE_SIZE;
      setOffset(nextOffset);
      offsetRef.current = nextOffset;
      const more = nextOffset < data.count;
      setHasMore(more);
      hasMoreRef.current = more;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [searchQuery, activeType]);

  useEffect(() => {
    if (!searchQuery && !activeType) {
      setDisplayedPokemon(allPokemon);
      return;
    }

    let cancelled = false;

    const applyFilters = async () => {
      setLoading(true);
      setError(null);
      try {
        let base = allPokemon;

        if (activeType) {
          const typeData = await fetchPokemonByType(activeType);
          if (cancelled) return;
          const typeIds = new Set(
            typeData.pokemon.map((p) => extractIdFromUrl(p.pokemon.url))
          );
          base = allPokemon.filter((p) => typeIds.has(p.id));

          if (base.length < 20) {
            const typeIds20 = typeData.pokemon.slice(0, 100).map((p) =>
              extractIdFromUrl(p.pokemon.url)
            );
            const missing = typeIds20
              .filter((id) => !allPokemon.find((p) => p.id === id))
              .slice(0, 40);
            if (missing.length > 0) {
              const extra = await Promise.all(missing.map((id) => fetchPokemon(id)));
              if (cancelled) return;
              base = [...base, ...extra];
            }
          }
        }

        if (searchQuery) {
          const q = searchQuery.toLowerCase().trim();
          base = base.filter(
            (p) =>
              p.name.includes(q) ||
              String(p.id).padStart(3, '0').includes(q)
          );
        }

        if (!cancelled) setDisplayedPokemon(base);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    applyFilters();

    return () => { cancelled = true; };
  }, [searchQuery, activeType, allPokemon]);

  const showLoadMore = !searchQuery && !activeType && hasMore;

  return {
    displayedPokemon,
    loading,
    error,
    loadMore,
    showLoadMore,
    retry,
  };
}
