const STORAGE_KEY = 'pokemon-spa-captured';

export function getCapturedPokemonIds() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((id) => Number.isInteger(id)) : [];
  } catch {
    return [];
  }
}

export function isCaptured(id) {
  return getCapturedPokemonIds().includes(Number(id));
}

export function capturePokemon(id) {
  const normalizedId = Number(id);
  const current = getCapturedPokemonIds();
  if (current.includes(normalizedId)) {
    return current;
  }

  const updated = [...current, normalizedId].sort((a, b) => a - b);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('captured-changed'));
  return updated;
}

export function releasePokemon(id) {
  const normalizedId = Number(id);
  const current = getCapturedPokemonIds();
  const updated = current.filter((value) => value !== normalizedId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('captured-changed'));
  return updated;
}
