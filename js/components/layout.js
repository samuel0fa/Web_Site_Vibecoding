export function renderLayout(activeRoute, capturedCount) {
  const themeIcon = document.documentElement.classList.contains('dark')
    ? '<i class="fa-solid fa-moon"></i>'
    : '<i class="fa-solid fa-sun"></i>';

  return `
    <div class="mx-auto min-h-screen max-w-7xl px-4 pb-8 pt-6 sm:px-6 lg:px-8">
      <header class="mb-6 rounded-2xl bg-white/90 p-4 shadow-sm backdrop-blur dark:bg-slate-900/85">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <a href="#/" class="text-2xl font-black tracking-tight text-blue-600 dark:text-blue-400">Pokémon SPA Game</a>
          <div class="flex items-center gap-2">
            <a href="#/pokedex" class="rounded-xl px-3 py-2 text-sm font-semibold ${activeRoute === 'pokedex' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-100'}">Pokédex (${capturedCount})</a>
            <a href="#/battle" class="rounded-xl px-3 py-2 text-sm font-semibold ${activeRoute === 'battle' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-100'}">Batalla</a>
            <button id="theme-toggle" type="button" class="rounded-xl bg-slate-200 px-3 py-2 text-sm dark:bg-slate-800">${themeIcon}</button>
          </div>
        </div>
      </header>
      <main id="route-view" class="animate-fadeIn"></main>
    </div>
  `;
}
