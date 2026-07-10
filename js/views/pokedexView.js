import { pokemonCardTemplate } from '../components/pokemonCard.js';
import { fetchPokemonByIdOrName } from '../services/api.js';
import { getCapturedPokemonIds, releasePokemon } from '../services/storage.js';

export async function renderPokedexView() {
  const outlet = document.getElementById('route-view');
  const capturedIds = getCapturedPokemonIds();

  if (!capturedIds.length) {
    outlet.innerHTML = `
      <section class="rounded-2xl bg-white p-8 text-center shadow-sm dark:bg-slate-900">
        <h2 class="text-2xl font-black">Tu Pokédex está vacía</h2>
        <p class="mt-2 text-slate-500 dark:text-slate-400">Captura Pokémon desde el listado principal.</p>
        <a href="#/" class="mt-4 inline-flex rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white">Ir a inicio</a>
      </section>
    `;
    return;
  }

  const pokemonList = await Promise.all(capturedIds.map((id) => fetchPokemonByIdOrName(id)));

  outlet.innerHTML = `
    <section>
      <h2 class="mb-4 text-2xl font-black">Pokédex personal</h2>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        ${pokemonList
          .map((pokemon) => {
            const actions = `
              <button data-release-id="${pokemon.id}" class="mt-4 w-full rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700">Liberar</button>
            `;
            return pokemonCardTemplate(pokemon, actions);
          })
          .join('')}
      </div>
    </section>
  `;

  outlet.querySelectorAll('[data-release-id]').forEach((button) => {
    button.addEventListener('click', () => {
      releasePokemon(Number(button.dataset.releaseId));
    });
  });
}
