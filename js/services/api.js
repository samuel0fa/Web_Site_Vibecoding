const API_BASE_URL = 'https://pokeapi.co/api/v2';

async function requestJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('No se pudo conectar con la PokeAPI. Intenta de nuevo.');
  }
  return response.json();
}

export async function fetchPokemonPage(offset = 0, limit = 20) {
  const list = await requestJson(`${API_BASE_URL}/pokemon?offset=${offset}&limit=${limit}`);
  const details = await Promise.all(list.results.map((item) => requestJson(item.url)));

  return {
    count: list.count,
    items: details
  };
}

export async function fetchPokemonByIdOrName(idOrName) {
  return requestJson(`${API_BASE_URL}/pokemon/${idOrName}`);
}

export async function fetchPokemonSpecies(id) {
  return requestJson(`${API_BASE_URL}/pokemon-species/${id}`);
}

export async function fetchEvolutionChain(url) {
  return requestJson(url);
}

export async function fetchPokemonTypes() {
  const response = await requestJson(`${API_BASE_URL}/type`);
  return response.results.filter((type) => !['unknown', 'shadow'].includes(type.name));
}

export async function fetchRandomPokemon(max = 151) {
  const randomId = Math.floor(Math.random() * max) + 1;
  return fetchPokemonByIdOrName(randomId);
}
