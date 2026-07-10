import { getPokemonImage, getTypeClass, formatPokemonId } from '../utils/pokemon.js';

export function pokemonCardTemplate(pokemon, actions = '') {
  const typeBadges = pokemon.types
    .map((type) => `<span class="rounded-full px-2 py-1 text-xs font-semibold ${getTypeClass(type.type.name)}">${type.type.name}</span>`)
    .join('');

  return `
    <article class="group rounded-2xl bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-glow dark:bg-slate-900">
      <a href="#/pokemon/${pokemon.id}" class="block">
        <img class="mx-auto h-28 w-28 object-contain transition group-hover:scale-105" src="${getPokemonImage(pokemon)}" alt="${pokemon.name}" loading="lazy" />
        <h3 class="mt-3 text-lg font-bold capitalize">${pokemon.name}</h3>
        <p class="text-sm text-slate-500 dark:text-slate-400">${formatPokemonId(pokemon.id)}</p>
      </a>
      <div class="mt-3 flex flex-wrap gap-2">${typeBadges}</div>
      ${actions}
    </article>
  `;
}
