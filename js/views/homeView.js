import { fetchPokemonPage, fetchPokemonTypes } from '../services/api.js';
import { pokemonCardTemplate } from '../components/pokemonCard.js';

let cache = [];
let currentOffset = 0;
const PAGE_LIMIT = 20;

export async function renderHomeView() {
  const outlet = document.getElementById('route-view');

  const [pageData, types] = await Promise.all([
    fetchPokemonPage(currentOffset, PAGE_LIMIT),
    fetchPokemonTypes()
  ]);

  cache = pageData.items;

  outlet.innerHTML = `
    <section class="space-y-4">
      <div class="grid gap-3 md:grid-cols-[1fr_auto]">
        <div class="grid gap-3 sm:grid-cols-2">
          <input id="search-input" type="search" placeholder="Buscar por nombre o ID" class="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm shadow-sm outline-none ring-blue-500 focus:ring dark:border-slate-700 dark:bg-slate-900" />
          <select id="type-filter" class="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm shadow-sm outline-none ring-blue-500 focus:ring dark:border-slate-700 dark:bg-slate-900">
            <option value="all">Todos los tipos</option>
            ${types.map((type) => `<option value="${type.name}">${type.name}</option>`).join('')}
          </select>
        </div>
        <div class="flex gap-2">
          <button id="prev-page" class="rounded-xl bg-slate-200 px-4 py-3 text-sm font-semibold disabled:opacity-50 dark:bg-slate-800" ${currentOffset === 0 ? 'disabled' : ''}>Anterior</button>
          <button id="next-page" class="rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50" ${currentOffset + PAGE_LIMIT >= pageData.count ? 'disabled' : ''}>Siguiente</button>
        </div>
      </div>
      <div id="pokemon-grid" class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"></div>
    </section>
  `;

  const searchInput = document.getElementById('search-input');
  const typeFilter = document.getElementById('type-filter');
  const grid = document.getElementById('pokemon-grid');
  const prevButton = document.getElementById('prev-page');
  const nextButton = document.getElementById('next-page');

  function renderGrid() {
    const term = searchInput.value.trim().toLowerCase();
    const selectedType = typeFilter.value;

    const filtered = cache.filter((pokemon) => {
      const matchesSearch = !term || pokemon.name.includes(term) || String(pokemon.id) === term;
      const matchesType = selectedType === 'all' || pokemon.types.some((type) => type.type.name === selectedType);
      return matchesSearch && matchesType;
    });

    grid.innerHTML = filtered.length
      ? filtered.map((pokemon) => pokemonCardTemplate(pokemon)).join('')
      : '<p class="col-span-full rounded-2xl bg-white p-8 text-center shadow-sm dark:bg-slate-900">No se encontraron Pokémon.</p>';
  }

  searchInput.addEventListener('input', renderGrid);
  typeFilter.addEventListener('change', renderGrid);

  prevButton.addEventListener('click', () => {
    currentOffset = Math.max(0, currentOffset - PAGE_LIMIT);
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  });

  nextButton.addEventListener('click', () => {
    currentOffset += PAGE_LIMIT;
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  });

  renderGrid();
}
