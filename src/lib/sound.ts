import type { UserSettings } from "@/contexts/settings-context";

export type ChessSoundType = "move" | "capture" | "check" | "gameStart" | "gameEnd";

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function playChessSound(type: ChessSoundType, settings: UserSettings) {
  if (!settings.masterSound) return;
  if (settings.volume <= 0) return;

  switch (type) {
    case "move":
      if (!settings.moveSound) return;
      break;
    case "capture":
      if (!settings.captureSound) return;
      break;
    case "check":
      if (!settings.checkSound) return;
      break;
    case "gameStart":
      if (!settings.gameStartSound) return;
      break;
    case "gameEnd":
      if (!settings.gameEndSound) return;
      break;
  }

  const ctx = getAudioContext();
  if (!ctx) return;

  const gain = ctx.createGain();
  const masterVolume = (settings.volume / 100) * 0.3; // safe max output volume
  gain.gain.setValueAtTime(masterVolume, ctx.currentTime);
  gain.connect(ctx.destination);

  const now = ctx.currentTime;

  if (type === "move") {
    const osc = ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.05);

    gain.gain.setValueAtTime(masterVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    osc.start(now);
    osc.stop(now + 0.05);
  } else if (type === "capture") {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(240, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.08);

    gain.gain.setValueAtTime(masterVolume * 1.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    osc.start(now);
    osc.stop(now + 0.08);
  } else if (type === "check") {
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    osc1.type = "sine";
    osc2.type = "sine";
    osc1.frequency.setValueAtTime(587.33, now); // D5
    osc2.frequency.setValueAtTime(880, now + 0.06); // A5

    gain.gain.setValueAtTime(masterVolume * 0.8, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc1.connect(gain);
    osc2.connect(gain);

    osc1.start(now);
    osc1.stop(now + 0.06);
    osc2.start(now + 0.06);
    osc2.stop(now + 0.18);
  } else if (type === "gameStart") {
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);

      const subGain = ctx.createGain();
      subGain.gain.setValueAtTime(masterVolume * 0.7, now + idx * 0.06);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.12);

      osc.connect(subGain);
      subGain.connect(gain);

      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.12);
    });
  } else if (type === "gameEnd") {
    const notes = [783.99, 659.25, 523.25]; // G5, E5, C5
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      const subGain = ctx.createGain();
      subGain.gain.setValueAtTime(masterVolume * 0.7, now + idx * 0.08);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.16);

      osc.connect(subGain);
      subGain.connect(gain);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.16);
    });
  }
}
