import { capturePokemon, isCaptured, releasePokemon } from '../services/storage.js';
import { fetchEvolutionChain, fetchPokemonByIdOrName, fetchPokemonSpecies } from '../services/api.js';
import { extractEvolutionNames, formatPokemonId, getPokemonImage, getTypeClass } from '../utils/pokemon.js';

export async function renderPokemonDetailView(_, pokemonId) {
  const outlet = document.getElementById('route-view');

  if (!pokemonId) {
    window.location.hash = '#/';
    return;
  }

  const pokemon = await fetchPokemonByIdOrName(pokemonId);
  const species = await fetchPokemonSpecies(pokemon.id);
  const evolutionData = species.evolution_chain?.url ? await fetchEvolutionChain(species.evolution_chain.url) : null;
  const evolutionNames = evolutionData ? extractEvolutionNames(evolutionData.chain) : [];

  outlet.innerHTML = `
    <section class="space-y-4">
      <a href="#/" class="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400"><i class="fa-solid fa-arrow-left"></i> Volver</a>
      <div class="grid gap-4 rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-900 lg:grid-cols-[280px_1fr]">
        <div>
          <img class="mx-auto h-52 w-52 object-contain" src="${getPokemonImage(pokemon)}" alt="${pokemon.name}" />
          <h2 class="mt-3 text-center text-3xl font-black capitalize">${pokemon.name}</h2>
          <p class="text-center text-sm text-slate-500 dark:text-slate-400">${formatPokemonId(pokemon.id)}</p>
          <div class="mt-3 flex flex-wrap justify-center gap-2">
            ${pokemon.types.map((type) => `<span class="rounded-full px-3 py-1 text-xs font-semibold ${getTypeClass(type.type.name)}">${type.type.name}</span>`).join('')}
          </div>
          <button id="capture-toggle" class="mt-5 w-full rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700"></button>
        </div>
        <div class="space-y-5">
          <div class="grid gap-3 sm:grid-cols-2">
            <div class="rounded-xl bg-slate-100 p-3 dark:bg-slate-800"><span class="text-xs uppercase tracking-wide text-slate-500">Altura</span><p class="text-lg font-bold">${(pokemon.height / 10).toFixed(1)} m</p></div>
            <div class="rounded-xl bg-slate-100 p-3 dark:bg-slate-800"><span class="text-xs uppercase tracking-wide text-slate-500">Peso</span><p class="text-lg font-bold">${(pokemon.weight / 10).toFixed(1)} kg</p></div>
          </div>

          <div>
            <h3 class="mb-2 text-lg font-bold">Stats base</h3>
            <div class="space-y-2">
              ${pokemon.stats
                .map((stat) => {
                  const percentage = Math.min(100, stat.base_stat);
                  return `
                    <div>
                      <div class="flex justify-between text-sm"><span class="capitalize">${stat.stat.name.replace('-', ' ')}</span><span>${stat.base_stat}</span></div>
                      <div class="h-2 overflow-hidden rounded bg-slate-200 dark:bg-slate-700">
                        <div class="h-full rounded bg-blue-500 transition-all duration-700" style="width:${percentage}%"></div>
                      </div>
                    </div>
                  `;
                })
                .join('')}
            </div>
          </div>

          <div>
            <h3 class="mb-2 text-lg font-bold">Habilidades</h3>
            <ul class="flex flex-wrap gap-2">
              ${pokemon.abilities.map((ability) => `<li class="rounded-full bg-indigo-100 px-3 py-1 text-sm capitalize dark:bg-indigo-900">${ability.ability.name.replace('-', ' ')}</li>`).join('')}
            </ul>
          </div>

          <div>
            <h3 class="mb-2 text-lg font-bold">Línea evolutiva</h3>
            <p class="rounded-xl bg-slate-100 p-3 capitalize dark:bg-slate-800">${evolutionNames.length ? evolutionNames.join(' → ') : 'Sin datos de evolución'}</p>
          </div>
        </div>
      </div>
    </section>
  `;

  const captureToggle = document.getElementById('capture-toggle');

  function syncButton() {
    const captured = isCaptured(pokemon.id);
    captureToggle.textContent = captured ? 'Liberar' : '¡Capturar!';
    captureToggle.className = `mt-5 w-full rounded-xl px-4 py-3 font-semibold text-white transition ${captured ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700'}`;
  }

  captureToggle.addEventListener('click', () => {
    if (isCaptured(pokemon.id)) {
      releasePokemon(pokemon.id);
    } else {
      capturePokemon(pokemon.id);
    }
    syncButton();
  });

  syncButton();
}
