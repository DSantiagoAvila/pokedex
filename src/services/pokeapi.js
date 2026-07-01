const BASE_URL = 'https://pokeapi.co/api/v2';

async function apiFetch(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`PokeAPI error: ${response.status} for ${url}`);
  }
  return response.json();
}

export async function fetchPokemonList(limit = 20, offset = 0) {
  return apiFetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
}

export async function fetchPokemon(nameOrId) {
  return apiFetch(`${BASE_URL}/pokemon/${nameOrId}`);
}

export async function fetchPokemonSpecies(id) {
  return apiFetch(`${BASE_URL}/pokemon-species/${id}`);
}

export async function fetchEvolutionChain(id) {
  return apiFetch(`${BASE_URL}/evolution-chain/${id}`);
}

export async function fetchAllTypes() {
  return apiFetch(`${BASE_URL}/type?limit=100`);
}

export async function fetchPokemonByType(type) {
  return apiFetch(`${BASE_URL}/type/${type}`);
}
