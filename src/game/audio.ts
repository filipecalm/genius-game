const SOUND_URLS = [
  "/sounds/sound1.mp3",
  "/sounds/sound2.mp3",
  "/sounds/sound3.mp3",
  "/sounds/sound4.mp3",
] as const;

export function loadSounds(): HTMLAudioElement[] {
  return SOUND_URLS.map((path) => {
    const audio = new Audio(path);
    audio.volume = 1;
    audio.preload = "auto";
    return audio;
  });
}

export function playSound(sounds: HTMLAudioElement[], id: number): void {
  const sound = sounds[id];
  if (!sound) return;
  sound.currentTime = 0;
  void sound.play().catch(() => undefined);
}
