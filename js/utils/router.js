const POKEMON_DETAIL_PATTERN = /^#\/pokemon\/(\d+)$/;

export function parseRoute(hash) {
  if (!hash || hash === '#/' || hash === '#') {
    return { key: 'home', params: {} };
  }

  if (hash === '#/pokedex') {
    return { key: 'pokedex', params: {} };
  }

  if (hash === '#/battle') {
    return { key: 'battle', params: {} };
  }

  const match = hash.match(POKEMON_DETAIL_PATTERN);
  if (match) {
    return {
      key: 'pokemon',
      params: { id: Number(match[1]) }
    };
  }

  return { key: 'home', params: {} };
}
