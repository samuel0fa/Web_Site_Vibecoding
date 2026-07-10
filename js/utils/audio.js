let audioContext;

function getAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
}

export function playBattleTone(frequency = 440, duration = 0.08, type = 'square') {
  try {
    const context = getAudioContext();
    const osc = context.createOscillator();
    const gain = context.createGain();

    osc.type = type;
    osc.frequency.value = frequency;
    gain.gain.value = 0.07;

    osc.connect(gain);
    gain.connect(context.destination);

    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + duration);
    osc.stop(context.currentTime + duration);
  } catch {
    // silencioso si el navegador bloquea autoplay de audio
  }
}
