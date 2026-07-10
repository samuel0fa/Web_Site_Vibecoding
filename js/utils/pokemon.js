export const TYPE_CLASSES = {
  normal: 'bg-slate-400 text-white dark:bg-slate-500',
  fire: 'bg-red-500 text-white dark:bg-red-600',
  water: 'bg-blue-500 text-white dark:bg-blue-600',
  electric: 'bg-yellow-400 text-slate-900 dark:bg-yellow-500',
  grass: 'bg-emerald-500 text-white dark:bg-emerald-600',
  ice: 'bg-cyan-300 text-slate-900 dark:bg-cyan-400',
  fighting: 'bg-orange-700 text-white dark:bg-orange-800',
  poison: 'bg-purple-500 text-white dark:bg-purple-600',
  ground: 'bg-amber-500 text-slate-900 dark:bg-amber-600',
  flying: 'bg-indigo-400 text-white dark:bg-indigo-500',
  psychic: 'bg-pink-500 text-white dark:bg-pink-600',
  bug: 'bg-lime-500 text-slate-900 dark:bg-lime-600',
  rock: 'bg-stone-500 text-white dark:bg-stone-600',
  ghost: 'bg-violet-600 text-white dark:bg-violet-700',
  dragon: 'bg-indigo-700 text-white dark:bg-indigo-800',
  dark: 'bg-neutral-700 text-white dark:bg-neutral-800',
  steel: 'bg-slate-500 text-white dark:bg-slate-600',
  fairy: 'bg-rose-400 text-white dark:bg-rose-500'
};

export function formatPokemonId(id) {
  return `#${String(id).padStart(4, '0')}`;
}

export function getPokemonImage(pokemon) {
  return pokemon.sprites?.other?.['official-artwork']?.front_default || pokemon.sprites?.front_default || '';
}

export function getTypeClass(typeName) {
  return TYPE_CLASSES[typeName] || 'bg-slate-400 text-white';
}

export function extractEvolutionNames(chainNode, names = []) {
  if (!chainNode) {
    return names;
  }

  names.push(chainNode.species.name);

  chainNode.evolves_to.forEach((next) => {
    extractEvolutionNames(next, names);
  });

  return names;
}
