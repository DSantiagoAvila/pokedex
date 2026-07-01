import { useState, useEffect } from 'react';
import { fetchPokemon, fetchPokemonSpecies, fetchEvolutionChain } from '../services/pokeapi';
import { extractIdFromUrl } from '../utils/helpers';

function flattenEvolutionChain(chain) {
  const result = [];

  function traverse(node) {
    result.push({
      name: node.species.name,
      id: extractIdFromUrl(node.species.url),
    });
    node.evolves_to.forEach(traverse);
  }

  traverse(chain);
  return result;
}

export function usePokemonDetail(pokemonId) {
  const [pokemon, setPokemon] = useState(null);
  const [species, setSpecies] = useState(null);
  const [evolutionChain, setEvolutionChain] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!pokemonId) return;

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      setPokemon(null);
      setSpecies(null);
      setEvolutionChain([]);

      try {
        const [pokemonData, speciesData] = await Promise.all([
          fetchPokemon(pokemonId),
          fetchPokemonSpecies(pokemonId),
        ]);

        if (cancelled) return;

        setPokemon(pokemonData);
        setSpecies(speciesData);

        const chainId = extractIdFromUrl(speciesData.evolution_chain.url);
        const chainData = await fetchEvolutionChain(chainId);

        if (cancelled) return;

        setEvolutionChain(flattenEvolutionChain(chainData.chain));
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [pokemonId]);

  return { pokemon, species, evolutionChain, loading, error };
}
