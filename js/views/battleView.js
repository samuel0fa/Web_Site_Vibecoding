import { fetchPokemonByIdOrName, fetchRandomPokemon } from '../services/api.js';
import { getCapturedPokemonIds } from '../services/storage.js';
import { getPokemonImage, formatPokemonId } from '../utils/pokemon.js';
import { playBattleTone } from '../utils/audio.js';

function hpBarClass(percent) {
  if (percent > 50) return 'bg-emerald-500';
  if (percent > 20) return 'bg-amber-500';
  return 'bg-red-500';
}

function renderModal(message) {
  return `
    <div class="fixed inset-0 z-40 grid place-items-center bg-slate-950/70 p-4">
      <div class="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-xl dark:bg-slate-900">
        <h3 class="text-2xl font-black">${message}</h3>
        <p class="mt-2 text-slate-500 dark:text-slate-400">Recarga para volver a jugar o elige otro Pokémon.</p>
        <button id="close-battle-modal" class="mt-5 rounded-xl bg-blue-600 px-5 py-2 font-semibold text-white">Cerrar</button>
      </div>
    </div>
  `;
}

export async function renderBattleView() {
  const outlet = document.getElementById('route-view');
  const capturedIds = getCapturedPokemonIds();

  if (!capturedIds.length) {
    outlet.innerHTML = `
      <section class="rounded-2xl bg-white p-8 text-center shadow-sm dark:bg-slate-900">
        <h2 class="text-2xl font-black">Sin Pokémon para combatir</h2>
        <p class="mt-2 text-slate-500 dark:text-slate-400">Ve al listado y captura al menos uno para desbloquear el modo batalla.</p>
        <a href="#/" class="mt-4 inline-flex rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white">Ir a capturar</a>
      </section>
    `;
    return;
  }

  const playerOptions = await Promise.all(capturedIds.map((id) => fetchPokemonByIdOrName(id)));
  const rival = await fetchRandomPokemon();

  outlet.innerHTML = `
    <section class="space-y-4">
      <div class="rounded-2xl bg-white p-4 shadow-sm dark:bg-slate-900">
        <label class="mb-2 block text-sm font-semibold">Selecciona tu Pokémon:</label>
        <select id="player-select" class="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 outline-none ring-blue-500 focus:ring dark:border-slate-700 dark:bg-slate-800">
          ${playerOptions.map((pokemon) => `<option value="${pokemon.id}">${pokemon.name} (${formatPokemonId(pokemon.id)})</option>`).join('')}
        </select>
      </div>

      <div class="grid gap-4 rounded-2xl bg-gradient-to-br from-emerald-100 to-blue-100 p-4 shadow-sm dark:from-slate-900 dark:to-slate-800 md:grid-cols-2">
        <article class="order-2 rounded-2xl bg-white/80 p-4 backdrop-blur dark:bg-slate-900/70 md:order-1 md:self-end">
          <h3 id="player-name" class="text-lg font-black capitalize"></h3>
          <div class="mt-2 h-3 rounded bg-slate-200 dark:bg-slate-700"><div id="player-hp" class="h-full w-full rounded bg-emerald-500 transition-all duration-500"></div></div>
          <img id="player-image" class="mx-auto mt-4 h-36 w-36 object-contain" alt="Tu pokemon" />
        </article>

        <article class="order-1 rounded-2xl bg-white/80 p-4 backdrop-blur dark:bg-slate-900/70 md:order-2 md:justify-self-end">
          <h3 class="text-lg font-black capitalize">${rival.name}</h3>
          <div class="mt-2 h-3 rounded bg-slate-200 dark:bg-slate-700"><div id="rival-hp" class="h-full w-full rounded bg-emerald-500 transition-all duration-500"></div></div>
          <img class="mx-auto mt-4 h-36 w-36 object-contain" src="${getPokemonImage(rival)}" alt="Rival" />
        </article>
      </div>

      <div class="rounded-2xl bg-white p-4 shadow-sm dark:bg-slate-900">
        <div class="mb-3 max-h-40 overflow-auto rounded-xl bg-slate-100 p-3 text-sm dark:bg-slate-800" id="battle-log">¡La batalla comienza!</div>
        <button id="battle-attack" class="w-full rounded-xl bg-rose-600 px-4 py-3 font-semibold text-white hover:bg-rose-700">Atacar</button>
      </div>

      <div id="battle-modal-container"></div>
    </section>
  `;

  const playerSelect = document.getElementById('player-select');
  const playerName = document.getElementById('player-name');
  const playerImage = document.getElementById('player-image');
  const playerHpEl = document.getElementById('player-hp');
  const rivalHpEl = document.getElementById('rival-hp');
  const attackBtn = document.getElementById('battle-attack');
  const battleLog = document.getElementById('battle-log');
  const modalContainer = document.getElementById('battle-modal-container');

  let player = playerOptions[0];
  let playerHp = 100;
  let rivalHp = 100;

  function addLog(message) {
    battleLog.innerHTML = `${battleLog.innerHTML}<br/>${message}`;
    battleLog.scrollTop = battleLog.scrollHeight;
  }

  function syncPlayer() {
    playerName.textContent = player.name;
    playerImage.src = getPokemonImage(player);
  }

  function updateHpBars() {
    const playerPercent = Math.max(0, playerHp);
    const rivalPercent = Math.max(0, rivalHp);

    playerHpEl.style.width = `${playerPercent}%`;
    rivalHpEl.style.width = `${rivalPercent}%`;

    playerHpEl.className = `h-full rounded transition-all duration-500 ${hpBarClass(playerPercent)}`;
    rivalHpEl.className = `h-full rounded transition-all duration-500 ${hpBarClass(rivalPercent)}`;
  }

  function finishBattle(message) {
    attackBtn.disabled = true;
    attackBtn.classList.add('opacity-60');
    modalContainer.innerHTML = renderModal(message);
    document.getElementById('close-battle-modal')?.addEventListener('click', () => {
      modalContainer.innerHTML = '';
    });
  }

  playerSelect.addEventListener('change', async () => {
    player = await fetchPokemonByIdOrName(playerSelect.value);
    playerHp = 100;
    rivalHp = 100;
    battleLog.innerHTML = '¡Nuevo combate iniciado!';
    attackBtn.disabled = false;
    attackBtn.classList.remove('opacity-60');
    syncPlayer();
    updateHpBars();
  });

  attackBtn.addEventListener('click', () => {
    const playerDamage = Math.floor(Math.random() * 16) + 8;
    rivalHp -= playerDamage;
    playBattleTone(620, 0.09);
    addLog(`¡${player.name} atacó e hizo ${playerDamage} de daño!`);
    updateHpBars();

    if (rivalHp <= 0) {
      finishBattle('¡Victoria! Ganaste la batalla');
      addLog('El rival fue derrotado.');
      return;
    }

    const rivalDamage = Math.floor(Math.random() * 14) + 7;
    playerHp -= rivalDamage;
    playBattleTone(220, 0.12, 'sawtooth');
    addLog(`¡${rival.name} contraatacó con ${rivalDamage} de daño!`);
    updateHpBars();

    if (playerHp <= 0) {
      finishBattle('¡Derrota! Intenta de nuevo');
      addLog('Tu Pokémon no pudo continuar.');
    }
  });

  syncPlayer();
  updateHpBars();
}
