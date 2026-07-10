import { renderLayout } from './js/components/layout.js';
import { renderHomeView } from './js/views/homeView.js';
import { renderPokemonDetailView } from './js/views/pokemonDetailView.js';
import { renderPokedexView } from './js/views/pokedexView.js';
import { renderBattleView } from './js/views/battleView.js';
import { getCapturedPokemonIds } from './js/services/storage.js';
import { parseRoute } from './js/utils/router.js';

const appRoot = document.getElementById('app');

const state = {
  captured: getCapturedPokemonIds(),
  currentRoute: '#/'
};

const routeHandlers = {
  home: () => renderHomeView(state),
  pokemon: (route) => renderPokemonDetailView(state, route.params.id),
  pokedex: () => renderPokedexView(state),
  battle: () => renderBattleView(state)
};

function notifyCaptureState() {
  state.captured = getCapturedPokemonIds();
  document.dispatchEvent(new CustomEvent('captured-updated', { detail: state.captured }));
}

window.addEventListener('captured-changed', notifyCaptureState);

async function renderRoute() {
  const route = parseRoute(window.location.hash || '#/');
  state.currentRoute = window.location.hash || '#/';

  appRoot.innerHTML = renderLayout(route.key, state.captured.length);

  const outlet = document.getElementById('route-view');
  const handler = routeHandlers[route.key] || routeHandlers.home;

  try {
    outlet.innerHTML = '<div class="mx-auto mt-12 h-10 w-10 animate-spin rounded-full border-4 border-blue-400 border-t-transparent"></div>';
    await handler(route);
  } catch (error) {
    outlet.innerHTML = `
      <section class="mx-auto max-w-xl rounded-2xl border border-red-300 bg-red-50 p-6 text-red-700 shadow-sm dark:border-red-800 dark:bg-red-950 dark:text-red-200">
        <h2 class="text-xl font-semibold">Ocurrió un error</h2>
        <p class="mt-2">${error?.message || 'No se pudo renderizar la vista.'}</p>
      </section>
    `;
  }

  bindLayoutEvents();
}

function bindLayoutEvents() {
  const toggle = document.getElementById('theme-toggle');
  if (!toggle) {
    return;
  }

  toggle.addEventListener('click', () => {
    const root = document.documentElement;
    const isDark = root.classList.toggle('dark');
    localStorage.setItem('pokemon-theme', isDark ? 'dark' : 'light');
    toggle.innerHTML = isDark ? '<i class="fa-solid fa-moon"></i>' : '<i class="fa-solid fa-sun"></i>';
  });
}

function initializeTheme() {
  const preference = localStorage.getItem('pokemon-theme');
  const shouldUseDark = preference ? preference === 'dark' : true;
  document.documentElement.classList.toggle('dark', shouldUseDark);
}

if (!window.location.hash) {
  window.location.hash = '#/';
}

initializeTheme();
window.addEventListener('hashchange', renderRoute);
document.addEventListener('captured-updated', () => renderRoute());

renderRoute();
